'use strict';

const { escapeHtml } = require('./html');
const { renderPage, absoluteUrl } = require('./render-layout');

function renderHome(site, records) {
  const cards = records
    .map(
      (record) => `
      <div class="card">
        <a href="${escapeHtml(record.path)}">
          <h2>${escapeHtml(record.title)}</h2>
        </a>
        <p>${escapeHtml(record.desc)}</p>
        <div class="card-footer">
          <small class="date">Created at: ${escapeHtml(record.createdDate)}</small>
          <small class="comment-count"><a href="${escapeHtml(record.path)}#disqus_thread" data-disqus-identifier="${escapeHtml(record.disqusId)}">0 Comment</a></small>
        </div>
      </div>`,
    )
    .join('');

  const body = `      <div class="hero">
        <p class="role">Blog</p>
        <h1>${escapeHtml(site.title)}</h1>
        <p class="lead">${escapeHtml(site.description)}</p>
      </div>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search articles&hellip;" aria-label="Search articles">
      </div>
      <div class="search-results" id="search-results"></div>
      <div class="card-container">${cards}
      </div>`;

  const scripts = `  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.4.6"></script>
  <script>
    document.querySelectorAll('small.date').forEach((element) => {
      const date = new Date(element.textContent.replace('Created at: ', ''));
      element.textContent = 'Created at: ' + date.toLocaleString();
    });

    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    fetch('/metadata.json')
      .then(response => response.json())
      .then(result => Object.keys(result)
        .map(fileName => ({
          file: fileName,
          title: result[fileName].title,
          desc: result[fileName].desc
        }))
      )
      .then(data => {
        const fuse = new Fuse(data, {
          keys: ['title', 'desc'],
          minMatchCharLength: 3,
          distance: 500,
        });

        searchInput.addEventListener('input', () => {
          const searchTerm = searchInput.value;
          const results = fuse.search(searchTerm);

          searchResults.innerHTML = results.map(result => {
            const { file, title, desc } = result.item;
            return \`
          <div class="result-item">
            <a href="/articles/\${file}">\${title}</a>
            <p>\${desc}</p>
          </div>
            \`;
          }).join('');
        });
      });
  </script>
  <script id="dsq-count-scr" src="//${site.disqusShortname}.disqus.com/count.js" onload="DISQUSWIDGETS.getCount({reset: true});" async></script>`;

  return renderPage(site, {
    title: site.title,
    description: site.description,
    canonical: `${site.siteUrl}/`,
    image: absoluteUrl(site, site.image),
    type: 'website',
    styles: ['/styles/home.css'],
    body,
    scripts,
  });
}

module.exports = renderHome;
