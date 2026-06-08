const fs = require('fs');

// EN
const enPath = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/locales/en/translation.json';
let enContent = fs.readFileSync(enPath, 'utf8');
enContent = enContent.replace(/Operations Center/g, "Activity Center");
fs.writeFileSync(enPath, enContent);

// FR
const frPath = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/locales/fr/translation.json';
let frContent = fs.readFileSync(frPath, 'utf8');
frContent = frContent.replace(/Centre d'Opérations/g, "Centre d'Activité");
fs.writeFileSync(frPath, frContent);

// FleetTelematics.jsx
const ftPath = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/pages/roadmap/FleetTelematics.jsx';
let ftContent = fs.readFileSync(ftPath, 'utf8');
ftContent = ftContent.replace(/Operations Center/g, "Activity Center");
fs.writeFileSync(ftPath, ftContent);

console.log('Renamed Operations Center to Activity Center');
