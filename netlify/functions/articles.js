const marked = require("marked");
const markedKatex = require("marked-katex-extension");
const path = require("path");
const fs = require("fs");

// Add fetch polyfill for Node.js environments that don't have it
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

marked.use({
  gfm: true,
})

marked.use(markedKatex({
  throwOnError: false,
  output: 'mathml',
}));

exports.handler = async (event, context) => {
  try {
    const pathSegments = event.path.split('/');
    const fileName = pathSegments[pathSegments.length - 1].split("#")[0];
    
    // Try to read from the local file system first (for local development)
    let fileContent, metadata;
    
    try {
      const filePath = path.join(process.cwd(), `docs/${fileName}`);
      fileContent = fs.readFileSync(filePath, "utf8");
      
      const metadataPath = path.join(process.cwd(), "metadata.json");
      metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    } catch (localError) {
      // If local files don't exist, fetch from the deployed site
      const baseUrl = `https://${event.headers.host}`;
      
      try {
        const docResponse = await fetch(`${baseUrl}/docs/${fileName}`);
        if (!docResponse.ok) throw new Error(`Document not found: ${fileName}`);
        fileContent = await docResponse.text();
        
        const metaResponse = await fetch(`${baseUrl}/metadata.json`);
        if (!metaResponse.ok) throw new Error('Metadata not found');
        metadata = await metaResponse.json();
      } catch (fetchError) {
        throw new Error(`Failed to load content: ${fetchError.message}`);
      }
    }

    const htmlContent = marked.parse(fileContent);

    // Extract the title and description from the metadata
    const fileMetadata = metadata[fileName];
    const title = fileMetadata ? fileMetadata.title : fileName;
    const description = fileMetadata ? fileMetadata.desc : "";

    // Define the URL to your image and page
    const imageMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageMatch ? imageMatch[1] : "/image.webp";
    const pageUrl = `https://${event.headers.host}${event.path}`;

    const html = `
      <!DOCTYPE html>
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
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style>
      body {
      font-family: 'Calibri', sans-serif;
      background-color: #f0f8ff;
      color: #333;
      margin: 20px;
      padding: 20px;
      line-height: 1.6;
      }
      h1, h2, h3, h4, h5, h6 {
      font-family: 'Calibri', sans-serif;
      color: #007acc;
      margin-top: 20px;
      margin-bottom: 10px;
      }
      p {
      margin-bottom: 20px;
      font-size: 18px;
      }
      ul, ol {
      margin-left: 20px;
      margin-bottom: 20px;
      }
      code {
      background-color: #f4f4f4;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      }
      pre {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      position: relative;
      }
      img {
      display: block;
      margin: 20px auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 100%;
      height: auto;
      }
      table {
      border-collapse: collapse;
      margin-bottom: 20px;
      }
      th, td {
      padding: 10px;
      border: 1px solid #ddd;
      }
      th {
      background-color: #007acc;
      color: white;
      font-weight: bold;
      }
      tr:nth-child(even) {
      background-color: #f2f2f2;
      }
      .copy-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #007acc;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 4px;
      }
      .katex {
      font-size: 1.5em;
      line-height: 1.2;
      }
      .katex .katex-mathml {
      display: inline-block;
      vertical-align: middle;
      }
      .katex-display {
      text-align: center;
      margin: 1em 0;
      }
      .floating-buttons {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
      }
      .floating-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
      }
      .floating-button:hover {
      transform: scale(1.1);
      }
      .share-facebook { background-color: #3b5998; color: white; }
      .share-twitter { background-color: #1da1f2; color: white; }
      .share-whatsapp { background-color: #25d366; color: white; }
      .copy-link { background-color: #007acc; color: white; }
      .scroll-top { background-color: #ff6b6b; color: white; }
      </style>
      </head>
      <body>
      ${htmlContent}
      <div class="floating-buttons">
        <button class="floating-button share-facebook" onclick="shareToFacebook()" title="Share on Facebook">f</button>
        <button class="floating-button share-twitter" onclick="shareToTwitter()" title="Share on Twitter">t</button>
        <button class="floating-button share-whatsapp" onclick="shareToWhatsApp()" title="Share on WhatsApp">w</button>
        <button class="floating-button copy-link" onclick="copyLink()" title="Copy Link">📋</button>
        <button class="floating-button scroll-top" onclick="scrollToTop()" title="Scroll to Top">↑</button>
      </div>
      <div id="disqus_thread"></div>
      <script>
      var disqus_config = function () {
      this.page.url = "${pageUrl}";
      this.page.identifier = "${fileName}";
      };
      (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://akbarsahata.disqus.com/embed.js';
      s.setAttribute('data-timestamp', +new Date());
      (d.head || d.body).appendChild(s);
      })();
      </script>
      <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
      <script>
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
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
      <script>
      document.querySelectorAll('pre').forEach((pre) => {
      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.className = 'copy-button';
      button.onclick = () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code.textContent).then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy', 2000);
      });
      };
      pre.appendChild(button);
      });
      </script>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: "Error reading the file",
    };
  }
};