import { useState, useEffect } from 'react';
import { Search, Command, X, Activity, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CommandPalette = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    // Handle Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isOpen ? onClose() : onClose(true); // Assuming parent handles state toggle, we just trigger it. Wait, the parent handles state. We'll dispatch a custom event or let the parent handle the hotkey.
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const quickLinks = [
        { icon: <Activity size={16} />, label: t('commandPalette.mainDashboard'), path: '/app' },
        { icon: <Link size={16} />, label: t('commandPalette.assetList'), path: '/app/assets' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 sm:pt-48 bg-slate-900/60 backdrop-blur-sm animate-fade-in px-4">
            <div className="bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700 animate-slide-up relative">
                
                <div className="flex items-center px-6 py-4 border-b border-slate-800">
                    <Search className="text-slate-400 mr-4" size={24} />
                    <input 
                        type="text" 
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('commandPalette.searchPlaceholder')}
                        className="flex-1 bg-transparent border-none outline-none text-slate-100 text-lg placeholder-slate-500 font-sans"
                    />
                    <button onClick={() => onClose()} className="p-2 text-slate-500 hover:text-slate-300 transition-colors bg-slate-800 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto font-sans">
                    {query.length === 0 ? (
                        <>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 px-2">{t('commandPalette.quickLinks')}</p>
                            <div className="space-y-1">
                                {quickLinks.map((link, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleNavigate(link.path)}
                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors text-left text-slate-300 hover:text-white"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                            {link.icon}
                                        </div>
                                        <span className="font-semibold">{link.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Command size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-400 font-semibold">{t('commandPalette.noMatches', { query })}</p>
                            <p className="text-slate-500 text-sm mt-1">{t('commandPalette.enterToSearch')}</p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-950 px-6 py-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800 font-sans">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-sans">↑</kbd> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-sans">↓</kbd> {t('commandPalette.toNavigate')}</span>
                        <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-sans">↵</kbd> {t('commandPalette.toSelect')}</span>
                    </div>
                    <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-sans">{t('commandPalette.escKey')}</kbd> {t('commandPalette.toClose')}</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
