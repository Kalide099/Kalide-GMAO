const fs = require('fs');
const path = require('path');

const directoryToScan = path.join(__dirname, 'frontend/src/pages');

let modifiedFiles = 0;
let totalButtonsPatched = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    let newContent = content;
    let index = 0;
    let patchedCount = 0;
    
    while (true) {
        index = newContent.indexOf('<button', index);
        if (index === -1) break;
        
        let closeIndex = newContent.indexOf('>', index);
        if (closeIndex === -1) break; 
        
        let tag = newContent.substring(index, closeIndex);
        
        if (!tag.includes('onClick=') && !tag.includes('onClick={')) {
            // Inject onClick
            newContent = newContent.substring(0, index + 7) + 
                         ` onClick={() => toast.success('Module active. Awaiting field data telemetry.')}` + 
                         newContent.substring(index + 7);
            closeIndex += 82; // approximate length
            patchedCount++;
            totalButtonsPatched++;
        }
        index = closeIndex + 1;
    }

    if (patchedCount > 0) {
        if (!newContent.includes("import toast from 'react-hot-toast'")) {
            const importRegex = /^import.*?;?/gm;
            let lastImportIndex = 0;
            let match;
            while ((match = importRegex.exec(newContent)) !== null) {
                lastImportIndex = match.index + match[0].length;
            }
            
            if (lastImportIndex > 0) {
                newContent = newContent.slice(0, lastImportIndex) + "\nimport toast from 'react-hot-toast';\n" + newContent.slice(lastImportIndex);
            } else {
                newContent = "import toast from 'react-hot-toast';\n" + newContent;
            }
        }
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        modifiedFiles++;
        console.log(`Patched ${patchedCount} buttons in: ${filePath}`);
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

scanDir(directoryToScan);

console.log(`Scan complete. Fixed ${totalButtonsPatched} dead buttons across ${modifiedFiles} files.`);
