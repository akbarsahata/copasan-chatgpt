#!/usr/bin/env node

/**
 * Validation script to verify the published build
 * Run after build to ensure everything is properly generated
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const errors = [];
const warnings = [];
const checks = [];

console.log('🔍 Validating build...\n');

// Check 1: Home page exists
const homePagePath = path.join(publicDir, 'index.html');
if (fs.existsSync(homePagePath)) {
  const size = fs.statSync(homePagePath).size;
  checks.push(`✅ Home page exists (${(size / 1024).toFixed(2)} KB)`);

  // Verify it links to CSS
  const content = fs.readFileSync(homePagePath, 'utf8');
  if (content.includes('/styles/theme.css')) {
    checks.push('✅ Home page references the theme stylesheet');
  } else {
    errors.push('❌ Home page does not reference /styles/theme.css');
  }
  if (content.includes('/styles/home.css')) {
    checks.push('✅ Home page references external CSS');
  } else {
    warnings.push('⚠️  Home page does not reference /styles/home.css');
  }
} else {
  errors.push('❌ Home page (index.html) not found');
}

// Check 2: Articles directory and HTML files
const articlesDir = path.join(publicDir, 'articles');
if (fs.existsSync(articlesDir)) {
  const htmlFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
  checks.push(`✅ Articles directory exists with ${htmlFiles.length} HTML files`);

  if (htmlFiles.length === 0) {
    warnings.push('⚠️  No HTML files found in articles directory');
  }

  // Check every article for CSS references
  if (htmlFiles.length > 0) {
    const missingTheme = htmlFiles.filter(
      f => !fs.readFileSync(path.join(articlesDir, f), 'utf8').includes('/styles/theme.css'),
    );
    if (missingTheme.length === 0) {
      checks.push('✅ Articles reference the theme stylesheet');
    } else {
      errors.push(`❌ ${missingTheme.length} Article Page(s) do not reference /styles/theme.css`);
    }

    const firstArticle = fs.readFileSync(path.join(articlesDir, htmlFiles[0]), 'utf8');
    if (firstArticle.includes('/styles/article.css')) {
      checks.push('✅ Articles reference external CSS');
    } else {
      warnings.push('⚠️  Articles do not reference /styles/article.css');
    }
  }
} else {
  errors.push('❌ Articles directory not found');
}

// Check 3: CSS files
const stylesDir = path.join(publicDir, 'styles');
const themeCSS = path.join(stylesDir, 'theme.css');
const homeCSS = path.join(stylesDir, 'home.css');
const articleCSS = path.join(stylesDir, 'article.css');

if (fs.existsSync(themeCSS)) {
  const size = fs.statSync(themeCSS).size;
  checks.push(`✅ theme.css exists (${(size / 1024).toFixed(2)} KB)`);
} else {
  errors.push('❌ theme.css not found');
}

if (fs.existsSync(homeCSS)) {
  const size = fs.statSync(homeCSS).size;
  checks.push(`✅ home.css exists (${(size / 1024).toFixed(2)} KB)`);
} else {
  errors.push('❌ home.css not found');
}

if (fs.existsSync(articleCSS)) {
  const size = fs.statSync(articleCSS).size;
  checks.push(`✅ article.css exists (${(size / 1024).toFixed(2)} KB)`);
} else {
  errors.push('❌ article.css not found');
}

// Check 4: _headers file
const headersFile = path.join(publicDir, '_headers');
if (fs.existsSync(headersFile)) {
  const content = fs.readFileSync(headersFile, 'utf8');
  checks.push('✅ _headers file exists');

  if (content.includes('Cache-Control')) {
    checks.push('✅ Cache-Control headers configured');
  } else {
    warnings.push('⚠️  No Cache-Control headers found in _headers');
  }

  if (content.includes('/styles/*.css')) {
    checks.push('✅ CSS caching configured');
  } else {
    warnings.push('⚠️  CSS caching not configured');
  }
} else {
  errors.push('❌ _headers file not found');
}

// Check 5: Metadata and sitemap
const metadataFile = path.join(publicDir, 'metadata.json');
if (fs.existsSync(metadataFile)) {
  const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
  checks.push(`✅ metadata.json exists with ${Object.keys(metadata).length} articles`);
} else {
  warnings.push('⚠️  metadata.json not found');
}

const sitemapFile = path.join(publicDir, 'sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  checks.push('✅ sitemap.xml exists');
} else {
  warnings.push('⚠️  sitemap.xml not found');
}

// Check 6: Internal agent docs are not published
const publishedAgents = path.join(publicDir, 'docs', 'agents');
if (fs.existsSync(publishedAgents)) {
  errors.push('❌ Internal agent docs found at public/docs/agents');
} else {
  checks.push('✅ Internal agent docs are not published');
}

// Print results
console.log('📋 Validation Results:\n');

checks.forEach(check => console.log(check));

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach(warning => console.log(warning));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:\n');
  errors.forEach(error => console.log(error));
  console.log('\n🚨 Build validation FAILED\n');
  process.exit(1);
} else {
  console.log('\n✅ Build validation PASSED\n');

  // Print summary
  const totalSize = [
    homePagePath,
    themeCSS,
    homeCSS,
    articleCSS
  ].reduce((acc, file) => {
    if (fs.existsSync(file)) {
      return acc + fs.statSync(file).size;
    }
    return acc;
  }, 0);

  console.log('📊 Summary:');
  console.log(`   - Total core files size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   - Article HTML files: ${fs.readdirSync(articlesDir).filter(f => f.endsWith('.html')).length}`);
  console.log(`   - Ready for deployment! 🚀\n`);
}
