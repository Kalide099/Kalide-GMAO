import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, KeyRound, Loader2, ShieldCheck, AlertTriangle, Zap, Eye, EyeOff } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import api from '../../services/api/axiosConfig';
const ResetPassword = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get('token') || '';

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!token) {
            setStatus({ type: 'error', message: t('auth.invalidResetToken', 'Invalid reset token.') });
            return;
        }

        if (password.length < 8) {
            setStatus({ type: 'error', message: t('auth.passwordMinLength', 'Password must be at least 8 characters.') });
            return;
        }

        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: t('auth.passwordMismatch', 'Passwords do not match.') });
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/reset-password', { token, password });
            setStatus({
                type: 'success',
                message: response.data?.message || t('auth.password_reset_success', 'Password reset successfully.')
            });

            setTimeout(() => navigate('/login'), 1200);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || t('auth.resetFailed', 'Password reset failed. Please request a new recovery link.')
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <PublicNavbar />
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                    <div className="absolute top-1/4 right-1/4 w-[40rem] h-[40rem] bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                <div className="w-full max-w-md bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 p-6 sm:p-8 md:p-12 relative z-10 animate-fade-in-up">
                    <div className="mb-10 text-center relative">
                        <Link to="/login" className="absolute -top-6 left-0 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 tracking-widest transition-colors flex items-center gap-1 group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            {t('auth.backToLogin', 'Back to login')}
                        </Link>
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/10 mt-6">
                            <Zap className="text-yellow-400 w-8 h-8" fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('auth.resetPassword', 'Reset Password')}</h2>
                        <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            {t('auth.resetPasswordDesc', 'Set a new password to recover your account access.')}
                        </p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-8">
                        <div className="group space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-5">{t('auth.newPassword', 'New Password')}</label>
                            <div className="relative">
                                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full h-14 sm:h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-[2rem] pl-14 sm:pl-16 pr-14 sm:pr-16 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none text-sm shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors z-20 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="group space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-5">{t('auth.confirmPassword', 'Confirm Password')}</label>
                            <div className="relative">
                                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className="w-full h-14 sm:h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-[2rem] pl-14 sm:pl-16 pr-14 sm:pr-16 text-slate-900 font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none text-sm shadow-sm"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors z-20 focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-yellow-400" /> : <span className="uppercase tracking-widest">{t('auth.resetPassword', 'Reset Password')}</span>}
                        </button>

                        {status.message ? (
                            <div className={`rounded-2xl border p-4 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                                {status.type === 'success' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                <p className="text-xs font-bold uppercase tracking-wider">{status.message}</p>
                            </div>
                        ) : null}
                    </form>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default ResetPassword;
