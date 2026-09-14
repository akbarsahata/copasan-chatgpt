# Spec: Site Reskin — the Blog wears the Personal Site's aesthetic

Status: ready-for-agent

## Problem Statement

A reader follows the Blog link from akbarsahata.id and lands on blog.akbarsahata.id, and the illusion of one personal site breaks immediately: light backgrounds and `#007acc` blue against the personal site's dark slate; Arial and Calibri against Inter and Zilla Slab; no header, no nav, no footer; a full-bleed Home Page against the personal site's 46rem measure. The Blog looks like a different, older project. It also carries legacy Netlify fallback renderers holding a second, already-diverging copy of the light theme, so there are two visual systems to maintain and no single source of truth.

## Solution

The Blog adopts the personal site's design language wholesale. The personal site's stylesheet is vendored as the Blog's theme stylesheet — tokens, typography, shell, cards, tags — so the two cannot drift without an intentional edit. Every page gains the same header (brand and nav) and the same footer; the Home Page takes the personal hero's shape; Article Pages read at the same measure with every widget restyled from the same tokens, including dark syntax highlighting. A shared layout renderer emits the shell once. Legacy fallback renderers are deleted and build guards assert the shell survives future edits. Observable outcome: clicking Blog from the personal site feels like moving within one site.

## User Stories

1. As a reader arriving from the personal site, I want the same dark palette and typography, so the Blog feels like part of the same site.
2. As a reader, I want the same header shell (brand and nav) on the Home Page and every Article Page, so orientation and navigation feel identical.
3. As a reader, I want the Blog marked as the current nav section, so I know where I am.
4. As a reader, I want the nav's Home, Profile, Projects, and Publications items to link back to the personal site, so I can move between sections.
5. As a reader, I want the brand to return me to the personal site, matching the personal site's own brand behaviour.
6. As a reader, I want the same footer (social links and copyright) as the personal site, so the page ends the same way.
7. As a reader, I want a hero on the Blog Home Page shaped like the personal home page's hero, so landing feels continuous.
8. As a reader, I want the hero's lead to reuse the Blog's existing description, so no new copy is invented.
9. As a reader, I want Article cards to use the personal site's card treatment, so the Home Page looks native to the family.
10. As a reader, I want search and its results styled for the dark theme, so search remains usable.
11. As a reader, I want headings in Zilla Slab and body text in Inter at the personal site's measure, so reading an Article feels consistent.
12. As a reader, I want code blocks, inline code, tables, and blockquotes styled for a dark page with syntax colours that fit the palette, so technical Articles stay readable.
13. As a reader, I want images and the comments divider styled in the theme, so no light patch breaks the page.
14. As a reader, I want no redundant "Back to Home" button now that the header navigates, so the top of an Article stays clean.
15. As a reader on a narrow screen, I want the fixed share buttons hidden, so they never overlap the text.
16. As a reader, I want the copy-code button and back-to-top button restyled, so their behaviour is unchanged but they look at home.
17. As a reader, I want the tab icon (favicon) to match the personal site, so the Blog is recognisable among open tabs.
18. As a reader on mobile, I want the browser chrome colour to match the dark theme, so the page looks finished edge to edge.
19. As a reader sharing an Article, I want the same canonical/Open Graph/Twitter meta pattern as the personal site, so shared links render consistently.
20. As the author, I want the Blog to remain dark-only, matching the personal site, so there is no second theme to maintain.
21. As the author, I want one vendored theme stylesheet to be the single source of visual truth, so page stylesheets carry only page-specific rules.
22. As the author, I want a shared layout renderer, so the head, header, and footer exist once rather than duplicated per page type.
23. As the author, I want the legacy Netlify fallback renderers deleted, so no second copy of the light theme can drift.
24. As the author, I want the dependency that existed only for the fallbacks removed, so the package manifest tells the truth.
25. As the author, I want style URLs to change when styles change, so returning readers are not stuck with the light theme from cache.
26. As the author, I want build validation to check the new theme asset instead of the deleted fallbacks, so validation reflects reality.
27. As the author, I want the search placeholder to say "Search articles…" per the project glossary, so the site speaks its own domain language.
28. As the author, I want the generated output regenerated by the build and committed, so deployment serves the reskinned pages.
29. As the author, I want the personal site's nav to gain a Blog item, so both navs mirror each other and the loop closes from the personal site.
30. As a maintainer, I want build guards that assert the shell and theme are present in generated pages, so a future edit cannot silently un-skin the Blog.
31. As a maintainer, I want no new test seams, so the existing build integration seam keeps carrying the load.
32. As the author, I want documentation that mentions the deleted fallbacks corrected, so the next reader is not misled.

## Implementation Decisions

- **Vendored theme stylesheet.** The personal site's stylesheet is copied into the Blog as the theme stylesheet, verbatim: tokens (`--bg`, `--bg-elev`, `--border`, `--blue`, `--blue-soft`, `--accent`, `--accent-strong`, `--text`, `--heading`, `--muted`, radius, measure), base typography, focus/selection styles, skip link, header/nav/footer shell, card and tag components.
- **Page stylesheets slimmed.** The Home and Article Page stylesheets keep only page-specific rules (hero, search and results, card footer; prose, code, widgets, comments divider). Unused rules are deleted.
- **Shared layout renderer.** A new module takes page content plus per-page head values and emits the complete document. Home and Article Page renderers both use it; the shell exists once.
- **Head metadata pattern.** Canonical URL per page, `og:type` (website/article), `og:site_name`, `og:locale`, `twitter:card`, author, theme-color, favicon links — matching the personal site's pattern. The Blog's own Open Graph images (default and per-Article) are retained.
- **Fonts.** Inter and Zilla Slab from Google Fonts with preconnects. The Calibri family request (not served by Google Fonts) is dropped, along with any stylesheet dependency that no longer matches.
- **Shell content.** Brand "Akbar Sahata" links to the personal site root. Nav: Home, Profile, Projects, Publications — absolute links to the personal site — plus Blog (the Blog home, marked current on both the Home Page and Article Pages). Footer social list and copyright are copied verbatim.
- **Home Page.** Hero eyebrow "Blog", h1 "Akbar Sahata's Blog", lead is the existing site description; then search input and results, then Article cards. Card wording is unchanged ("Created at", comment count) and restyled as muted meta; the placeholder becomes "Search articles…".
- **Article Page.** Content sits inside the shared container at the personal site's measure. The Back-to-Home button is removed. The fixed share cluster is hidden below a breakpoint (~56rem) and restyled; back-to-top is kept and restyled; the copy-code button is restyled; the comments divider is themed. No date line is added.
- **Syntax highlighting.** Prism theme switched to tomorrow at the same CDN version, with background and border colours overridden to theme tokens.
- **Disqus.** Embed code unchanged. The forum theme is switched to Dark manually in Disqus admin; this is a recorded manual step, not code.
- **Dark only.** `color-scheme: dark` and theme-color match the personal site. No toggle.
- **Deletions.** Legacy Netlify fallback renderers are deleted; the dependency used only by them is removed from the package manifest; build validation drops the fallback checks and validates the theme asset instead.
- **Cache-busting.** Style link URLs carry a version token that is bumped whenever visual styles change; the existing immutable cache policy for style assets is unchanged.
- **Personal site.** Its header nav gains a Blog item linking to the Blog. This is a separate repository and a separate commit, but part of this effort.
- **Data layer untouched.** Content Index, Metadata, sitemap, Article identity, and the search payload shape are unchanged.
- **Documentation.** Docs referencing the deleted fallbacks are corrected narrowly.
- **Committed output.** Generated HTML is regenerated by the build and committed, as the repository already requires.

## Testing Decisions

- **What makes a good test here:** assert externally observable output through the existing build seam — required content appears in generated pages. No byte-exact HTML snapshots, no CSS-value assertions, no client-side JavaScript tests.
- **Single seam — the build integration test.** The existing smoke test that runs the build into temporary directories is the only seam, and it is reused rather than replaced. It gains assertions: theme stylesheet linked on Home and Article Pages; favicon links and theme-color present; header brand and all five nav items present with Blog marked current; footer social links and copyright present; Back-to-Home button absent; share and back-to-top markup retained.
- **Build validation updated.** The validation script checks the theme asset's presence and that generated pages reference it, and drops the fallback-function checks. Existing cache-header checks remain.
- **Existing tests stay green.** Escaping, Open Graph URLs, Disqus identifiers, Metadata ordering, and sitemap assertions are unaffected by the reskin.
- **Prior art:** the existing build integration test and the build validation script. No new test patterns are introduced.
- **Explicitly not tested:** CSS values, visual rendering, client-side JavaScript, and Disqus rendering.
- **Acceptance:** run the build and the test suite; serve the output and compare side by side against the personal site (header, footer, palette, typography, cards, Article prose, code); confirm the versioned stylesheet loads for a returning browser.

## Out of Scope

- Light mode or a theme toggle.
- Adding analytics (for example, Google Tag Manager) to the Blog.
- Theming Disqus from code.
- New Article content features: dates on Article Pages, thumbnails, tags, RSS.
- Restyling the personal site beyond adding the Blog nav item.
- URL, sitemap, Metadata, or Content Index changes.
- Broader dependency cleanup (the unused Express entry and stale scripts) and performance work.

## Further Notes

- **One knowingly visible seam remains:** until the Disqus forum theme is set to Dark in the admin panel, the comment section renders light. It cannot be reached from page CSS; the embed is an iframe.
- **Cache-busting discipline:** the style version token must be bumped on any future visual edit, or returning readers keep the old theme for up to a year under the immutable cache policy.
- **Assets:** the personal site's favicon is a 16x16 icon; the Blog's current favicon is unreferenced and is replaced by the personal site's.
- **No ADRs exist** in either repository; no existing decision is contradicted.
- **Seam confirmation:** one seam (the existing build-entry integration test). Dropping the guards would leave only manual visual acceptance to catch an un-skinning regression.
