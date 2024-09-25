const path = require("path");
const fs = require("fs");

module.exports = (req, res) => {
  const metadataPath = path.join(__dirname, "..", "metadata.json");
  fs.readFile(metadataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading metadata file:", err);
      res.status(500).send("Error reading metadata file");
    } else {
      const metadata = JSON.parse(data);
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
        .sort((a, b) => b.createdAt - a.createdAt) // Sort by createdAt in descending order
        .map(({ file, title, desc, createdAt }) => {
          return `
          <div class="card">
            <a href="/articles/${file}" target="_blank" data-disqus-identifier="${file}">
              <h2>${title}</h2>
            </a>
            <p>${desc}</p>
            <small>Created at: ${createdAt.toISOString()}</small>
          </div>`;
        });
      
      const description = "Explore the fascinating conversations and insights from my interactions with ChatGPT. Dive into the knowledge and fun!";
      const title = "Copasan ChatGPT Archives";
      const imageUrl = "/image.webp";
      const pageUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
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
            <title>Copasan ChatGPT Archives</title>
            <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5;
            color: #333;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            overflow-x: hidden; /* Prevent horizontal overflow */
          }
          .container {
            padding: 20px;
            max-width: 100%;
            width: 100%;
            text-align: left;
            box-sizing: border-box; /* Include padding in width calculation */
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
            <script id="dsq-count-scr" src="//copasan-chatgpt.disqus.com/count.js" async></script>
          </body>
          </html>
        `;
      res.send(html);
    }
  });
};
