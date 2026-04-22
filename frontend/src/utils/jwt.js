export const decodeJWT = (token) => {
    try {
        if (!token || typeof token !== 'string' || !token.includes('.')) {
            return null;
        }
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const base64Url = parts[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad to a multiple of 4
        while (base64.length % 4) {
            base64 += '=';
        }
        const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        
        // Expiration check (exp is in seconds)
        if (payload.exp && payload.exp < Date.now() / 1000) {
            console.warn("JWT has expired");
            return null;
        }
        
        return payload;
    } catch (error) {
        console.error("JWT Decode Error:", error);
        return null;
    }
};
