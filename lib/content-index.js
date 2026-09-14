'use strict';

const DESC_MAX_LENGTH = 150;

function extractTitle(content) {
  for (const line of content.split('\n')) {
    if (line.startsWith('# ')) return line.slice(2).trim();
  }
  return null;
}

function stripMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__|~~|\*)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDescription(content) {
  const lines = content.split('\n');
  let titleSeen = false;

  for (const line of lines) {
    if (!titleSeen) {
      if (line.startsWith('# ')) titleSeen = true;
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^(#|-|\*|>|!|\[|```)/.test(trimmed)) continue;

    const stripped = stripMarkdown(trimmed);
    if (stripped.length <= DESC_MAX_LENGTH) return stripped;
    return `${stripped.slice(0, DESC_MAX_LENGTH)}...`;
  }

  return '';
}

function extractImage(content) {
  let inCodeFence = false;

  for (const line of content.split('\n')) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = line.match(/!\[[^\]]*\]\(([^)\s]+)/);
    if (match) return match[1];
  }

  return null;
}

function toPublishedName(sourceName) {
  return sourceName.replace(/\.md$/, '.html');
}

function buildContentIndex(docs, dates) {
  const records = docs.map(({ sourceName, content }) => {
    const title = extractTitle(content);
    if (title === null) {
      throw new Error(`Article "${sourceName}" has no H1 title`);
    }

    const publishedName = toPublishedName(sourceName);

    return {
      sourceName,
      path: `/articles/${publishedName}`,
      disqusId: publishedName,
      title,
      desc: extractDescription(content),
      image: extractImage(content),
      createdDate: dates.created[sourceName],
      modifiedDate: dates.modified[sourceName] ?? dates.created[sourceName],
    };
  });

  return records.sort((a, b) => {
    if (a.createdDate !== b.createdDate) {
      return a.createdDate < b.createdDate ? 1 : -1;
    }
    return a.sourceName < b.sourceName ? -1 : 1;
  });
}

function toPublicMetadata(records) {
  const metadata = {};

  for (const record of records) {
    metadata[record.disqusId] = {
      title: record.title,
      desc: record.desc,
      createdAt: record.createdDate,
    };
  }

  return metadata;
}

function toSitemapEntries(records, site) {
  const homeEntry = { loc: site.siteUrl, changefreq: 'daily', priority: '1.0' };

  if (records.length > 0) {
    const newestModified = records.reduce(
      (newest, record) => (record.modifiedDate > newest ? record.modifiedDate : newest),
      records[0].modifiedDate,
    );
    homeEntry.lastmod = newestModified.slice(0, 10);
  }

  const articleEntries = records.map((record) => ({
    loc: `${site.siteUrl}${record.path}`,
    lastmod: record.modifiedDate.slice(0, 10),
  }));

  return [homeEntry, ...articleEntries];
}

function findOrphanOutputs(records, existingFiles) {
  const known = new Set(records.map((record) => record.disqusId));

  return existingFiles
    .filter((fileName) => fileName.endsWith('.html') && !known.has(fileName))
    .sort();
}

module.exports = {
  buildContentIndex,
  toPublishedName,
  toPublicMetadata,
  toSitemapEntries,
  findOrphanOutputs,
};
