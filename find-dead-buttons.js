const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath, fileList);
        } else if (filePath.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = walk(path.join(__dirname, 'frontend/src'));
const deadButtons = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        // Look for <button but try to make sure it doesn't have onClick or type="submit"
        // Since it could span multiple lines, this naive line-by-line check might have false positives,
        // but let's check it anyway.
        if (line.match(/<button/) && !line.match(/onClick/) && !line.match(/type="submit"/)) {
            // Check next lines for onClick or type just in case it spans
            let hasAction = false;
            for(let i=index; i<Math.min(index+5, lines.length); i++) {
                if (lines[i].match(/onClick/) || lines[i].match(/type="submit"/)) {
                    hasAction = true;
                    break;
                }
            }
            if (!hasAction) {
                deadButtons.push(`${file}:${index + 1}: ${line.trim()}`);
            }
        }
    });
});

console.log(deadButtons.join('\n'));
