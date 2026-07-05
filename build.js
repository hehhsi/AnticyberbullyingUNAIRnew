const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

// Create dist folder
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
}

// Folders to copy
const folders = ['js', 'css', 'assets', 'source'];
// Files to copy
const files = ['index.html', 'about.html', 'education.html', 'style.css', 'script.js'];

folders.forEach(folder => {
    if (fs.existsSync(folder)) {
        fs.cpSync(folder, path.join(distPath, folder), { recursive: true });
    }
});

files.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(distPath, file));
    }
});

console.log('Build complete. Files copied to dist/ manually.');
