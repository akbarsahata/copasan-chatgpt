'use strict';

const { escapeHtml } = require('./html');

const STYLE_VERSION = '2';
const THEME_COLOR = '#0a0f1c';
const COPYRIGHT = '© 2026 Akbar Sahata';

const FONT_STYLESHEET =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Zilla+Slab:wght@400;600;700&display=swap';

function absoluteUrl(site, pathname) {
  if (/^https?:\/\//.test(pathname)) return pathname;
  if (pathname.startsWith('/')) return `${site.siteUrl}${pathname}`;
  return pathname;
}

function styleLink(href) {
  return `<link href="${escapeHtml(href)}?v=${STYLE_VERSION}" rel="stylesheet">`;
}

function renderNav(site) {
  const items = [
    { label: 'Home', href: `${site.personalUrl}/` },
    { label: 'Profile', href: `${site.personalUrl}/profile/` },
    { label: 'Projects', href: `${site.personalUrl}/projects/` },
    { label: 'Publications', href: `${site.personalUrl}/publications/` },
    { label: 'Blog', href: `${site.siteUrl}/`, current: true },
  ];

  const links = items
    .map(
      ({ label, href, current }) =>
        `            <li><a href="${escapeHtml(href)}"${current ? ' aria-current="page"' : ''}>${label}</a></li>`,
    )
    .join('\n');

  return `          <ul>\n${links}\n          </ul>`;
}

function renderFooter(site) {
  const socials = [
    { label: 'GitHub', href: 'https://github.com/akbarsahata' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akbarsahata' },
    { label: 'Blog', href: site.siteUrl },
    { label: 'Instagram', href: 'https://www.instagram.com/akbarsahata/' },
  ];

  const links = socials
    .map(
      ({ label, href }) =>
        `          <li><a href="${escapeHtml(href)}" target="_blank" rel="me noopener">${label}</a></li>`,
    )
    .join('\n');

  return `      <ul class="social">\n${links}\n      </ul>\n      <p class="copyright">${COPYRIGHT}</p>`;
}

function renderPage(site, page) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonical = escapeHtml(page.canonical);
  const image = escapeHtml(page.image);
  const styles = ['/styles/theme.css', ...page.styles].map(styleLink).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta name="author" content="Akbar Sahata">
  <meta name="theme-color" content="${THEME_COLOR}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="${escapeHtml(page.type)}">
  <meta property="og:site_name" content="${escapeHtml(site.title)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONT_STYLESHEET}" rel="stylesheet">
  ${page.head || ''}
  ${styles}
  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="${escapeHtml(site.personalUrl)}/">Akbar Sahata</a>
      <nav class="site-nav" aria-label="Main">
${renderNav(site)}
      </nav>
    </div>
  </header>
  <main id="main">
    <div class="container">
${page.body}
    </div>
  </main>
  <footer class="site-footer">
    <div class="container">
${renderFooter(site)}
    </div>
  </footer>
${page.scripts || ''}
</body>
</html>`;
}

module.exports = { renderPage, absoluteUrl };
