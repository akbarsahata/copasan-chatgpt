const express = require("express");
const { Marpit } = require("@marp-team/marpit");
const marked = require("marked");
const path = require("path");
const fs = require("fs");

const app = express();

const { CSS_THEME_URL, MARKDOWN_RESEARCH_DRAFT_URL, MARKDOWN_TEST_BED_URL } =
  process.env;

// Serve robots.txt file
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "robots.txt"));
});

app.get("/", (req, res) => {
  const docsPath = path.join(__dirname, "..", "docs");
  fs.readdir(docsPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      res.status(500).send("Error reading directory");
    } else {
      const fileList = files.map((file) => {
        const fileName = path.basename(file);
        const title = fileName.replace(/-/g, " ").replace(".md", "");
        return `<li><a href="/docs/${fileName}" target="_blank">${title.toUpperCase()}</a></li>`;
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
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          background: #fff;
          padding: 20px 40px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        h1 {
          color: #ff6347;
          font-size: 32px;
          margin-bottom: 20px;
        }
        p {
          font-size: 18px;
          margin-bottom: 20px;
        }
        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        li {
          margin-bottom: 10px;
        }
        a {
          color: #ff6347;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
          </style>
        </head>
        <body>
          <div class="container">
        <h1>Welcome to Copasan ChatGPT Archives!</h1>
        <p>Explore the fascinating conversations and insights from my interactions with ChatGPT. Dive into the knowledge and fun!</p>
        <ul>${fileList.join("")}</ul>
          </div>
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
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        <style>
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 16px;
            line-height: 1.6;
            margin: 40px;
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: Arial, sans-serif;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          p {
            margin-bottom: 20px;
          }
          ul, ol {
            margin-left: 20px;
            margin-bottom: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
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
