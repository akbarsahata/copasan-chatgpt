# Caching Authenticated APIs with ETags: A Practical Guide

Caching a public website is easy: slap `Cache-Control: public, max-age=3600` on it and move on. Caching an API behind a login is where it gets interesting. Every response is per-user, one leak is a security incident, and a badly chosen validator can serve yesterday's numbers under today's label.

This post is a field guide to doing it properly: the mental model, a per-endpoint policy, server and client implementation, and the mistakes that bite teams in production.

## 1. The 60-second mental model

HTTP caching has two independent concepts that people constantly mix up:

- **Freshness** — "may I reuse this without asking?" Controlled by `max-age`, `s-maxage`, `immutable`.
- **Validation** — "is my stored copy still correct?" Controlled by `ETag` + `If-None-Match` (or `Last-Modified` + `If-Modified-Since`).

A conditional request looks like this:

```
GET /reports/summary
If-None-Match: W/"8f14e45f"

→ 304 Not Modified        (validators match, no body)
→ 200 OK + new body       (validators differ)
```

| Directive | Meaning |
|---|---|
| `max-age=N` | Fresh for N seconds in any cache |
| `s-maxage=N` | Same, but shared caches only (CDN, proxy) |
| `no-cache` | May store, **must validate on every reuse** |
| `no-store` | Never store. Nothing. |
| `private` | Browser cache only; shared caches must not store |
| `public` | Shared caches may store (even normally-private responses) |
| `must-revalidate` | Once stale, don't serve stale even offline |
| `immutable` | Don't revalidate during freshness (fingerprinted assets) |

The name `no-cache` is the worst-named header in HTTP: it does **not** mean "don't cache". It means "cache it, but ask me every time." That is exactly the policy you want for most authenticated aggregates — combined with a validator that makes "asking" cheap in bytes.

## 2. What an ETag actually promises

An ETag identifies a **representation**, not a resource. Two variants of the same URL (say, gzipped and not) are different representations and can have different ETags.

- **Strong** (`"abc123"`) — byte-for-byte identical. Required for range requests (`If-Range`).
- **Weak** (`W/"abc123"`) — semantically equivalent; a byte difference (whitespace, compression) doesn't invalidate it. Fine for conditional GETs and easier to generate safely.

Two ways to produce the validator, with very different costs:

1. **Content hash** — hash the response body. Exact and automatic; saves bandwidth but **not CPU**, because you still generated the body.
2. **Change token** — hash cheap metadata instead (data version, role version, report date, query). Saves CPU *and* bandwidth, but only if the token truly captures every input. Miss one and you serve stale 304s forever.

Rule of thumb: start with content hashes. Graduate to change tokens where measurements justify it, and write tests for every input that must invalidate.

## 3. The authentication-shaped constraint

Every response that depends on a session must declare it:

```
Cache-Control: private, no-cache
Vary: Cookie
```

- `private` keeps shared caches (corporate proxies, CDNs) from ever storing per-user data.
- `Vary: Cookie` tells caches that the response varies by the `Cookie` request header. Note the HTTP cache default: responses to requests carrying `Authorization` are treated specially, but **cookie-based auth gets no such protection** — you must be explicit.

One subtle trap: if your server rotates the session cookie on every response, `Vary: Cookie` will key each stored entry on a slightly different value, browser reuse can collapse to zero, and you'll revalidate far less than expected. Either stabilize the cookie value, or measure reuse and accept it.

And the security invariant: **the validator must change when the authorization context changes**. If the body differs by role, scope, or entitlement, a content-hash ETag handles that automatically. A metadata token must include the user/role/entitlement version — otherwise user A's tag could produce a 304 for user B.

## 4. Pick a policy per endpoint category

| Response kind | Example | Cache-Control | Validator | Skips compute? |
|---|---|---|---|---|
| Fingerprinted assets | `/app.4f2a.js` | `public, max-age=31536000, immutable` | filename | N/A |
| Shared reference data | currencies, countries | `private, max-age=300, must-revalidate` | content hash | no |
| Per-user aggregates | dashboards, reports | `private, no-cache` | content hash or token | token only |
| Sensitive/volatile detail | person rows, audit trails | `private, no-store` | none | — |
| Mutations, errors | POST/PUT, 4xx/5xx | `no-store` | none | — |

Notice the shape of the trade-off: **`no-cache` + ETag** is the workhorse for logged-in APIs. You keep the data safe in the browser, you revalidate on every use, and when nothing changed you only pay for headers.

## 5. Server-side implementation

Most frameworks already generate weak ETags and convert `If-None-Match` into a 304 if you send through the standard response path. Verify that first — you may only need to add policy headers. Here's a generic Express-flavored sketch.

**Step 1: a policy middleware.**

```js
function cachePolicy(kind) {
  return (req, res, next) => {
    if (kind === 'aggregate') {
      res.set('Cache-Control', 'private, no-cache');
      res.vary('Cookie');
      res.vary('Accept-Encoding');
    } else if (kind === 'detail') {
      res.set('Cache-Control', 'private, no-store');
      res.vary('Accept-Encoding');
    }
    next();
  };
}

router.get('/reports/summary', authorize, cachePolicy('aggregate'), handler);
router.get('/reports/:id/people', authorize, cachePolicy('detail'), handler);
```

Use `res.vary(...)` rather than setting `Vary` wholesale so you don't clobber other components (CORS, compression) that also vary the response.

**Step 2: let the framework hash the body — or set the tag yourself.**

If you pre-set an ETag before the response is sent, most frameworks keep yours instead of generating one:

```js
const crypto = require('crypto');

const tag = `W/"${crypto.createHash('sha1').update(body).digest('base64url')}"`;
res.set('ETag', tag);
```

If your compression layer runs after this point, decide deliberately: either compute the tag on the **encoded** bytes, or keep it weak and set `Vary: Accept-Encoding`. Never let a strong tag describe a representation other than the exact bytes on the wire.

**Step 3: skip the expensive work with a change token (optional).**

This is the pattern that actually saves server time:

```js
async function conditionalReport(req, res, next) {
  // Must include: data version, report date, user, roles/scope, all query params
  const token = await reportVersionToken(req);
  const etag = `"${crypto.createHash('sha1').update(token).digest('base64url')}"`;

  if (req.headers['if-none-match'] === etag) {
    res.set('ETag', etag);
    res.set('Cache-Control', 'private, no-cache');
    return res.status(304).end();
  }

  const body = await buildReport(req);
  res.set('ETag', etag);
  res.set('Cache-Control', 'private, no-cache');
  res.locals.data = body;
  next();
}
```

Two notes. First, real code should parse `If-None-Match` properly (it can be a list, and weak comparison applies); use your framework's freshness helper rather than string equality. Second, **authentication and authorization always run before this middleware** — conditional logic must never be a bypass.

## 6. What the browser does for you

For same-origin `fetch` and XHR with the default cache mode, the browser participates in the HTTP cache automatically: it stores the response, attaches `If-None-Match` when revalidating, and hands your JavaScript the cached body when the server answers 304. Your code sees a normal 200 — the 304 dance is invisible.

```js
// default: participates in HTTP cache, revalidates per Cache-Control
fetch('/api/reports/summary');

// force revalidation even during freshness (rarely needed with no-cache)
fetch('/api/reports/summary', { cache: 'no-cache' });

// bypass HTTP cache entirely
fetch('/api/reports/summary', { cache: 'no-store' });
```

Gotchas:

- Don't set `If-None-Match` yourself; let the browser manage validators.
- Adding a request header `Cache-Control: no-cache` can disable 304 handling in many servers' freshness checks, turning every revalidation into a full 200. Don't add it casually.
- ETags do nothing for out-of-order responses. If a user toggles filters quickly, keep an abort controller and a request sequence guard; a stale 200 will happily overwrite a fresh one.
- Service workers sit in front of this pipeline; if you add one, make sure it delegates or deliberately bypasses these requests.

## 7. Test and measure

Curl is enough to verify the contract:

```bash
# First call: capture the validator
curl -si -b cookies.txt https://api.example.com/reports/summary | grep -i -E 'etag|cache-control|vary'

# Second call: expect 304 and an empty body
curl -si -b cookies.txt \
  -H 'If-None-Match: W/"8f14e45f"' \
  https://api.example.com/reports/summary
```

In integration tests, assert three things per aggregate endpoint: the policy headers are present, a matching `If-None-Match` yields 304, and two different users/scopes never validate each other's content. Then instrument: **304 ratio** per endpoint, bytes on the wire before/after, and revalidation latency. If the 304 ratio is near zero, your validator is changing too often; if CPU didn't move, you're only saving bytes — which may still be exactly the goal.

## 8. Pitfalls checklist

1. `no-cache` ≠ `no-store`. Pick intentionally.
2. Authenticated responses: `private` always, `public` never.
3. `Vary: Cookie` plus per-response cookie rotation can silently kill reuse.
4. A metadata ETag must include user, roles/scope, all query params, report date, and schema version. Test each one.
5. Compression changes the representation; set `Vary: Accept-Encoding` and compute the tag over the sent bytes.
6. 304 responses must repeat `ETag`, `Cache-Control`, and `Vary`; assert it.
7. `Last-Modified` has one-second granularity and produces false positives; prefer ETags.
8. `no-store` endpoints may still receive a framework-generated ETag; clients that honor `no-store` won't use it, but know it's there.
9. Never cache mutations or error responses — `no-store`.
10. Conditional handling runs **after** authn/authz, never instead of it.
11. Weak ETags are fine for conditional GET but not for range requests.
12. A 304 still executes your server code unless you use a change token. Don't claim a CPU win you didn't measure.

## 9. A reasonable rollout order

1. Add explicit `Cache-Control` and `Vary` headers per endpoint category.
2. Enable (or verify) content-hash ETags and automatic 304 handling.
3. Write tests for the 304 flow, header presence, and cross-user isolation.
4. Instrument 304 ratio and bytes saved; compare before/after.
5. Only where revalidation CPU is a measured problem, introduce change tokens — with tests for every invalidation input.
6. Keep sensitive detail endpoints on `no-store` and re-check entitlements on every request, regardless of caching.

ETags won't make a slow endpoint fast. But a disciplined `private, no-cache` + validator policy turns a dashboard that re-downloads megabytes on every visit into a few hundred bytes of headers, without ever risking a wrong user's data. That's a very good trade — as long as you respect what the validator actually promises.
