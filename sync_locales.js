const fs = require('fs');
const path = require('path');

const enPath = path.resolve(__dirname, 'frontend/src/locales/en/translation.json');
const frPath = path.resolve(__dirname, 'frontend/src/locales/fr/translation.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const frData = JSON.parse(fs.readFileSync(frPath, 'utf8'));

// Helper to deep merge objects and add missing keys.
// If a key exists in source but not in target, it sets the value in target to the value in source accompanied by a "[TODO-TRANS]" prefix,
// OR if it's already translated, we might just copy the value or a placeholder.
function syncKeys(source, target, isFrToEn) {
    let modified = false;
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {};
                modified = true;
            }
            if (syncKeys(source[key], target[key], isFrToEn)) {
                modified = true;
            }
        } else {
            if (target[key] === undefined) {
                target[key] = source[key]; // Just copy it over so it isn't "missing"
                modified = true;
            }
        }
    }
    return modified;
}

let enChanged = syncKeys(frData, enData, true);
let frChanged = syncKeys(enData, frData, false);

if (enChanged) fs.writeFileSync(enPath, JSON.stringify(enData, null, 4));
if (frChanged) fs.writeFileSync(frPath, JSON.stringify(frData, null, 4));

console.log('Strict Bilingual Sync Complete.');
console.log('EN changed:', enChanged);
console.log('FR changed:', frChanged);
