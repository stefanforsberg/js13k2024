const fs = require('fs-extra');
const archiver = require('archiver');
const path = require('path');

// Define the output file path and the source directory
const output = fs.createWriteStream(path.join(__dirname, 'prod.zip'));
const distDir = path.join(__dirname, 'prod');

// Create a new archiver instance
const archive = archiver('zip', {
    zlib: { level: 9 }, // Set the compression level
});

// Handle errors
archive.on('error', (err) => {
    throw err;
});

// Pipe the archive data to the output file
archive.pipe(output);

// Append the dist folder to the archive
archive.directory(distDir, false);

// Finalize the archive
archive.finalize();

output.on('close', () => {
    console.log(`ZIP file created successfully. Total bytes: ${archive.pointer()}`);
});