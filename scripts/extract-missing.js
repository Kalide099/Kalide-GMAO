const fs = require('fs');
const path = require('path');

const enFile = path.resolve(__dirname, '../frontend/src/locales/en/translation.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

function setDeep(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  if (current[parts[parts.length - 1]] === undefined) {
    current[parts[parts.length - 1]] = value;
    return true;
  }
  return false;
}

function findTrns(dir) {
  let fileList = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let full = path.join(dir, file);
    if (fs.statSync(full).isDirectory() && !full.includes('node_modules')) {
      fileList = fileList.concat(findTrns(full));
    } else if (full.endsWith('.jsx') || full.endsWith('.js')) {
      fileList.push(full);
    }
  });
  return fileList;
}

const allFiles = findTrns(path.resolve(__dirname, '../frontend/src'));
let totalAdded = 0;
const regex = /t\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/g;

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const defaultValue = match[2];
    if (setDeep(enData, key, defaultValue)) {
      totalAdded++;
      console.log(`+ Added [${key}]: "${defaultValue}"`);
    }
  }
});

if (totalAdded > 0) {
  fs.writeFileSync(enFile, JSON.stringify(enData, null, 4));
  console.log(`\n✅ Successfully extracted and added ${totalAdded} new translation keys to EN.`);
} else {
  console.log('No new translation keys with defaults found.');
}
