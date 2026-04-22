const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('src');
let hasError = false;
files.forEach(f => {
  try {
    require('child_process').execSync(`node -c "${f}"`, {stdio:'ignore'});
  } catch(e) {
    console.log('Syntax error in:', f);
    hasError = true;
  }
});
if (!hasError) console.log('Syntax check complete, no errors.');
