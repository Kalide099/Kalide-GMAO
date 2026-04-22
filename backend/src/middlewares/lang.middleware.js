/**
 * Extract language from headers or query parameters and attach to request stream.
 */
exports.extractLanguage = (req, res, next) => {
    // Priority 1: Query parameter ?lang=en
    let lang = req.query.lang;
    
    // Priority 2: Accept-Language header (e.g. "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7")
    if (!lang && req.headers['accept-language']) {
        lang = req.headers['accept-language'].split(',')[0].split('-')[0];
    }
    
    // Default fallback
    if (!lang) {
        lang = 'en';
    }

    // Supported languages whitelist check (optional, but good for security)
    const supportedLangs = ['en', 'fr'];
    if (!supportedLangs.includes(lang.toLowerCase())) {
        lang = 'en';
    }

    req.lang = lang.toLowerCase();
    next();
};
