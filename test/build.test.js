const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { runBuild } = require('../scripts/build');

const site = {
  siteUrl: 'https://example.com',
  title: 'Example Blog',
  description: 'Example description.',
  image: '/image.webp',
  disqusShortname: 'example',
  personalUrl: 'https://akbarsahata.id',
};

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-index-'));
  const docsDir = path.join(root, 'docs');
  const publicDir = path.join(root, 'public');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'articles'), { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'newer.md'), '# Newer\n\nNewest & best.\n');
  fs.writeFileSync(path.join(docsDir, 'older.md'), '# Older\n\nOld.\n');
  fs.writeFileSync(path.join(publicDir, 'articles', 'stale.html'), 'stale page');
  return { root, docsDir, publicDir };
}

test('builds a consistent site from the sources', () => {
  const { docsDir, publicDir } = makeFixture();
  const logs = [];

  runBuild({
    docsDir,
    publicDir,
    site,
    dates: {
      created: {
        'newer.md': '2025-01-01T00:00:00.000Z',
        'older.md': '2024-01-01T00:00:00.000Z',
      },
      modified: {
        'newer.md': '2025-02-01T00:00:00.000Z',
        'older.md': '2024-06-01T00:00:00.000Z',
      },
    },
    now: '2026-01-01T00:00:00.000Z',
    log: (message) => logs.push(message),
  });

  const home = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  assert.match(home, /Newest &amp; best\./);
  assert.match(home, /href="\/articles\/newer\.html"/);

  assert.match(home, /<link href="\/styles\/theme\.css\?v=\d+" rel="stylesheet">/);
  assert.match(home, /<link href="\/styles\/home\.css\?v=\d+" rel="stylesheet">/);
  assert.match(home, /name="theme-color" content="#0a0f1c"/);
  assert.match(home, /href="\/favicon\.ico"/);
  assert.match(home, /fonts\.googleapis\.com\/css2\?family=Inter/);
  assert.match(home, /class="brand" href="https:\/\/akbarsahata\.id\/"/);
  assert.match(home, /href="https:\/\/akbarsahata\.id\/">Home</);
  assert.match(home, /href="https:\/\/akbarsahata\.id\/profile\/"/);
  assert.match(home, /href="https:\/\/akbarsahata\.id\/projects\/"/);
  assert.match(home, /href="https:\/\/akbarsahata\.id\/publications\/"/);
  assert.match(home, /aria-current="page"[^>]*>Blog</);
  assert.match(home, /class="role">Blog</);
  assert.match(home, /Search articles/);
  assert.match(home, /github\.com\/akbarsahata/);
  assert.match(home, /© 2026 Akbar Sahata/);

  const article = fs.readFileSync(path.join(publicDir, 'articles', 'newer.html'), 'utf8');
  assert.match(article, /og:url" content="https:\/\/example\.com\/articles\/newer\.html"/);
  assert.match(article, /page\.identifier = "newer\.html"/);
  assert.match(article, /Newest &amp; best\./);

  assert.match(article, /<link href="\/styles\/theme\.css\?v=\d+" rel="stylesheet">/);
  assert.match(article, /<link href="\/styles\/article\.css\?v=\d+" rel="stylesheet">/);
  assert.match(article, /prism-tomorrow\.min\.css/);
  assert.match(article, /<link rel="canonical" href="https:\/\/example\.com\/articles\/newer\.html">/);
  assert.match(article, /name="twitter:card" content="summary_large_image"/);
  assert.match(article, /name="theme-color" content="#0a0f1c"/);
  assert.match(article, /href="\/favicon\.ico"/);
  assert.match(article, /class="brand" href="https:\/\/akbarsahata\.id\/"/);
  assert.match(article, /href="https:\/\/akbarsahata\.id\/">Home</);
  assert.match(article, /href="https:\/\/akbarsahata\.id\/publications\/"/);
  assert.match(article, /aria-current="page"[^>]*>Blog</);
  assert.match(article, /linkedin\.com\/in\/akbarsahata/);
  assert.match(article, /instagram\.com\/akbarsahata/);
  assert.match(article, /© 2026 Akbar Sahata/);
  assert.match(article, /class="share-buttons"/);
  assert.match(article, /class="back-to-top"/);
  assert.ok(!article.includes('home-button'));

  const metadata = JSON.parse(fs.readFileSync(path.join(publicDir, 'metadata.json'), 'utf8'));
  assert.deepEqual(Object.keys(metadata), ['newer.html', 'older.html']);
  assert.equal(metadata['newer.html'].createdAt, '2025-01-01T00:00:00.000Z');

  const sitemap = fs.readFileSync(path.join(publicDir, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<loc>https:\/\/example\.com<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/example\.com\/articles\/newer\.html<\/loc>/);

  assert.equal(fs.existsSync(path.join(publicDir, 'articles', 'stale.html')), false);
  assert.equal(fs.existsSync(path.join(publicDir, 'articles', 'older.html')), true);
  assert.ok(
    logs.some((line) => line.includes('Build summary: 2 Article Page(s), 0 warnings')),
    `expected a build summary in logs`,
  );
});

test('fails without shedding output when an Article has no H1 title', () => {
  const { docsDir, publicDir } = makeFixture();
  fs.writeFileSync(path.join(docsDir, 'broken.md'), 'No heading here.\n');
  fs.writeFileSync(path.join(publicDir, 'articles', 'newer.html'), 'previous build output');

  assert.throws(
    () =>
      runBuild({
        docsDir,
        publicDir,
        site,
        dates: {
          created: {
            'newer.md': '2025-01-01T00:00:00.000Z',
            'older.md': '2024-01-01T00:00:00.000Z',
            'broken.md': '2024-01-01T00:00:00.000Z',
          },
          modified: {},
        },
        now: '2026-01-01T00:00:00.000Z',
        log: () => {},
      }),
    /broken\.md/,
  );

  assert.equal(fs.existsSync(path.join(publicDir, 'articles', 'stale.html')), true);
  assert.equal(fs.readFileSync(path.join(publicDir, 'articles', 'newer.html'), 'utf8'), 'previous build output');
});

test('reuses the previous Metadata projection when repository history is unavailable', () => {
  const { docsDir, publicDir } = makeFixture();
  fs.writeFileSync(
    path.join(publicDir, 'metadata.json'),
    JSON.stringify({
      'older.html': {
        title: 'Older',
        desc: 'Old.',
        createdAt: '2020-01-01T00:00:00.000Z',
      },
    }),
  );

  const { records } = runBuild({
    docsDir,
    publicDir,
    site,
    now: '2026-01-01T00:00:00.000Z',
    log: () => {},
  });

  const byName = Object.fromEntries(records.map((record) => [record.sourceName, record]));
  assert.equal(byName['older.md'].createdDate, '2020-01-01T00:00:00.000Z');
  assert.equal(byName['newer.md'].createdDate, '2026-01-01T00:00:00.000Z');
});

test('escapes characters that could break out of embedded scripts', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-index-'));
  const docsDir = path.join(root, 'docs');
  const publicDir = path.join(root, 'public');
  fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'tricky.md'), '# Tricky </script>\n\nBody.\n');

  runBuild({
    docsDir,
    publicDir,
    site,
    dates: {
      created: { 'tricky.md': '2024-01-01T00:00:00.000Z' },
      modified: {},
    },
    now: '2026-01-01T00:00:00.000Z',
    log: () => {},
  });

  const article = fs.readFileSync(path.join(publicDir, 'articles', 'tricky.html'), 'utf8');
  assert.ok(article.includes('encodeURIComponent("Tricky \\u003C/script\\u003E")'));
  assert.ok(!article.includes('"Tricky </script>'));
});
