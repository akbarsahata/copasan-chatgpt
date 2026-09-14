'use strict';

const { toSitemapEntries } = require('./content-index');

function renderSitemap(site, records) {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of toSitemapEntries(records, site)) {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${entry.loc}</loc>\n`;
    if (entry.lastmod) {
      sitemap += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      sitemap += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority) {
      sitemap += `    <priority>${entry.priority}</priority>\n`;
    }
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>';
  return sitemap;
}

module.exports = renderSitemap;
