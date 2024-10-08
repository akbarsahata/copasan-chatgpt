const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "../docs");
const metadataFile = path.join(__dirname, "../metadata.json");

// Function to extract title and description from markdown content
function extractMetadata(content) {
  const lines = content.split("\n");
  let title = "";
  let desc = "";

  for (let line of lines) {
    if (line.startsWith("# ")) {
      title = line.replace("# ", "").trim();
    } else if (
      title &&
      line.trim() &&
      !line.startsWith("#") &&
      !line.startsWith("-") &&
      !line.startsWith("*") &&
      !line.startsWith(">") &&
      !line.startsWith("!") &&
      !line.startsWith("[") &&
      !line.startsWith("```")
    ) {
      // Remove markdown notation from the description line
      desc =
        line
          .replace(
            /(\*\*|__|~~|`|>|#+|\*|-|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\))/g,
            ""
          )
          .trim()
          .slice(0, 150) + "...";
      break;
    }
  }

  return { title, desc };
}

// Function to update metadata file
function updateMetadata() {
  let metadata = {};

  // Read existing metadata if file exists
  if (fs.existsSync(metadataFile)) {
    metadata = JSON.parse(fs.readFileSync(metadataFile, "utf-8"));
  } else {
    console.log("Metadata file not found. Creating new file...");

    // Create metadata file with empty object
    fs.writeFileSync(metadataFile, "{}", "utf-8");
  }

  // Read files in docs directory
  const files = fs.readdirSync(docsDir);

  files.forEach((file) => {
    if (!metadata[file]) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { title, desc } = extractMetadata(content);
      console.log(`Updating metadata for ${file}`);
      console.log(`Title: ${title}`);
      console.log(`Description: ${desc}`);
      console.log("------");
      metadata[file] = { title, desc, createdAt: new Date().toISOString() };
    }
  });

  // Write updated metadata to file
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), "utf-8");

  // Write a copy of metadata.json to ../public/metadata.json
  const publicMetadataFile = path.join(__dirname, "../public/metadata.json");
  fs.writeFileSync(publicMetadataFile, JSON.stringify(metadata), "utf-8");
}

// Run the update
updateMetadata();
