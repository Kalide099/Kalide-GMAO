import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Mail, User, Loader2, Building2, CheckCircle2, ChevronRight, Lock, Languages, Phone } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import api from '../../services/api/axiosConfig';
const Register = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        industry: 'manufacturing',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPhone: '',
        password: '',
        preferredLanguage: 'en'
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
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-900/5 relative overflow-hidden border border-slate-100">
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
                                
                                <form onSubmit={handleSubmit} className="space-y-8">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                type="password" 
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="input-field pl-14"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button type="submit" 
                                        disabled={loading}
                                        className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 disabled:opacity-70 group"
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
