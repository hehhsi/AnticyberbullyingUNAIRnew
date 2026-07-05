const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

// Create dist folder
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
}

function copyRecursiveSync(src, dest) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

const folders = ['js', 'css', 'assets', 'source'];
const files = ['index.html', 'about.html', 'education.html', 'style.css', 'script.js'];

folders.forEach(folder => {
    copyRecursiveSync(path.join(__dirname, folder), path.join(distPath, folder));
});

files.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(path.join(__dirname, file), path.join(distPath, file));
    }
});

console.log('Build complete. Files copied to dist/ manually.');
