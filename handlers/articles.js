const marked = require("marked");
const markedKatex = require("marked-katex-extension");
const path = require("path");
const fs = require("fs");

marked.use({
  gfm: true,
})

marked.use(markedKatex({
  throwOnError: false,
  output: 'mathml',
}));

module.exports = (req, res) => {
  try {
    const fileName = req.params.filename.split("#")[0];
    const filePath = path.join(__dirname, "..", `docs/${fileName}`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const htmlContent = marked.parse(fileContent);

    // Read metadata from the JSON file
    const metadataPath = path.join(__dirname, "..", "metadata.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

    // Extract the title and description from the metadata
    const fileMetadata = metadata[fileName];
    const title = fileMetadata ? fileMetadata.title : fileName;
    const description = fileMetadata ? fileMetadata.desc : "";

    // Define the URL to your image and page
    const imageMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    const imageUrl = imageMatch ? imageMatch[1] : "/image.webp";
    const pageUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.send(`
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
      li {
      margin-bottom: 10px;
      }
      a {
      color: #1e90ff;
      text-decoration: none;
      font-weight: bold;
      }
      a:hover {
      text-decoration: underline;
      }
      blockquote {
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #f9f9f9;
      border-left: 5px solid #ccc;
      font-style: italic;
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
      width: 100%;
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
      .share-buttons {
      position: fixed;
      top: 50%;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      }
      .share-button {
      background-color: #007acc;
      color: white;
      border: none;
      padding: 10px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      }
      #disqus_thread {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      }
      .home-button {
      display: block;
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #007acc;
      color: white;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      }
      .home-button:hover {
      background-color: #005f99;
      }
      .back-to-top {
      display: none;
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007acc;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      }
      </style>
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
      this.page.url = "${pageUrl}"
      this.page.identifier = "${fileName}";
      };
      (function() {
      var d = document, s = d.createElement('script');
      s.src = 'https://copasan-chatgpt.disqus.com/embed.js';
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
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <title>Error</title>
      <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f8f8f8;
        padding: 20px;
        }
        h1 {
        color: #ff0000;
        font-size: 24px;
        margin-bottom: 10px;
        }
        p {
        color: #333333;
        font-size: 16px;
        margin-bottom: 20px;
        }
      </style>
      </head>
      <body>
      <h1>Error</h1>
      <p>There was an error reading or rendering the file.</p>
      </body>
      </html>
    `);
  }
};
