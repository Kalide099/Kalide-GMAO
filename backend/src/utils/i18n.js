const en = {
    "auth": {
        "login_success": "Logged in successfully",
        "login_failed": "Invalid email or password",
        "unauthorized": "Access denied. No token provided.",
        "token_expired": "Token expired.",
        "invalid_token": "Invalid token.",
        "permission_denied": "You do not have permission to perform this action.",
        "user_not_found": "User not found",
        "profile_retrieved": "User profile retrieved successfully",
        "sso_retrieved": "SSO configurations retrieved",
        "sso_established": "SSO Node established successfully",
        "logout_success": "Logged out successfully",
        "reset_link_sent": "If the account exists, recovery instructions have been sent.",
        "password_reset_success": "Password reset successfully",
        "mfa_setup_initialized": "MFA setup initialized.",
        "mfa_enabled": "MFA enabled successfully.",
        "mfa_disabled": "MFA disabled successfully.",
        "mfa_backup_regenerated": "MFA backup codes regenerated."
    },
    "common": {
        "save_success": "Saved successfully",
        "delete_success": "Deleted successfully",
        "update_success": "Updated successfully",
        "retrieved": "Data retrieved successfully",
        "created": "Resource created successfully",
        "comment_added": "Comment added successfully"
    },
    "assets": {
        "retrieved": "Assets retrieved successfully"
    },
    "errors": {
        "internal_server": "Internal server error occurred",
        "validation_fail": "Validation failed",
        "not_found": "Resource not found",
        "comment_required": "Comment text is required"
    },
    "protocols": {
        "retrieved": "Protocols retrieved successfully",
        "defined": "Protocol defined successfully"
    }
};

const fr = {
    "auth": {
        "login_success": "Connexion réussie",
        "login_failed": "Email ou mot de passe invalide",
        "unauthorized": "Accès refusé. Aucun jeton fourni.",
        "token_expired": "Jeton expiré.",
        "invalid_token": "Jeton invalide.",
        "permission_denied": "Vous n'avez pas la permission d'effectuer cette action.",
        "user_not_found": "Utilisateur non trouvé",
        "profile_retrieved": "Profil utilisateur récupéré avec succès",
        "sso_retrieved": "Configurations SSO récupérées",
        "sso_established": "Nœud SSO établi avec succès",
        "logout_success": "Déconnexion réussie",
        "reset_link_sent": "Si le compte existe, les instructions de récupération ont été envoyées.",
        "password_reset_success": "Mot de passe réinitialisé avec succès",
        "mfa_setup_initialized": "Configuration MFA initialisée.",
        "mfa_enabled": "MFA activée avec succès.",
        "mfa_disabled": "MFA désactivée avec succès.",
        "mfa_backup_regenerated": "Codes de secours MFA régénérés."
    },
    "common": {
        "save_success": "Enregistré avec succès",
        "delete_success": "Supprimé avec succès",
        "update_success": "Mis à jour avec succès",
        "retrieved": "Données récupérées avec succès",
        "created": "Ressource créée avec succès",
        "comment_added": "Commentaire ajouté avec succès"
    },
    "assets": {
        "retrieved": "Actifs récupérés avec succès"
    },
    "errors": {
        "internal_server": "Une erreur interne du serveur s'est produite",
        "validation_fail": "La validation a échoué",
        "not_found": "Ressource non trouvée",
        "comment_required": "Le texte du commentaire est requis"
    },
    "protocols": {
        "retrieved": "Protocoles récupérés avec succès",
        "defined": "Protocole défini avec succès"
    }
};

const resources = { en, fr };

/**
 * Super Simple i18n Helper for Backend Localized Responses
 * @param {string} key - Dot notation key e.g. 'auth.login_success'
 * @param {string} lang - 'en' or 'fr'
 * @returns {string} - Translated string
 */
exports.t = (key, lang = 'en') => {
    const parts = key.split('.');
    let result = resources[lang] || resources['en'];
    
    for (const part of parts) {
        if (result && result[part]) {
            result = result[part];
        } else {
            return key; // Fallback to key if not found
        }
    }
    
    return result;
};
