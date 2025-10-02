const path = require("path");
const fs = require("fs");

exports.handler = async (event, context) => {
  try {
    const data = await fetch(process.env.URL + "/metadata.json").then(res => res.text());
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
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ file, title, desc, createdAt }) => {
        return `
        <div class="card">
          <a href="/articles/${file}">
            <h2>${title}</h2>
          </a>
          <p>${desc}</p>
          <div class="card-footer">
            <small class="date">Created at: ${createdAt.toISOString()}</small>
            <small class="comment-count"><a href="/articles/${file}#disqus_thread" data-disqus-identifier="${file}">0 Comment</a></small>
          </div>
        </div>`;
      });

    const siteTitle = "Akbar Sahata's Blog";
    const description = "Welcome to my personal blog where I share my thoughts, opinions, and a comprehensive archive of my interactions with ChatGPT. Dive into the knowledge and fun!";
    const imageUrl = "/image.webp";
    const pageUrl = `https://${event.headers.host}${event.path}`;
    
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="${description}">
          <meta property="og:title" content="${siteTitle}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${imageUrl}">
          <meta property="og:url" content="${pageUrl}">
          <meta property="og:type" content="website">
          <link rel="icon" href="/favicon.ico" type="image/x-icon">
          <title>${siteTitle}</title>
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
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .card h2 {
            margin-top: 0;
            color: #007acc;
          }
          .card a {
            text-decoration: none;
            color: inherit;
          }
          .card a:hover h2 {
            text-decoration: underline;
          }
          .card-footer {
            margin-top: 15px;
            font-size: 14px;
            color: #666;
          }
          .card-footer .date {
            margin-right: 15px;
          }
          .card-footer a {
            color: #007acc;
            text-decoration: none;
          }
          .card-footer a:hover {
            text-decoration: underline;
          }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${siteTitle}</h1>
            <p>${description}</p>
            ${fileList.join('')}
          </div>
          <script id="dsq-count-scr" src="//akbarsahata.disqus.com/count.js" async></script>
        </body>
        </html>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Error reading metadata file:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
      },
      body: "Error reading metadata file",
    };
  }
};