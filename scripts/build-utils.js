const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Paths
const docsPath = path.join(__dirname, '../docs');
const cacheFile = path.join(__dirname, '../.build-cache.json');

/**
 * Get list of changed markdown files from git
 * Falls back to all files if not in a git repo or on initial build
 */
function getChangedMarkdownFiles() {
  try {
    // Check if we're in a git repo
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    // Get changed files from git status (unstaged + staged)
    const gitStatus = execSync('git status --porcelain docs/', { encoding: 'utf8' });
    const changedFiles = gitStatus
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        // Parse git status output (e.g., " M docs/file.md" or "?? docs/file.md" or "A  docs/file.md")
        const match = line.match(/^.{3}(docs\/.+\.md)$/);
        return match ? path.basename(match[1]) : null;
      })
      .filter(Boolean);
    
    if (changedFiles.length > 0) {
      console.log(`📝 Detected ${changedFiles.length} changed markdown file(s) from git`);
      return changedFiles;
    }
    
    // If no git changes, check cache to see if files have been modified
    return getChangedFilesFromCache();
  } catch (error) {
    // Not in git repo or git command failed, check all files via cache
    console.log('ℹ️  Git not available, checking file hashes...');
    return getChangedFilesFromCache();
  }
}

/**
 * Check which files have changed based on file hash comparison
 */
function getChangedFilesFromCache() {
  const cache = loadCache();
  const files = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));
  const changedFiles = [];
  
  for (const file of files) {
    const filePath = path.join(docsPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const currentHash = hashContent(content);
    
    if (!cache[file] || cache[file].hash !== currentHash) {
      changedFiles.push(file);
    }
  }
  
  if (changedFiles.length === 0) {
    console.log('✨ No changes detected, all files are up to date');
  } else {
    console.log(`📝 Detected ${changedFiles.length} changed file(s) based on content hash`);
  }
  
  return changedFiles;
}

/**
 * Load build cache
 */
function loadCache() {
  if (fs.existsSync(cacheFile)) {
    try {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (error) {
      console.warn('⚠️  Failed to parse cache file, rebuilding from scratch');
      return {};
    }
  }
  return {};
}

/**
 * Save build cache
 */
function saveCache(cache) {
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
}

/**
 * Generate hash of content for change detection
 */
function hashContent(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Update cache entry for a file
 */
function updateCacheEntry(fileName, metadata) {
  const cache = loadCache();
  const filePath = path.join(docsPath, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  cache[fileName] = {
    hash: hashContent(content),
    metadata: metadata,
    lastBuilt: new Date().toISOString()
  };
  
  saveCache(cache);
  return cache;
}

/**
 * Get all file metadata (from cache for built files)
 */
function getAllFileMetadata() {
  const cache = loadCache();
  const metadataArray = [];
  const files = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const fileName = file.replace('.md', '.html');
    if (cache[fileName] && cache[fileName].metadata) {
      // Use cached metadata
      metadataArray.push({
        fileName,
        ...cache[fileName].metadata
      });
    } else {
      // File hasn't been built yet, it will be processed
      console.warn(`⚠️  No cache found for ${fileName}, it needs to be processed first`);
    }
  }
  
  return metadataArray;
}

/**
 * Check if initial build is needed (no cache exists)
 */
function isInitialBuild() {
  return !fs.existsSync(cacheFile);
}

module.exports = {
  getChangedMarkdownFiles,
  loadCache,
  saveCache,
  hashContent,
  updateCacheEntry,
  getAllFileMetadata,
  isInitialBuild
};
