import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Mail, User, Loader2, Building2, CheckCircle2, ChevronRight, Lock, Languages, Phone, Eye, EyeOff } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import api from '../../services/api/axiosConfig';
const Register = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const routePlan = searchParams.get('plan');
    const initialPlan = ['basic', 'pro', 'enterprise'].includes(routePlan) ? routePlan : 'basic';
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        industry: 'manufacturing',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPhone: '',
        password: '',
        preferredLanguage: 'en',
        plan: initialPlan
    });

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' }
    ];

    const industries = [
        { id: 'manufacturing', label: t('marketing.industries.manufacturing'), icon: '🏭' },
        { id: 'energy', label: t('marketing.industries.energy'), icon: '⚡' },
        { id: 'oil_gas', label: t('marketing.industries.oil_gas'), icon: '🛢️' },
        { id: 'logistics', label: t('marketing.industries.logistics'), icon: '🚚' },
        { id: 'mining', label: t('marketing.industries.mining'), icon: '⛏️' },
        { id: 'hospitality', label: t('marketing.industries.hospitality'), icon: '🏨' },
        { id: 'healthcare', label: t('marketing.industries.healthcare'), icon: '🏥' },
        { id: 'environment', label: t('marketing.industries.environment'), icon: '🌿' },
        { id: 'education', label: t('marketing.industries.education'), icon: '🎓' },
        { id: 'agrifood', label: t('marketing.industries.agrifood'), icon: '🍱' },
        { id: 'construction', label: t('marketing.industries.construction'), icon: '🏗️' },
        { id: 'retail', label: t('marketing.industries.retail'), icon: '🛒' },
        { id: 'public_works', icon: '🏛️', label: t('marketing.industries.public_works') }
    ];

    const planOptions = [
        { value: 'basic', label: t('pricing.tiers.basic.name') },
        { value: 'pro', label: t('pricing.tiers.pro.name') },
        { value: 'enterprise', label: t('pricing.tiers.enterprise.name') }
    ];

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/registrations/apply', formData);
            if (res.data.success) {
                setStep(2);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <PublicNavbar />
            <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-900/5 relative overflow-hidden border border-slate-100">
                        {/* Premium Accent */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                        
                        {step === 1 ? (
                            <div className="animate-fade-in-up">
                                <div className="mb-12 relative">
                                    <Link to="/" className="absolute -top-6 -left-2 text-[10px] font-black uppercase text-slate-400 hover:text-yellow-500 tracking-widest transition-colors flex items-center gap-1 group">
                                        <ChevronRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                        {t('nav.home')}
                                    </Link>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mt-6">{t('marketing.getStarted')}</h1>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">{t('marketing.platformApplication')}</p>
                                </div>
                                
                                {error && (
                                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-[1.5rem] mb-8 animate-shake flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            <Lock className="text-rose-400 w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('common.error')}</p>
                                            <p className="text-rose-900 text-xs font-semibold">{error}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 flex items-center gap-2">
                                            <Languages size={14} />
                                            {t('common.language')}
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="preferredLanguage"
                                                value={formData.preferredLanguage}
                                                onChange={handleChange}
                                                required
                                                className="input-field appearance-none bg-white cursor-pointer"
                                            >
                                                {languageOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Plan</label>
                                        <div className="relative">
                                            <select
                                                name="plan"
                                                value={formData.plan}
                                                onChange={handleChange}
                                                required
                                                className="input-field appearance-none bg-white cursor-pointer"
                                            >
                                                {planOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.companyName')}</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 focus-within:text-yellow-500 transition-colors" />
                                                <input 
                                                    name="companyName"
                                                    required
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                    className="input-field pl-14"
                                                    placeholder="Enterprise Ltd."
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.targetIndustry')}</label>
                                            <div className="relative">
                                                <select 
                                                    name="industry"
                                                    value={formData.industry}
                                                    onChange={handleChange}
                                                    className="input-field appearance-none bg-white cursor-pointer"
                                                >
                                                    {industries.map(ind => (
                                                        <option key={ind.id} value={ind.id}>{ind.icon} {ind.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.adminFirstName')}</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                                <input 
                                                    name="adminFirstName"
                                                    required
                                                    value={formData.adminFirstName}
                                                    onChange={handleChange}
                                                    className="input-field pl-14"
                                                    placeholder="John"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.adminLastName')}</label>
                                            <div className="relative">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                                <input 
                                                    name="adminLastName"
                                                    required
                                                    value={formData.adminLastName}
                                                    onChange={handleChange}
                                                    className="input-field pl-14"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.workEmail')}</label>
                                            <div className="relative">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                                <input 
                                                    name="adminEmail"
                                                    type="email" 
                                                    required
                                                    value={formData.adminEmail}
                                                    onChange={handleChange}
                                                    className="input-field pl-14"
                                                    placeholder="admin@enterprise.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('marketing.phoneNumber') || 'Phone Number'}</label>
                                            <div className="relative">
                                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                                <input 
                                                    name="adminPhone"
                                                    type="tel" 
                                                    value={formData.adminPhone}
                                                    onChange={handleChange}
                                                    className="input-field pl-14"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{t('auth.password')}</label>
                                        <div className="relative">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                                            <input 
                                                name="password"
                                                type={showPassword ? 'text' : 'password'} 
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="input-field pl-14 pr-12"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-yellow-500 transition-colors z-20 focus:outline-none"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 mt-8">
                                        <div className="relative flex items-start pt-0.5">
                                            <input
                                                type="checkbox"
                                                required
                                                className="sr-only peer"
                                                id="termsAgreementReg"
                                            />
                                            <label htmlFor="termsAgreementReg" className="w-5 h-5 rounded-md border border-slate-300 bg-white peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-all flex items-center justify-center cursor-pointer">
                                                <svg className="w-3 h-3 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </label>
                                        </div>
                                        <label htmlFor="termsAgreementReg" className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.08em] sm:tracking-widest leading-relaxed cursor-pointer select-none">
                                            {t('compliance.termsAgreeText')} <Link to="/terms" className="text-yellow-500 hover:text-yellow-600 hover:underline">{t('compliance.termsOfUse')}</Link> {t('compliance.and')} <Link to="/privacy" className="text-yellow-500 hover:text-yellow-600 hover:underline">{t('compliance.privacyPolicy')}</Link>.
                                        </label>
                                    </div>
                                    
                                    <button type="submit" 
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-70 group"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="uppercase tracking-[0.2em] text-xs">{t('marketing.submitApplication')}</span>
                                                <ChevronRight size={18} className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                                
                                <p className="mt-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                    {t('marketing.alreadyAccount')} <Link to="/login" className="text-yellow-500 hover:underline ml-2">{t('marketing.login')}</Link>
                                </p>
                            </div>
                        ) : (
                            <div className="text-center animate-fade-in-up py-10">
                                <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">{t('marketing.applicationSent')}</h2>
                                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                                    <Trans 
                                        i18nKey="marketing.applicationReceived" 
                                        values={{ companyName: formData.companyName }}
                                        components={[<span key="0" className="text-slate-900 font-black uppercase italic" />]}
                                    />
                                </p>
                                <div className="mt-12">
                                    <Link to="/" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">{t('marketing.returnHome')}</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default Register;
