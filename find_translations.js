const fs = require('fs');
const path = require('path');

const enFile = path.resolve(__dirname, 'frontend/src/locales/en/translation.json');
const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));

function flattenObj(obj, prefix = '', res = {}) {
  for (let k in obj) {
    let key = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      flattenObj(obj[k], key, res);
    } else {
      res[key] = true;
    }
  }
  return res;
}

const flatEn = flattenObj(enData);

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

const allFiles = findTrns(path.resolve(__dirname, 'frontend/src'));
const missing = new Set();
const regex = /t\(['"]([^'"]+)['"]/g;

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    if (!flatEn[key]) {
      // It might be accessing dynamically via variables, skip dynamic keys with variables
      if (!key.includes('${')) {
         missing.add(key);
      }
    }
  }
});

console.log('Missing translation keys in english:', Array.from(missing));
