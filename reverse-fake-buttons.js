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

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('Module active. Awaiting field data telemetry.')) {
        
        const isRoadmap = file.includes(path.join('pages', 'roadmap')) || 
                          file.includes(path.join('pages', 'nexus')) || 
                          file.includes(path.join('pages', 'industry')) || 
                          file.includes(path.join('pages', 'phase4')) || 
                          file.includes(path.join('pages', 'phase5'));
                          
        if (isRoadmap) {
            content = content.replace(/toast\.success\('Module active\. Awaiting field data telemetry\.'\)/g, "toast('🚧 Coming Soon - Requires Telemetry', { icon: '🚧' })");
        } else {
            content = content.replace(/ onClick=\{\(\) => toast\.success\('Module active\. Awaiting field data telemetry\.'\)\}/g, '');
        }
        
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
});
