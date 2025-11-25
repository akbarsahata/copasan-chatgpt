const fs = require("fs");
const path = require("path");
const { getAllFileMetadata } = require("./build-utils");

const metadataFile = path.join(__dirname, "../metadata.json");

// Function to update metadata file
function updateMetadata() {
  console.log("📝 Generating public metadata.json...\n");

  // Get all metadata from cache
  const allMetadata = getAllFileMetadata();

  // Convert array to object format (fileName -> metadata)
  // Convert .md to .html for public URLs
  const metadataObj = {};
  allMetadata.forEach((meta) => {
    const htmlFileName = meta.fileName.replace('.md', '.html');
    metadataObj[htmlFileName] = {
      title: meta.title,
      desc: meta.desc,
      createdAt: meta.createdAt,
    };
  });

  // Write updated metadata to file
  fs.writeFileSync(metadataFile, JSON.stringify(metadataObj, null, 2), "utf-8");

  // Write a copy of metadata.json to ../public/metadata.json
  const publicMetadataFile = path.join(__dirname, "../public/metadata.json");
  fs.writeFileSync(publicMetadataFile, JSON.stringify(metadataObj), "utf-8");

  console.log(`✅ Generated metadata for ${allMetadata.length} article(s)`);
  console.log(`📁 Saved to: ${metadataFile}\n`);
}

// Run the update
updateMetadata();
