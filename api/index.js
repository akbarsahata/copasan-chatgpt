const express = require("express");
const path = require("path");

const handlers = require("../handlers/");

const app = express();

// Middleware to check the Referer or Origin header
const forbiddenFiles = ["metadata.json"];

function checkSameDomain(req, res, next) {
    const requestedFile = path.basename(req.path);

    if (forbiddenFiles.includes(requestedFile)) {
        res.status(403).send("Forbidden"); // Deny the request
    } else {
        next(); // Allow the request to continue
    }
}

app.use(checkSameDomain, express.static(path.join(__dirname, "..", "public")));

app.get("/", handlers.home);

app.get("/articles/:filename", handlers.articles);

module.exports = app;
