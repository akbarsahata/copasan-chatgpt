const marked = require("marked");
const path = require("path");
const fs = require("fs");

module.exports = (req, res) => {
  try {
    const fileName = req.params.filename;
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
      </style>
      </head>
      <body>
      ${htmlContent}
      <script>
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
