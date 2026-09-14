# Copasan ChatGPT

A personal blog where each Article is authored as markdown and published as a static page.

## Language

**Article**:
A markdown document in `docs/` that is published as its own page on the blog.
_Avoid_: post, entry, doc

**Article Page**:
The rendered page for one Article.
_Avoid_: post page, detail page

**Home Page**:
The blog's index page, listing Articles newest first.
_Avoid_: landing page, feed

**Metadata**:
An Article's title, description, and Created date.
_Avoid_: front matter, attributes

**Created date**:
When an Article was first added to the repository, not when it was last edited.
_Avoid_: publish date, updated date, timestamp

**Modified date**:
When an Article was last edited in the repository.
_Avoid_: updatedAt, lastmod

**Article identity**:
The canonical way an Article is named across the site: its source filename, its published path, and its Disqus identifier.
_Avoid_: slug, key

**Content Index**:
The complete catalog of Articles, derived from the markdown sources rather than stored.
_Avoid_: cache, manifest, registry
