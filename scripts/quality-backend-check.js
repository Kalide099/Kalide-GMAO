const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = process.cwd();
const backendSrc = path.join(root, 'backend', 'src');

const collectJsFiles = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectJsFiles(fullPath));
            continue;
        }

        if (entry.isFile() && fullPath.endsWith('.js')) {
            files.push(fullPath);
        }
    }

    return files;
};

if (!fs.existsSync(backendSrc)) {
    console.error('Backend source directory not found:', backendSrc);
    process.exit(1);
}

const files = collectJsFiles(backendSrc);
if (files.length === 0) {
    console.error('No backend JS files found to validate.');
    process.exit(1);
}

let hasErrors = false;

for (const filePath of files) {
    const check = spawnSync(process.execPath, ['--check', filePath], { stdio: 'pipe' });
    if (check.status !== 0) {
        hasErrors = true;
        console.error(`Syntax check failed: ${path.relative(root, filePath)}`);
        if (check.stderr?.length) {
            console.error(check.stderr.toString());
        }
    }
}

if (hasErrors) {
    process.exit(1);
}

console.log(`Backend syntax check passed for ${files.length} files.`);
