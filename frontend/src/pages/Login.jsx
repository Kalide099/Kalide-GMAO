import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import PublicFooter from '../components/PublicFooter';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap, Fingerprint } from 'lucide-react';
import { decodeJWT } from '../utils/jwt';

const Login = () => {
    const { t } = useTranslation();
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'super_admin') {
                navigate('/admin');
            } else {
                navigate('/app');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                const token = localStorage.getItem('kgmao_token');
                const decodedToken = decodeJWT(token);

                if (decodedToken?.role === 'super_admin') {
                    navigate('/admin');
                } else {
                    navigate('/app');
                }
            }
        } catch (err) {
            const msg = err.response?.data?.message || t('auth.login_failed');
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col font-sans bg-slate-950 selection:bg-yellow-400/30">
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Global Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Left Side: Cinematic Industrial Brand Wall */}
                <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden border-r border-white/5">
                    <img 
                        src="https://images.unsplash.com/photo-1565615822731-dd059780a717?auto=format&fit=crop&q=80&w=2000" 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity" 
                        alt="Industrial Command Center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-transparent"></div>
                    <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between p-24 w-full h-full">
                        <div className="flex items-center gap-5 animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.3)] border border-yellow-300/50 backdrop-blur-md group relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <Zap className="text-slate-950 w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-500" fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter leading-none italic">KGMAO</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2">{t('common.intelligence')}</p>
                            </div>
                        </div>

                        <div className="space-y-10 animate-fade-in-up md:delay-100">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                                    <span className="text-white text-[9px] font-black uppercase tracking-[0.3em] opacity-80">
                                        {t('auth.enterpriseClass')}
                                    </span>
                                </div>
                                <h2 className="text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase italic">
                                    {t('auth.welcome')}<br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600">
                                        {t('auth.strategicOps')}
                                    </span>
                                </h2>
                                <p className="text-slate-400 max-w-lg text-sm font-semibold leading-relaxed uppercase tracking-widest pt-4">
                                    {t('marketing.heroSubtitle')}
                                </p>
                            </div>

                            <div className="flex gap-16 border-t border-white/10 pt-10">
                                <div className="space-y-3 cursor-default group">
                                    <p className="text-3xl font-black text-white tracking-tighter group-hover:text-yellow-400 transition-colors duration-500 italic">99.98%</p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 group-hover:text-slate-400 transition-colors">
                                        {t('auth.uptimeSla')}
                                    </p>
                                </div>
                                <div className="space-y-3 cursor-default group">
                                    <p className="text-3xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors duration-500 flex items-center gap-3 italic">
                                        ISO-27K
                                        <ShieldCheck className="text-emerald-400/80 group-hover:text-emerald-400 transition-colors" size={24} />
                                    </p>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-400 transition-colors">{t('auth.securityCore')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: High-End Auth Matrix */}
                <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 md:p-16 relative z-10">
                    
                    {/* Top Actions: Mobile Brand + Desktop Nav */}
                    <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
                        <Zap className="text-yellow-500 w-8 h-8 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" fill="currentColor" />
                        <span className="text-xl font-black text-white tracking-tighter italic">KGMAO</span>
                    </div>

                    <div className="absolute top-8 right-8 flex items-center gap-6">

                        <LanguageSwitcher />
                    </div>

                    {/* Auth Component Container */}
                    <div className="w-full max-w-md animate-fade-in-up md:delay-200">
                        <div className="mb-12 relative">
                            <Link to="/" className="absolute -top-10 left-0 text-[10px] font-black uppercase text-slate-400 hover:text-yellow-400 tracking-widest transition-colors flex items-center gap-2 group">
                                <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                {t('nav.home')}
                            </Link>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-3 flex items-center gap-3 mt-4">
                                <Fingerprint className="text-yellow-400" size={32} />
                                {t('auth.signInBtn')}
                            </h3>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">{t('auth.secureAccess')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl animate-shake flex items-start gap-4 backdrop-blur-md">
                                    <div className="mt-0.5 shrink-0">
                                        <Lock className="text-rose-400 w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('common.error')}</p>
                                        <p className="text-rose-200 text-xs font-medium leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">{t('auth.email')}</label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-md"></div>
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-yellow-400 transition-colors z-10" />
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white font-medium focus:bg-white/10 focus:border-yellow-400/50 transition-all outline-none text-sm placeholder:text-slate-600 relative z-10 backdrop-blur-xl"
                                        placeholder="admin@enterprise.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 flex justify-between">
                                    <span>{t('auth.password')}</span>
                                    <Link to="/forgot-password" className="text-slate-500 hover:text-yellow-400 transition-colors">{t('auth.forgotPassword')}</Link>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-md"></div>
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-yellow-400 transition-colors z-10" />
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white font-medium focus:bg-white/10 focus:border-yellow-400/50 transition-all outline-none text-sm placeholder:text-slate-600 relative z-10 backdrop-blur-xl"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full h-14 mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                ) : (
                                    <>
                                        <span className="uppercase tracking-[0.15em] text-xs relative z-10">{t('auth.signInBtn')}</span>
                                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                                {t('marketing.noCard')} <br/>
                                <Link to="/register" className="text-white hover:text-yellow-400 transition-colors flex items-center justify-center gap-2 mt-3">
                                    {t('marketing.startTrialBtn')} <ArrowRight size={12} />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default Login;
