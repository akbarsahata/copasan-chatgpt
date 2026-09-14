'use strict';

const { escapeHtml, jsString } = require('./html');

function renderArticle(site, record, bodyHtml) {
  const pageUrl = `${site.siteUrl}${record.path}`;
  const imageUrl = record.image || site.image;
  const title = escapeHtml(record.title);
  const description = escapeHtml(record.desc);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:url" content="${escapeHtml(pageUrl)}">
  <meta property="og:type" content="article">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Calibri:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
  <link href="/styles/article.css" rel="stylesheet">
</head>
<body>
  <a href="${escapeHtml(site.siteUrl)}" class="home-button">Back to Home</a>
  ${bodyHtml}
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
      this.page.url = ${jsString(pageUrl)};
      this.page.identifier = ${jsString(record.disqusId)};
    };
    (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://${site.disqusShortname}.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
    })();
    
    function shareToFacebook() {
      const url = encodeURIComponent(${jsString(pageUrl)});
      window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
    }
    
    function shareToTwitter() {
      const url = encodeURIComponent(${jsString(pageUrl)});
      const text = encodeURIComponent(${jsString(record.title)});
      window.open(\`https://twitter.com/intent/tweet?url=\${url}&text=\${text}\`, '_blank');
    }
    
    function shareToWhatsApp() {
      const url = encodeURIComponent(${jsString(pageUrl)});
      window.open(\`https://wa.me/?text=\${url}\`, '_blank');
    }
    
    function copyLink() {
      navigator.clipboard.writeText(${jsString(pageUrl)}).then(() => {
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
}

module.exports = renderArticle;
