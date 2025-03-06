import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.join(__dirname, '../hardhat/typechain-types');
const targetDir = path.join(__dirname, '../typechain-types');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Copy the entire directory structure
copyDir(sourceDir, targetDir);

console.log('Typechain types copied successfully!'); 