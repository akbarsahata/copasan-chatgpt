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
        return `<li><a href="/docs/${fileName}">${fileName}</a></li>`;
      });
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Copasan ChatGPT</title>
          <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f8f8;
          padding: 20px;
        }
        h1 {
          color: #333333;
          font-size: 24px;
          margin-bottom: 20px;
        }
        ul {
          list-style-type: none;
          padding: 0;
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
          <h1>Copasan ChatGPT</h1>
          <p>Here are the list of my conversation with ChatGPT that may be useful to read later:</p>
          <ul>${fileList.join("")}</ul>
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
