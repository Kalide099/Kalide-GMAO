import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('kgmao_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('kgmao_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('kgmao_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
            <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 justify-between backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                
                <div className="flex items-start gap-5 flex-1">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                        <Cookie className="text-yellow-400 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-black uppercase tracking-widest text-lg mb-2">{t('compliance.cookieTitle')}</h3>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                            {t('compliance.cookieDesc')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                    <button 
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-3 rounded-full border border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                    >
                        {t('compliance.cookieDecline')}
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-yellow-400/20"
                    >
                        {t('compliance.cookieAccept')}
                    </button>
                </div>
                
                <button 
                    onClick={handleDecline} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
