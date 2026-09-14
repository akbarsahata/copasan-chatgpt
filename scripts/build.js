#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const marked = require('marked');
const markedKatex = require('marked-katex-extension');

const {
  buildContentIndex,
  toPublishedName,
  toPublicMetadata,
  findOrphanOutputs,
} = require('../lib/content-index');
const renderArticle = require('../lib/render-article');
const renderHome = require('../lib/render-home');
const renderSitemap = require('../lib/render-sitemap');
const defaultSite = require('../lib/site');

marked.use({ gfm: true });
marked.use(markedKatex({ throwOnError: false, output: 'mathml' }));

function readSources(docsDir) {
  return fs
    .readdirSync(docsDir)
    .filter((sourceName) => sourceName.endsWith('.md'))
    .sort()
    .map((sourceName) => ({
      sourceName,
      content: fs.readFileSync(path.join(docsDir, sourceName), 'utf8'),
    }));
}

function readGitDates(docsDir) {
  try {
    const output = execSync('git log --format=__DATE__%aI --name-only -- .', {
      cwd: docsDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const created = {};
    const modified = {};
    let date = null;

    for (const rawLine of output.split('\n')) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line.startsWith('__DATE__')) {
        date = line.slice('__DATE__'.length);
        continue;
      }

      if (!line.endsWith('.md') || !date) continue;

      const sourceName = path.basename(line);
      if (!modified[sourceName]) modified[sourceName] = date;
      created[sourceName] = date;
    }

    if (Object.keys(created).length === 0) return null;
    return { created, modified };
  } catch (error) {
    return null;
  }
}

function readPreviousMetadata(publicDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(publicDir, 'metadata.json'), 'utf8'));
  } catch (error) {
    return {};
  }
}

function resolveDates(sources, docsDir, publicDir, now, warn) {
  const gitDates = readGitDates(docsDir);
  if (!gitDates) {
    warn('Repository history unavailable; reusing previous Metadata or build time');
  }

  const previous = readPreviousMetadata(publicDir);
  const created = {};
  const modified = {};

  for (const { sourceName } of sources) {
    const publishedName = toPublishedName(sourceName);

    let createdValue = gitDates ? gitDates.created[sourceName] : undefined;
    if (!createdValue) {
      createdValue = previous[publishedName] ? previous[publishedName].createdAt : undefined;
    }
    if (!createdValue) {
      createdValue = now;
      warn(`Warning: no Created date for ${sourceName}; using build time`);
    }
    created[sourceName] = new Date(createdValue).toISOString();

    const modifiedValue = gitDates ? gitDates.modified[sourceName] : undefined;
    if (modifiedValue) modified[sourceName] = new Date(modifiedValue).toISOString();
  }

  return { created, modified };
}

function runBuild({
  docsDir = path.join(__dirname, '../docs'),
  publicDir = path.join(__dirname, '../public'),
  site = defaultSite,
  dates,
  now = new Date().toISOString(),
  log = console.log,
} = {}) {
  const articlesDir = path.join(publicDir, 'articles');
  const sources = readSources(docsDir);
  const contentBySource = new Map(
    sources.map(({ sourceName, content }) => [sourceName, content]),
  );

  let warningCount = 0;
  const warn = (message) => {
    warningCount += 1;
    log(message);
  };

  const resolvedDates = dates ? dates : resolveDates(sources, docsDir, publicDir, now, warn);
  const records = buildContentIndex(sources, resolvedDates);

  for (const record of records) {
    if (!record.desc) {
      warn(`Warning: ${record.sourceName} has no description`);
    }
  }

  fs.mkdirSync(articlesDir, { recursive: true });

  for (const record of records) {
    const bodyHtml = marked.parse(contentBySource.get(record.sourceName));
    fs.writeFileSync(
      path.join(articlesDir, record.disqusId),
      renderArticle(site, record, bodyHtml),
      'utf8',
    );
  }

  fs.writeFileSync(path.join(publicDir, 'index.html'), renderHome(site, records), 'utf8');
  fs.writeFileSync(
    path.join(publicDir, 'metadata.json'),
    JSON.stringify(toPublicMetadata(records)),
    'utf8',
  );
  fs.writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    renderSitemap(site, records),
    'utf8',
  );

  const existingFiles = fs.readdirSync(articlesDir).filter((fileName) => fileName.endsWith('.html'));
  const orphans = findOrphanOutputs(records, existingFiles);

  for (const orphan of orphans) {
    fs.unlinkSync(path.join(articlesDir, orphan));
    log(`Removed orphaned Article Page: ${orphan}`);
  }

  log(`Build summary: ${records.length} Article Page(s), ${warningCount} warnings`);
  return { records, orphans };
}

if (require.main === module) {
  try {
    runBuild();
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { runBuild };
