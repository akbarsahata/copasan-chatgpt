const normalizeTitle = (title) => {
    // Remove surrounding quotes if present
    if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
        title = title.slice(1, -1);
    }

    // Convert to lowercase
    title = title.toLowerCase();

    // Replace unsafe URL characters with dashes
    title = title.replace(/[^a-z0-9\s-]/g, '-');

    // Replace spaces with dashes and return the normalized title
    // Replace spaces with dashes
    title = title.replace(/\s+/g, '-');

    // Replace multiple dashes with a single dash
    return title.replace(/-+/g, '-');
};

// Read the command line argument
const inputTitle = process.argv[2];

if (!inputTitle) {
    console.error('Please provide a title as a command line argument.');
    process.exit(1);
}

const normalizedTitle = normalizeTitle(inputTitle);
console.log(normalizedTitle);