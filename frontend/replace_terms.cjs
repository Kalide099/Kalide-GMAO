// replace_terms.cjs
const fs = require('fs');
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
  "Lockout Tagout (LOTO)": "Safety Lock",
  "Digital Energy Isolation Protocol": "Energy Isolation",
  "Reliability Centered Maintenance": "Maintenance Planner",
  "FMEA": "Criticality Mapping",
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
    const val = obj[key];
    if (typeof val === 'string') {
      let newVal = val;
      for (const [oldStr, newStr] of Object.entries(replaceMap)) {
        if (newVal.includes(oldStr)) {
          newVal = newVal.split(oldStr).join(newStr);
        }
      }
      // Remove any lingering "Industrial " prefix
      newVal = newVal.replace(/Industrial\s+/g, '');
      obj[key] = newVal;
    } else if (typeof val === 'object' && val !== null) {
      replaceInObj(val);
    }
  }
}

replaceInObj(data);

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Translation terms replaced successfully');
