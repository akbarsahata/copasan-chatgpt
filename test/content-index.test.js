const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildContentIndex,
  toPublicMetadata,
  toSitemapEntries,
  findOrphanOutputs,
} = require('../lib/content-index');

const dates = (created, modified = created) => ({
  created,
  modified,
});

test('derives title, description and Article identity from a source', () => {
  const records = buildContentIndex(
    [
      {
        sourceName: 'hello-world.md',
        content: '# Hello World\n\nThis is the **first** paragraph.\n\nA second paragraph.\n',
      },
    ],
    dates({ 'hello-world.md': '2024-05-01T00:00:00.000Z' }, { 'hello-world.md': '2024-06-01T00:00:00.000Z' }),
  );

  assert.equal(records.length, 1);
  assert.deepEqual(records[0], {
    sourceName: 'hello-world.md',
    path: '/articles/hello-world.html',
    disqusId: 'hello-world.html',
    title: 'Hello World',
    desc: 'This is the first paragraph.',
    image: null,
    createdDate: '2024-05-01T00:00:00.000Z',
    modifiedDate: '2024-06-01T00:00:00.000Z',
  });
});

test('preserves hyphens and link text, and appends an ellipsis only when truncated', () => {
  const longParagraph = 'x'.repeat(200);

  const records = buildContentIndex(
    [
      {
        sourceName: 'a.md',
        content: '# A\n\nA well-known trade-off, see [the docs](https://example.com) for more.\n',
      },
      { sourceName: 'b.md', content: `# B\n\n${longParagraph}\n` },
    ],
    dates({
      'a.md': '2024-01-01T00:00:00.000Z',
      'b.md': '2024-01-02T00:00:00.000Z',
    }),
  );

  const byName = Object.fromEntries(records.map((record) => [record.sourceName, record]));
  assert.equal(byName['a.md'].desc, 'A well-known trade-off, see the docs for more.');
  assert.equal(byName['b.md'].desc, `${'x'.repeat(150)}...`);
});

test('records the first inline image and ignores images inside code fences', () => {
  const content = [
    '# C',
    '',
    '```js',
    '![not me](https://example.com/inside.png)',
    '```',
    '',
    '![cover](https://example.com/cover.png)',
    '',
    'Paragraph.',
    '',
  ].join('\n');

  const [record] = buildContentIndex(
    [{ sourceName: 'c.md', content }],
    dates({ 'c.md': '2024-01-01T00:00:00.000Z' }),
  );

  assert.equal(record.image, 'https://example.com/cover.png');
  assert.equal(record.desc, 'Paragraph.');
});

test('sorts records by Created date descending, tie-broken by source name', () => {
  const records = buildContentIndex(
    [
      { sourceName: 'b.md', content: '# B\n\nSecond newest.\n' },
      { sourceName: 'c.md', content: '# C\n\nSame date as a.\n' },
      { sourceName: 'a.md', content: '# A\n\nNewest.\n' },
    ],
    dates({
      'a.md': '2025-01-01T00:00:00.000Z',
      'b.md': '2024-01-01T00:00:00.000Z',
      'c.md': '2025-01-01T00:00:00.000Z',
    }),
  );

  assert.deepEqual(
    records.map((record) => record.sourceName),
    ['a.md', 'c.md', 'b.md'],
  );
});

test('falls back to the Created date when no Modified date is known', () => {
  const [record] = buildContentIndex(
    [{ sourceName: 'a.md', content: '# A\n\nText.\n' }],
    { created: { 'a.md': '2024-03-01T00:00:00.000Z' }, modified: {} },
  );

  assert.equal(record.modifiedDate, '2024-03-01T00:00:00.000Z');
});

test('fails on an Article without an H1 title', () => {
  assert.throws(
    () => buildContentIndex([{ sourceName: 'broken.md', content: 'No heading here.\n' }], dates({})),
    /Article "broken\.md" has no H1 title/,
  );
});

test('returns an empty description when the Article has no paragraph', () => {
  const [record] = buildContentIndex(
    [{ sourceName: 'list.md', content: '# List\n\n- only\n- a list\n' }],
    dates({ 'list.md': '2024-01-01T00:00:00.000Z' }),
  );

  assert.equal(record.desc, '');
});

test('projects the public Metadata file keyed by Article identity', () => {
  const records = buildContentIndex(
    [
      { sourceName: 'newer.md', content: '# Newer\n\nNewest Article.\n' },
      { sourceName: 'older.md', content: '# Older\n\nOld Article.\n' },
    ],
    dates({
      'newer.md': '2025-01-01T00:00:00.000Z',
      'older.md': '2024-01-01T00:00:00.000Z',
    }),
  );

  assert.deepEqual(toPublicMetadata(records), {
    'newer.html': {
      title: 'Newer',
      desc: 'Newest Article.',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    'older.html': {
      title: 'Older',
      desc: 'Old Article.',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  });
});

test('projects sitemap entries with the newest Modified date on the Home Page', () => {
  const records = buildContentIndex(
    [
      { sourceName: 'a.md', content: '# A\n\nA.\n' },
      { sourceName: 'b.md', content: '# B\n\nB.\n' },
    ],
    {
      created: { 'a.md': '2024-01-01T00:00:00.000Z', 'b.md': '2024-02-01T00:00:00.000Z' },
      modified: { 'a.md': '2025-01-15T00:00:00.000Z', 'b.md': '2025-02-20T00:00:00.000Z' },
    },
  );

  assert.deepEqual(toSitemapEntries(records, { siteUrl: 'https://example.com' }), [
    {
      loc: 'https://example.com',
      lastmod: '2025-02-20',
      changefreq: 'daily',
      priority: '1.0',
    },
    { loc: 'https://example.com/articles/b.html', lastmod: '2025-02-20' },
    { loc: 'https://example.com/articles/a.html', lastmod: '2025-01-15' },
  ]);
});

test('omits the Home Page lastmod when there are no Articles', () => {
  assert.deepEqual(toSitemapEntries([], { siteUrl: 'https://example.com' }), [
    { loc: 'https://example.com', changefreq: 'daily', priority: '1.0' },
  ]);
});

test('detects published Article Pages that no longer have a source', () => {
  const records = buildContentIndex(
    [{ sourceName: 'kept.md', content: '# Kept\n\nKept.\n' }],
    dates({ 'kept.md': '2024-01-01T00:00:00.000Z' }),
  );

  assert.deepEqual(findOrphanOutputs(records, ['kept.html', 'stale.html', 'notes.txt']), [
    'stale.html',
  ]);
});
