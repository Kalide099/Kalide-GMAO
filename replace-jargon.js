const fs = require('fs');

const files = [
    'frontend/src/locales/en/translation.json',
    'frontend/src/locales/fr/translation.json'
];

const replacements = [
    [/\bIndustrial\b/g, 'Business'],
    [/\bindustrial\b/g, 'business'],
    [/\bMatrix\b/g, 'Workspace'],
    [/\bmatrix\b/g, 'workspace'],
    [/\bNexus\b/g, 'Center'],
    [/\bnexus\b/g, 'center'],
    [/\bHub\b/g, 'Center'],
    [/\bhub\b/g, 'center'],
    [/\bProtocol\b/g, 'Setup'],
    [/\bprotocol\b/g, 'setup'],
    [/\bTelemetry\b/g, 'Live Data'],
    [/\btelemetry\b/g, 'live data'],
    [/\bForensic\b/g, 'Detailed'],
    [/\bforensic\b/g, 'detailed'],
    [/\bIngestion\b/g, 'Loading'],
    [/\bingestion\b/g, 'loading'],
    [/\bFlux\b/g, 'Flow'],
    [/\bflux\b/g, 'flow'],
    [/\bNeural\b/g, 'Smart'],
    [/\bneural\b/g, 'smart'],
    [/\bNode\b/g, 'Site'],
    [/\bnode\b/g, 'site'],
    [/\bUplink\b/g, 'Connection'],
    [/\buplink\b/g, 'connection'],
    [/\bLOTO\b/g, 'Safety Lock'],
    [/\bFMEA\b/g, 'Risk Check'],
    [/\bTFLOPs\b/g, 'Performance'],
    [/\bCyber-Physical\b/g, 'Security'],
    [/\bcryptographic\b/g, 'secure'],
    [/\bCryptographic\b/g, 'Secure'],
    [/\bSovereign\b/g, 'Admin'],
    [/\bsovereign\b/g, 'admin'],
    [/\bROOT\b/g, 'ADMIN'],

    [/\bMatrice\b/g, 'Espace'],
    [/\bmatrice\b/g, 'espace'],
    [/\bNœud\b/g, 'Site'],
    [/\bnœud\b/g, 'site'],
    [/\bHub\b/g, 'Centre'],
    [/\bhub\b/g, 'centre'],
    [/\bNexus\b/g, 'Centre'],
    [/\bnexus\b/g, 'centre'],
    [/\bProtocole\b/g, 'Configuration'],
    [/\bprotocole\b/g, 'configuration'],
    [/\bForensique\b/g, 'Détaillé'],
    [/\bforensique\b/g, 'détaillé'],
    [/\bIngestion\b/g, 'Chargement'],
    [/\bingestion\b/g, 'chargement'],
    [/\bFlux\b/g, 'Suivi'],
    [/\bflux\b/g, 'suivi'],
    [/\bTélémétrie\b/g, 'Données en direct'],
    [/\btélémétrie\b/g, 'données en direct'],
    [/\bNeural\b/g, 'Intelligent'],
    [/\bneural\b/g, 'intelligent'],
    [/\bIndustriel\b/g, 'Métier'],
    [/\bindustriel\b/g, 'métier']
];

function replaceValues(obj) {
    if (typeof obj === 'string') {
        let val = obj;
        for (const [regex, replacement] of replacements) {
            val = val.replace(regex, replacement);
        }
        return val;
    } else if (Array.isArray(obj)) {
        return obj.map(item => replaceValues(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = replaceValues(obj[key]);
        }
        return newObj;
    }
    return obj;
}

for (const filePath of files) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);
        const newJson = replaceValues(json);
        fs.writeFileSync(filePath, JSON.stringify(newJson, null, 2), 'utf8');
        console.log(`Jargon replaced safely in values only: ${filePath}`);
    } catch (err) {
        console.error(`Failed on ${filePath}:`, err.message);
    }
}
