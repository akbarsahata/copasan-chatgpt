const express = require("express");
const { Marpit } = require("@marp-team/marpit");
const marked = require("marked");
const path = require("path");
const fs = require("fs");

const app = express();

// serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get("/", (req, res) => {
  const metadataPath = path.join(__dirname, "..", "metadata.json");
  fs.readFile(metadataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      res.status(500).send("Error reading metadata file");
    } else {
      const metadata = JSON.parse(data);
      const fileList = Object.keys(metadata).map((file) => {
        const { title, desc, createdAt } = metadata[file];
        return `
          <div class="card">
        <a href="/articles/${file}" target="_blank">
          <h2>${title}</h2>
        </a>
        <p>${desc}</p>
        <small>Created at: ${new Date(createdAt).toISOString()}</small>
          </div>`;
      });
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Copasan ChatGPT Archives</title>
          <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f2f5;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          padding: 20px 40px;
          max-width: 100%;
          width: 100%;
          text-align: left;
        }
        h1 {
          color: #007acc;
          font-size: 32px;
          margin-bottom: 20px;
        }
        p {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .card {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .card h2 {
          font-size: 24px;
          color: #007acc;
          margin: 0 0 10px 0;
        }
        .card p {
          font-size: 16px;
          color: #333;
          margin: 0 0 10px 0;
        }
        .card small {
          display: block;
          margin-top: 10px;
          color: #666;
        }
        a {
          color: #1e90ff;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        @media (min-width: 768px) {
          .container {
        max-width: 750px;
          }
        }
        @media (min-width: 992px) {
          .container {
        max-width: 970px;
          }
        }
        @media (min-width: 1200px) {
          .container {
        max-width: 1170px;
          }
        }
          </style>
        </head>
        <body>
          <div class="container">
        <h1>Welcome to Copasan ChatGPT Archives!</h1>
        <p>Explore the fascinating conversations and insights from my interactions with ChatGPT. Dive into the knowledge and fun!</p>
        <div class="card-container">${fileList.join("")}</div>
          </div>
          <script>
        document.querySelectorAll('small').forEach((element) => {
          const date = new Date(element.textContent.replace('Created at: ', ''));
          element.textContent = 'Created at: ' + date.toLocaleString();
        });
          </script>
        </body>
        </html>
      `;
      res.send(html);
    }
  });
});

app.get("/articles/:filename", (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "..", `docs/${fileName}`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const htmlContent = marked.parse(fileContent);

    // Extract the title from the markdown content
    const titleMatch = fileContent.match(/^#\s+(.*)/);
    const title = titleMatch ? titleMatch[1] : fileName;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
});

module.exports = app;
