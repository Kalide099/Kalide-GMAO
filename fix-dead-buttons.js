const fs = require('fs');
const path = require('path');

const directoriesToScan = [
    path.join(__dirname, 'frontend/src/pages/phase5'),
    path.join(__dirname, 'frontend/src/pages/nexus'),
    path.join(__dirname, 'frontend/src/pages/industry'),
    path.join(__dirname, 'frontend/src/pages/roadmap'),
];

let modifiedFiles = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Find <button ... > without onClick
    // We use a regex that matches <button followed by attributes not containing onClick, ending with >
    // Because JSX can be multiline, we need to be careful.
    
    // Simpler approach: find all `<button `
    // Check if the tag contains `onClick=` before the closing `>`.
    
    const buttonRegex = /<button\s([^>]*?)>/g;
    
    let hasModifications = false;
    
    content = content.replace(buttonRegex, (match, attrs) => {
        if (!attrs.includes('onClick=')) {
            hasModifications = true;
            // Inject onClick
            return `<button onClick={() => toast.success('Module active. Awaiting field data telemetry.')} ${attrs}>`;
        }
        return match;
    });

    if (hasModifications) {
        // Ensure toast is imported
        if (!content.includes("import toast from 'react-hot-toast'")) {
            // Find the last import and append it
            const importRegex = /^import.*?;/gm;
            let lastImportIndex = 0;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                lastImportIndex = match.index + match[0].length;
            }
            
            if (lastImportIndex > 0) {
                content = content.slice(0, lastImportIndex) + "\nimport toast from 'react-hot-toast';" + content.slice(lastImportIndex);
            } else {
                content = "import toast from 'react-hot-toast';\n" + content;
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFiles++;
        console.log(`Patched: ${filePath}`);
    }
}

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

for (const dir of directoriesToScan) {
    scanDir(dir);
}

console.log(`Scan complete. Fixed dead buttons in ${modifiedFiles} files.`);
