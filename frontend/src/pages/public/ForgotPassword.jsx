import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import { Mail, ArrowLeft, Loader2, ShieldCheck, Zap } from 'lucide-react';
import api from '../../services/api/axiosConfig';
const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [resetLink, setResetLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            if (response.data?.success) {
                setIsSent(true);
                setStatusMessage(response.data?.message || 'Recovery instructions sent.');

                const token = response.data?.data?.resetToken;
                if (token) {
                    setResetLink(`/reset-password?token=${encodeURIComponent(token)}`);
                } else {
                    setResetLink('');
                }
            }
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'Unable to start recovery. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                <div className="w-full max-w-md bg-white rounded-[4rem] shadow-2xl border border-slate-100 p-12 md:p-16 relative z-10 animate-fade-in-up">
                    <div className="mb-10 text-center relative">
                        <Link to="/" className="absolute -top-6 left-0 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 tracking-widest transition-colors flex items-center gap-1 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            {t('nav.home')}
                        </Link>
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/10 mt-6">
                            <Zap className="text-yellow-400 w-8 h-8" fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('auth.forgotPassword')}</h2>
                        <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{t('auth.recoverAccessDesc', 'Identify your enterprise node to initiate recovery protocol.')}</p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="group space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-5">{t('auth.email')}</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-[2rem] pl-16 pr-6 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none text-sm shadow-sm"
                                        placeholder="admin@enterprise.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" 
                                disabled={isLoading}
                                className="w-full h-18 bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                                ) : (
                                    <span className="uppercase tracking-widest">{t('auth.sendResetLink', 'Send Recovery Link')}</span>
                                )}
                            </button>

                            {statusMessage ? (
                                <p className="text-xs font-bold uppercase tracking-widest text-center text-slate-500">{statusMessage}</p>
                            ) : null}
                        </form>
                    ) : (
                        <div className="text-center space-y-8 bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 border-dashed animate-scale-in">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                                <ShieldCheck className="text-white w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-emerald-900 font-black uppercase text-sm tracking-widest">{t('auth.recoverySent', 'Recovery Protocol Initiated')}</h4>
                                <p className="text-emerald-600 text-[10px] font-bold uppercase leading-loose tracking-widest">{statusMessage || t('auth.checkEmail', 'Check your encrypted inbox for further instructions.')}</p>
                                {resetLink ? (
                                    <Link to={resetLink} className="inline-block mt-3 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                                        {t('auth.resetNow', 'Reset now (development)')}
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('auth.backToLogin', 'Return to Headquarters')}
                        </Link>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default ForgotPassword;
