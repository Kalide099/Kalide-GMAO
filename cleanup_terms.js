const fs = require('fs');

const file = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/locales/en/translation.json';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
    'Syncing': 'Loading',
    'syncing': 'loading',
    'Matrix': 'System',
    'matrix': 'system',
    'Telemetry': 'Data',
    'telemetry': 'data',
    'Forensic': 'Audit',
    'forensic': 'audit',
    'Node': 'Location',
    'node': 'location',
    'Protocol': 'Standard',
    'protocol': 'standard',
    'Nexus': 'Suite',
    'nexus': 'suite'
};

let json = JSON.parse(content);

function replaceStrings(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            for (let [jargon, standard] of Object.entries(replacements)) {
                // simple replace globally, respecting case using regex
                const regex = new RegExp(jargon, 'g');
                obj[key] = obj[key].replace(regex, standard);
            }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            replaceStrings(obj[key]);
        }
    }
}

replaceStrings(json);

fs.writeFileSync(file, JSON.stringify(json, null, 2));
console.log('Successfully cleaned up jargon in translation.json');
