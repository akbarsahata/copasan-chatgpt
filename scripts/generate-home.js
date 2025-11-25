const fs = require('fs');
const path = require('path');

// Paths
const metadataPath = path.join(__dirname, '../metadata.json');
const outputPath = path.join(__dirname, '../public/index.html');

// Read metadata
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Generate article cards
const fileList = Object.keys(metadata)
  .map((file) => {
    const { title, desc, createdAt } = metadata[file];
    return {
      file,
      title,
      desc,
      createdAt: new Date(createdAt),
    };
  })
  .sort((a, b) => b.createdAt - a.createdAt)
  .map(({ file, title, desc, createdAt }) => {
    return `
    <div class="card">
      <a href="/articles/${file.replace('.md', '.html')}">
        <h2>${title}</h2>
      </a>
      <p>${desc}</p>
      <div class="card-footer">
        <small class="date">Created at: ${createdAt.toISOString()}</small>
        <small class="comment-count"><a href="/articles/${file.replace('.md', '.html')}#disqus_thread" data-disqus-identifier="${file}">0 Comment</a></small>
      </div>
    </div>`;
  });

const siteTitle = "Akbar Sahata's Blog";
const description =
  "Welcome to my personal blog where I share my thoughts, opinions, and a comprehensive archive of my interactions with ChatGPT. Dive into the knowledge and fun!";
const imageUrl = "/image.webp";
const pageUrl = "https://blog.akbarsahata.id";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${siteTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${pageUrl}">
  <title>${siteTitle}</title>
  <link href="/styles/home.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <h1>Welcome to ${siteTitle}!</h1>
    <p>${description}</p>
    <div class="search-container">
      <input type="text" id="search-input" placeholder="Search posts...">
    </div>
    <div class="search-results" id="search-results"></div>
    <div class="card-container">${fileList.join("")}</div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@6.4.6"></script>
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
          file: fileName.replace('.md', '.html'),
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
  <script id="dsq-count-scr" src="//copasan-chatgpt.disqus.com/count.js" onload="DISQUSWIDGETS.getCount({reset: true});" async></script>
</body>
</html>`;

// Write HTML file
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✅ Generated home page: ${outputPath}`);
