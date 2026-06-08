// replace_terms.js
import fs from 'fs';

const path = 'frontend/src/locales/en/translation.json';
let raw = fs.readFileSync(path, 'utf8');
let data = JSON.parse(raw);

const replaceMap = {
  "Industrial OS": "System",
  "Industrial Protocol L-404 Active": "Protocol Active",
  "Industrial Nexus": "Operations Hub",
  "Industrial Protocol": "Protocol",
  "Industrial Node": "User Node",
  "Industrial Identity Node": "User Node",
  "Industrial Suite": "Operations Suite",
  "Industrial": "System",
  // Safety
  "Lockout Tagout (LOTO)": "Safety Lock",
  "Digital Energy Isolation Protocol": "Energy Isolation",
  // Maintenance
  "Reliability Centered Maintenance": "Maintenance Planner",
  "FMEA": "Criticality Mapping",
  // Forensics
  "Forensic": "Investigation",
  "Forensic Protocol": "Investigation Protocol",
  "Forensic Audit": "Audit",
  "Critical Failure": "Error",
  "Suspended": "Paused",
  "Operational": "Running",
  "Active": "On",
  "Inactive": "Off",
  "Pending": "Waiting",
  "Completed": "Done"
};

function replaceInObj(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      let val = obj[key];
      for (const [oldStr, newStr] of Object.entries(replaceMap)) {
        if (val.includes(oldStr)) {
          val = val.split(oldStr).join(newStr);
        }
      }
      // generic clean-up: remove remaining "Industrial "
      val = val.replace(/Industrial\s+/g, '');
      obj[key] = val;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceInObj(obj[key]);
    }
  }
}

replaceInObj(data);

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Translation terms replaced.');
