const fs = require('fs');
const path = require('path');

const srcPages = 'C:/Users/Acer/Documents/Kalide Global/KGMAO/frontend/src/pages';

function replaceInFile(file, regex, replacement) {
    const fullPath = path.join(srcPages, file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(fullPath, content);
}

// Assets.jsx
replaceInFile('Assets.jsx', 
    /asset\.name \|\| asset\.name_en \|\| asset\.name_fr/g, 
    "i18n.language === 'fr' ? (asset.name_fr || asset.name_en || asset.name) : (asset.name_en || asset.name_fr || asset.name)"
);
replaceInFile('Assets.jsx',
    /qrAsset\.name \|\| qrAsset\.name_en \|\| qrAsset\.name_fr/g,
    "i18n.language === 'fr' ? (qrAsset.name_fr || qrAsset.name_en || qrAsset.name) : (qrAsset.name_en || qrAsset.name_fr || qrAsset.name)"
);

// We need to add `const { t, i18n } = useTranslation();` to Assets.jsx if it's just `const { t } = useTranslation();`
let assetsPath = path.join(srcPages, 'Assets.jsx');
let assetsContent = fs.readFileSync(assetsPath, 'utf8');
assetsContent = assetsContent.replace(/const \{ t \} = useTranslation\(\);/g, "const { t, i18n } = useTranslation();");
fs.writeFileSync(assetsPath, assetsContent);


// WorkOrders.jsx
replaceInFile('WorkOrders.jsx',
    /order\.asset_name \|\| order\.asset_name_en \|\| order\.asset_name_fr/g,
    "i18n.language === 'fr' ? (order.asset_name_fr || order.asset_name_en || order.asset_name) : (order.asset_name_en || order.asset_name_fr || order.asset_name)"
);
replaceInFile('WorkOrders.jsx',
    /asset\.name \|\| asset\.name_en \|\| asset\.name_fr/g,
    "i18n.language === 'fr' ? (asset.name_fr || asset.name_en || asset.name) : (asset.name_en || asset.name_fr || asset.name)"
);
let woPath = path.join(srcPages, 'WorkOrders.jsx');
let woContent = fs.readFileSync(woPath, 'utf8');
woContent = woContent.replace(/const \{ t \} = useTranslation\(\);/g, "const { t, i18n } = useTranslation();");
fs.writeFileSync(woPath, woContent);


// Inventory.jsx
replaceInFile('Inventory.jsx',
    /item\.name \|\| item\.name_en \|\| item\.name_fr/g,
    "i18n.language === 'fr' ? (item.name_fr || item.name_en || item.name) : (item.name_en || item.name_fr || item.name)"
);
let invPath = path.join(srcPages, 'Inventory.jsx');
let invContent = fs.readFileSync(invPath, 'utf8');
invContent = invContent.replace(/const \{ t \} = useTranslation\(\);/g, "const { t, i18n } = useTranslation();");
fs.writeFileSync(invPath, invContent);

console.log('Fixed dual language presentation logic in pages.');
