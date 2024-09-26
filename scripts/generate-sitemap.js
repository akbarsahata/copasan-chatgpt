const fs = require('fs');
const path = require('path');

// Paths to the files
const metadataPath = path.join(__dirname, '../metadata.json');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Read metadata.json
fs.readFile(metadataPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading metadata.json:', err);
        return;
    }

    const metadata = JSON.parse(data);
    const urls = Object.keys(metadata).map(key => ({
        loc: `https://blog.akbarsahata.id/articles/${key}`,
        lastmod: new Date(metadata[key].createdAt).toISOString().split('T')[0]
    }));

    // Add the specified URL as the first record
    const currentDate = new Date().toISOString().split('T')[0];
    urls.unshift({
        loc: 'https://blog.akbarsahata.id',
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
    });

    // Generate sitemap.xml content
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
        sitemapContent += '  <url>\n';
        sitemapContent += `    <loc>${url.loc}</loc>\n`;
        sitemapContent += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) {
            sitemapContent += `    <changefreq>${url.changefreq ?? 'never'}</changefreq>\n`;
        }
        if (url.priority) {
            sitemapContent += `    <priority>${url.priority ?? 0.8}</priority>\n`;
        }
        sitemapContent += '  </url>\n';
    });

    sitemapContent += '</urlset>';

    // Write to sitemap.xml
    fs.writeFile(sitemapPath, sitemapContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing sitemap.xml:', err);
            return;
        }
        console.log('sitemap.xml has been updated successfully.');
    });
});