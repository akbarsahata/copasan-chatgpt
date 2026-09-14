# Spec: Content Index — one derived catalog of Articles

Status: ready-for-agent

## Problem Statement

The blog author cannot trust a build. On a fresh checkout the pipeline publishes an empty `metadata.json`, a Home Page with zero cards, and a sitemap with only the homepage — and the build still reports success, because Metadata is read from a cache that a later stage writes. On incremental builds an edited Article's card and sitemap entry keep the old title and description for one full build, and a new Article does not appear until the next build. Editing an old Article resets its Created date, bumping it to the top of the Home Page. The generator emits `.md` URLs and Disqus identifiers for Article Pages while the committed output was hand-patched to `.html`, so any rebuild silently regresses share links. Deleted markdown leaves orphaned Article Pages deployed. Nothing here is covered by tests, and the scripts cannot be imported to write any.

## Solution

Introduce a Content Index: one module that derives the complete catalog of Articles from the markdown sources, and is the only place that produces Metadata, Article identity, and the projections the site needs (the public Metadata file, Home Page card data, sitemap entries, orphan detection). The build becomes stateless and deterministic: every build processes every Article, in one fixed order, through one entry point. Created dates come from repository history, so they are real publication dates. Share links and Disqus identifiers use one canonical Article identity. Deleted Articles are swept from the output after a successful build. The observable outcome for the author: one build, one consistent site — locally and in CI.

## User Stories

1. As the blog author, I want a clean checkout build to publish every Article, so that a CI deploy never ships an empty Home Page.
2. As the blog author, I want a newly added Article to appear on the Home Page, in the public Metadata file, and in the sitemap in the same build, so that I never have to build twice.
3. As the blog author, I want an edited Article's title and description to update everywhere in the same build, so the Home Page card and the Article Page never disagree.
4. As the blog author, I want Metadata to be derived from the markdown sources on every build, so that builds are reproducible rather than cache-dependent.
5. As the blog author, I want builds to be stateless, so a fresh clone behaves exactly like a local build.
6. As the blog author, I want Created dates to reflect when an Article was first added, so editing an old Article does not bump it to the top of the Home Page.
7. As the blog author, I want Created dates derived from repository history, so I do not maintain dates by hand.
8. As the blog author, I want a healthy fallback when repository history is unavailable, so a shallow clone does not date every Article to the build and collapse the Home Page ordering.
9. As a reader, I want the Home Page sorted newest first by Created date, with deterministic tie-breaking, so the ordering never depends on filesystem read order.
10. As the blog author, I want the sitemap's `lastmod` for an Article to reflect its Modified date, so search engines see an honest change signal.
11. As the blog author, I want the Home Page's sitemap entry to change only when content changes, so ordinary builds do not churn the sitemap.
12. As the blog author, I want an Article's title to come from its first H1, so the card and the Article Page title agree.
13. As a reader, I want descriptions to be readable plain text without mangled hyphenated words, so cards read properly.
14. As a reader, I want truncated descriptions to end with an ellipsis only when actually truncated, so short descriptions are not misleading.
15. As the blog author, I want titles and descriptions escaped where they are rendered, so quotes or angle brackets in markdown do not break the generated HTML.
16. As the blog author, I want an Article without an H1 to fail the build with a clear message, so broken content never publishes silently.
17. As the blog author, I want a missing description to warn but still publish, so a cosmetic gap does not block a release.
18. As a reader, I want Open Graph and share URLs to point at the real Article Page path, so shared links do not 404.
19. As a reader, I want Disqus identifiers to use the same Article identity as the links, so comment threads are not split across spellings.
20. As a reader, I want the Home Page search index to keep the shape it already consumes, so search keeps working through this change.
21. As the blog author, I want one build entry point with a fixed stage order, so pipeline order stops being an implicit, easily-inverted contract.
22. As the blog author, I want a deleted markdown source to remove its Article Page on the next build, so stale pages are not deployed.
23. As the blog author, I want orphan removal to happen only after every Article has rendered successfully, so a failed build never deletes output.
24. As the blog author, I want the build to report what it swept, so unexpected deletions are visible in the build log.
25. As the blog author, I want the site's domain and identity to come from one place, so changing the domain does not require edits across several modules.
26. As the blog author, I want renderers to receive the site identity and the Article records as parameters, so rendering can be exercised without a real site.
27. As a maintainer, I want the Content Index to be a pure module that takes source content and date maps, so it can be tested without a filesystem or a git repository.
28. As a maintainer, I want git consulted once per build in a single pass, so the build does not spawn a process per Article.
29. As a maintainer, I want the Content Index to return records sorted deterministically, so every projection inherits a stable order.
30. As a maintainer, I want separate small projection functions for the public Metadata file, sitemap entries, and orphan detection, so each can be tested on its own.
31. As a maintainer, I want importable modules separated from command-line entry points, so the logic that changed today cannot hide behind require-time side effects again.
32. As a maintainer, I want fixture-based unit tests for derivation, identity, ordering, dates, and orphan detection, so regressions fail fast.
33. As a maintainer, I want one integration smoke test that builds into a temporary output directory, so a wiring break between the index and the renderers is caught.
34. As a maintainer, I want no full-HTML snapshot tests, so tests assert behaviour and content, not formatting.
35. As the blog author, I want the existing build validation to keep running after the new build, so previously enforced checks still protect a deploy.
36. As the blog author, I want the project documentation to describe the new pipeline, so the next explorer does not follow the inverted stage order we removed.
37. As the blog author, I want the root-level Metadata file retired, so there is exactly one generated Metadata projection for the site.
38. As the blog author, I want the build cache deleted rather than repaired, so no stage can read state another stage was supposed to write.
39. As a maintainer, I want the build's acceptance checked against the committed output with an explicit list of expected differences, so we distinguish intended fixes from new drift.

## Implementation Decisions

- **New module: Content Index.** Owns discovery inputs, Metadata derivation, Article identity, and projections. Pure: source content and date maps in; records and projections out. No filesystem, no git, no console output inside.
- **Interface (decided type shape):** `buildContentIndex(docs, dates) -> records`, where `docs` is `[{ sourceName, content }]` and `dates` is `{ created, modified }` maps keyed by source name. Projections live in the same module: `toPublicMetadata(records)`, `toSitemapEntries(records, site)`, `findOrphanOutputs(records, existingFiles)`.
- **Article record shape (decided type shape):**
  ```
  {
    sourceName,     // markdown filename
    path,           // published path, /articles/<name>.html
    disqusId,       // the .html name
    title,
    desc,
    createdDate,    // ISO 8601 UTC
    modifiedDate    // ISO 8601 UTC
  }
  ```
- **Canonical Article identity:** source name, published `.html` path, and Disqus identifier are produced together by the index. No renderer or client script derives them with string replacement.
- **Canonical URL form stays `.html`.** Existing share links and Disqus threads depend on it; extensionless URLs are not adopted.
- **Deterministic order:** records sorted by Created date descending, tie-broken by source name. All projections inherit this order.
- **Created date:** derived from repository history (first commit that added the file), normalized to UTC. **Modified date:** last commit touching the file, same pass. One batched git invocation, not one per Article.
- **Date fallback chain:** when repository history is unavailable, reuse the value from the previously generated public Metadata projection; otherwise fall back to the build time, warning per Article. Modified date falls back to the resolved Created date.
- **Derivation rules:** title is the first H1; a missing H1 is a hard build failure. Description is the first paragraph after the title, markdown-stripped with intra-word hyphens preserved, trimmed, capped at 150 characters, with `...` appended only when truncation occurred. A missing description warns; the value is an empty string.
- **Escaping belongs at the renderer.** The index stores plain text; renderers HTML-escape titles and descriptions for attributes and body.
- **Site identity module:** a minimal set of constants — site URL, title, description, image, Disqus shortname — passed to renderers as a parameter, not imported by the index or renderers. CDN library versions and asset URLs stay in the renderers.
- **Build entry point:** one command-line entry that reads sources, resolves dates, builds the index, calls the three renderers, writes the public Metadata projection, the Home Page, Article Pages, and the sitemap, then sweeps orphans. Fixed order, no conditional stages.
- **Renderers:** three small modules — Article Page, Home Page, sitemap — each a function of `(site, records)` or `(site, record)` returning content. The Home renderer also provides the deterministic Home Page card order and keeps the existing client-side search payload shape.
- **Orphan sweep:** after all renders and writes succeed, delete published Article Pages not named by the index; report each removal. Never touch anything outside the published Article Pages directory.
- **Retired:** the four generate scripts, the build-cache module and its cache file (including the ignore entry), and the root-level generated Metadata file. The cache's change detection is not reimplemented; statelessness is the decision. If incremental rendering is ever needed it returns as an internal seam behind the same interface.
- **npm scripts:** `build` runs the build entry, then the existing asset copy, then the existing validation. `test` runs the built-in Node test runner. The `generate:*` scripts are removed.
- **Project docs:** the pipeline and layout sections of `OPTIMIZATION.md` and `DEPLOYMENT.md` are corrected narrowly to match the new build.
- **Home Page sitemap entry:** `lastmod` becomes the newest Modified date among Articles; `changefreq` and `priority` are unchanged.
- **Error modes:** hard failure for an unreadable source or a missing H1 (exit non-zero); warnings for an empty description and for fallback dates; the build summary reports hard failures vs warnings.
- **Domain vocabulary** for this work is recorded in `CONTEXT.md`: Article, Article Page, Home Page, Metadata, Created date, Modified date, Article identity, Content Index.

## Testing Decisions

- **What makes a good test here:** exercise the module's external behaviour through its interface — fixture sources in, records and projections out. No assertions on private helpers, no asserting that a particular function called another. Renderer tests assert that required content appears, not byte-exact markup.
- **Seam 1 — the Content Index interface (primary, highest data seam).** All derivation and projection behaviour is tested here: title and description derivation (including hyphen preservation and truncation-only ellipsis), Article identity fields, deterministic ordering, Created/Modified date fallback behaviour, public Metadata projection shape, sitemap entry projection, and orphan detection. Tests pass fixture documents and date maps; no filesystem, no git.
- **Seam 2 — the build entry (one integration smoke).** Run the build against fixture sources into a temporary output directory and assert that the expected files exist and that key contents are correct (Article count, Home Page cards, Metadata keys, sitemap coverage, orphan removal). This is the only test that touches the filesystem, and it is the single end-to-end guard.
- **Zero existing seams:** the codebase has no tests and no importable build modules today, so both seams are new and intentionally minimal. The ideal number of seams is one; the integration seam exists because wiring breakage between index, renderers, and writes is invisible through the data seam alone.
- **Date resolution from git is not unit-tested.** It is a single adapter-like step at the build entry; the fallback behaviour it feeds is tested at Seam 1 through the date maps. This avoids building a fake git.
- **Explicitly not tested:** full generated HTML snapshots, CSS, and client-side JavaScript behaviour.
- **Acceptance against the committed output:** after implementation, run the build and reconcile against the committed `public/` with an enumerated expected-diff list — repaired descriptions, `.html` identity in Article Open Graph and Disqus, real Created dates, Modified dates in the sitemap, deterministic Metadata order, swept orphans — and investigate anything outside the list. Generating output is in scope; committing it is a separate decision.

## Out of Scope

- Deleting the legacy Netlify functions and their dependents (`node-fetch`, the docs copy step, the published markdown copies, the validation check that verifies them). The docs copy step remains in the build.
- Full site config and page shell consolidation beyond the minimal site identity module.
- Strengthening build validation into real invariants, and removing generated output from version control.
- Incremental build caching or change detection of any kind.
- Adopting extensionless Article URLs.
- Replacing the Home Page's client-side search behaviour or changing the public Metadata shape.
- Cleaning up unrelated loose ends: the unreferenced title script, the unused Express dependency, the stale `main`/`start` entries, the stale README description.
- Updating sitemap `changefreq`/`priority` policy.

## Further Notes

- This work was selected from an architecture review. The reproduced evidence: a clean build exited 0 with 0 Home Page cards, 0 Metadata entries, 1 sitemap URL, and validation PASS; and the generator emitted `og:url …<name>.md` and `page.identifier "<name>.md"` where the committed output had been hand-patched to `.html` in commit `8ce3cfa`.
- No ADRs exist in this repository; no existing decision is contradicted.
- The root Metadata file and build cache are removed, so a commit that accepts this work will show deletions of generated files; that is expected.
- `CONTEXT.md` was created during design and already reflects this spec's vocabulary.
- Seams to confirm before implementation: Seam 1 (Content Index interface) for all behaviour, Seam 2 (build entry) for a single integration smoke. If a leaner shape is preferred, the integration smoke could be dropped and the build-entry wiring covered by running the real build once as acceptance — at the cost of losing the automated end-to-end guard.
