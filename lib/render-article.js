'use strict';

const { jsString } = require('./html');
const { renderPage, absoluteUrl } = require('./render-layout');

function renderArticle(site, record, bodyHtml) {
  const pageUrl = `${site.siteUrl}${record.path}`;
  const imageUrl = absoluteUrl(site, record.image || site.image);

  const body = `      <article class="article">
${bodyHtml}
      </article>
      <button class="back-to-top" onclick="scrollToTop()">Back to Top</button>
      <div class="share-buttons">
        <button class="share-button" onclick="shareToFacebook()" aria-label="Share to Facebook">F</button>
        <button class="share-button" onclick="shareToTwitter()" aria-label="Share to X">X</button>
        <button class="share-button" onclick="shareToWhatsApp()" aria-label="Share to WhatsApp">W</button>
        <button class="share-button" onclick="copyLink()" aria-label="Copy link">C</button>
      </div>
      <div id="disqus_thread"></div>`;

  const headExtra =
    '<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">';

  const scripts = `  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
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
  </script>`;

  return renderPage(site, {
    title: record.title,
    description: record.desc,
    canonical: pageUrl,
    image: imageUrl,
    type: 'article',
    head: headExtra,
    styles: ['/styles/article.css'],
    body,
    scripts,
  });
}

module.exports = renderArticle;
