import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import api from '../services/api/axiosConfig';
import { decodeJWT } from '../utils/jwt';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const checkSession = () => {
        const token = localStorage.getItem('kgmao_token');
        if (token) {
            try {
                const decodedToken = decodeJWT(token);
                if (decodedToken) {
                    const preferredLanguage = decodedToken.preferred_language || localStorage.getItem('kgmao_language') || 'en';
                    localStorage.setItem('kgmao_language', preferredLanguage);
                    i18n.changeLanguage(preferredLanguage);
                    setUser(decodedToken);
                } else {
                    localStorage.removeItem('kgmao_token');
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
                localStorage.removeItem('kgmao_token');
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkSession();
    }, []);

    const login = async (email, password, options = {}) => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                ...(options.mfaCode ? { mfaCode: options.mfaCode } : {}),
                ...(options.backupCode ? { backupCode: options.backupCode } : {})
            });
            if (response.data.success) {
                const preferredLanguage = response.data.data.user?.preferredLanguage || response.data.data.user?.preferred_language || 'en';
                localStorage.setItem('kgmao_token', response.data.data.token);
                localStorage.setItem('kgmao_language', preferredLanguage);
                i18n.changeLanguage(preferredLanguage);
                checkSession();
                return true;
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
        return false;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.warn('Logout endpoint failed, clearing local session anyway.');
        } finally {
            localStorage.removeItem('kgmao_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    const stopImpersonatedSession = () => {
        // Here we could implement mechanisms to fetch the original token if cached in sessionStorage,
        // For simplicity, we just force a re-login after impersonation finishes natively.
        logout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, stopImpersonatedSession }}>
            {loading ? (
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-2xl shadow-yellow-400/20"></div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-white font-black uppercase tracking-[0.3em] text-xs">{t('common.syncHQ')}</p>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {children}
                    {/* INJECTED IMPERSONATION BANNER GLOBALLY VISIBLE WHEN ACTIVE */}
                    {user?.is_impersonating && (
                        <div className="fixed bottom-0 left-0 right-0 bg-rose-600 text-white p-2 text-center z-50 flex items-center justify-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
                            <span className="font-bold tracking-wide">{t('admin.impersonation_alert')}</span>
                            <button 
                                onClick={stopImpersonatedSession}
                                className="bg-black/30 hover:bg-black/50 px-4 py-1 rounded text-sm transition-colors font-medium border border-white/20"
                            >
                                {t('admin.end_impersonation')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </AuthContext.Provider>
    );
};

