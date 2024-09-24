const express = require("express");
const path = require("path");

const handlers = require("../handlers/");

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get("/", handlers.home);

app.get("/articles/:filename", handlers.articles);

module.exports = app;
