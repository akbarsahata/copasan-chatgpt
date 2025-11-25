const fs = require('fs');
const path = require('path');
const marked = require('marked');
const markedKatex = require('marked-katex-extension');

// Configure marked
marked.use({
  gfm: true,
});

marked.use(
  markedKatex({
    throwOnError: false,
    output: 'mathml',
  })
);

// Paths
const docsPath = path.join(__dirname, '../docs');
const metadataPath = path.join(__dirname, '../metadata.json');
const outputPath = path.join(__dirname, '../public/articles');

// Ensure output directory exists
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

// Read metadata
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Generate HTML for each article
Object.keys(metadata).forEach(fileName => {
  const fileMetadata = metadata[fileName];
  const title = fileMetadata.title;
  const description = fileMetadata.desc;
  
  // Read markdown file
  const markdownPath = path.join(docsPath, fileName);
  const fileContent = fs.readFileSync(markdownPath, 'utf8');
  
  // Parse markdown to HTML
  const htmlContent = marked.parse(fileContent);
  
  // Extract image for OG
  const imageMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
  const imageUrl = imageMatch ? imageMatch[1] : '/image.webp';
  const pageUrl = `https://blog.akbarsahata.id/articles/${fileName}`;
  
  // Generate full HTML page
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="article">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Calibri:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
  <link href="/styles/article.css" rel="stylesheet">
</head>
<body>
  <a href="https://blog.akbarsahata.id" class="home-button">Back to Home</a>
  ${htmlContent}
  <button class="back-to-top" onclick="scrollToTop()">Back to Top</button>
  <div class="share-buttons">
    <button class="share-button" onclick="shareToFacebook()">F</button>
    <button class="share-button" onclick="shareToTwitter()">X</button>
    <button class="share-button" onclick="shareToWhatsApp()">W</button>
    <button class="share-button" onclick="copyLink()">C</button>
  </div>
  <div id="disqus_thread"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
  <script>
    var disqus_config = function () {
      this.page.url = "${pageUrl}";
      this.page.identifier = "${fileName}";
    };
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://copasan-chatgpt.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
    
    function shareToFacebook() {
      const url = encodeURIComponent("${pageUrl}");
      window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
    }
    
    function shareToTwitter() {
      const url = encodeURIComponent("${pageUrl}");
      const text = encodeURIComponent("${title}");
      window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
    }
    
    function shareToWhatsApp() {
      const url = encodeURIComponent("${pageUrl}");
      window.open(\`https://wa.me/?text=\${url}\`, '_blank');
    }
    
    function copyLink() {
      navigator.clipboard.writeText("${pageUrl}").then(() => {
        alert('Link copied to clipboard');
      });
    }
    
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    window.addEventListener('scroll', () => {
      const backToTopButton = document.querySelector('.back-to-top');
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });
    
    document.querySelectorAll('pre').forEach((pre) => {
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerText = 'Copy';
      button.addEventListener('click', () => {
        const code = pre.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
          button.innerText = 'Copied!';
          setTimeout(() => {
            button.innerText = 'Copy';
          }, 2000);
        });
      });
      pre.appendChild(button);
    });
  </script>
</body>
</html>`;
  
  // Write HTML file
  const outputFilePath = path.join(outputPath, fileName.replace('.md', '.html'));
  fs.writeFileSync(outputFilePath, html, 'utf8');
  console.log(`Generated: ${outputFilePath}`);
});

console.log(`\n✅ Generated ${Object.keys(metadata).length} article HTML files`);
