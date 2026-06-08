const fs = require('fs');
const p = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/locales/fr/translation.json';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/Salle de Guerre/g, "Centre d'Opérations");
c = c.replace(/War Room/g, "Centre d'Opérations");
fs.writeFileSync(p, c);
console.log('Fixed French translations.');
