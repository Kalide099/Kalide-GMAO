import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Send, Globe, Clock, ShieldCheck } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({ name: '', email: '', sector: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
        
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error(t('common.fieldRequired') || 'Please fill in all required fields.');
            return;
        }
        setSubmitted(true);
        toast.success(t('contact.successMsg') || 'Message received. Our team will respond within 24 hours.');
        setFormData({ name: '', email: '', sector: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden flex flex-col">
            <PublicNavbar />
            <div className="flex-1">
            
            {/* Split Screen Layout */}
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-96px)]">
                
                <div className="lg:w-1/2 bg-slate-950 p-12 lg:p-24 relative overflow-hidden flex flex-col justify-between order-2 lg:order-1">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic">
                                {t('contact.hq').split(' ')[0]} <span className="text-yellow-400">{t('contact.hq').split(' ')[1]}</span>
                            </h1>
                            <p className="text-slate-400 text-lg font-medium max-w-md uppercase tracking-widest leading-loose">
                                {t('contact.hqSubtitle')}
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="flex items-start gap-8 group">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-500">
                                    <MapPin className="text-yellow-400 group-hover:text-slate-900 w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1 italic">{t('contact.worldHeadquarters')}</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">{t('contact.addressLine1')}<br/>{t('contact.addressLine2')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-8 group">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500">
                                    <Phone className="text-indigo-400 group-hover:text-white w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1 italic">{t('contact.secureComms')}</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed text-xl font-black">{t('contact.phoneNumber')}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-8 group">
                                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-500">
                                    <Globe className="text-emerald-400 group-hover:text-white w-7 h-7" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1 italic">{t('contact.regionalClusters')}</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">{t('contact.clustersDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-20 flex gap-10 border-t border-white/10">
                        <div className="space-y-2">
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t('contact.responseProtocol')}</p>
                             <div className="flex items-center gap-3">
                                 <Clock className="text-emerald-400" size={16} />
                                 <span className="text-white font-black text-sm uppercase tracking-widest italic">{t('contact.mttrValue')}</span>
                             </div>
                        </div>
                        <div className="space-y-2">
                             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t('contact.secureLine')}</p>
                             <div className="flex items-center gap-3">
                                 <ShieldCheck className="text-yellow-400" size={16} />
                                 <span className="text-white font-black text-sm uppercase tracking-widest italic">{t('contact.encryptionStandard')}</span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Communication Matrix (Form) */}
                <div className="lg:w-1/2 p-5 sm:p-8 lg:p-16 xl:p-24 flex items-center justify-center order-1 lg:order-2">
                    <div className="w-full max-w-md space-y-8 sm:space-y-12">
                        <div className="space-y-3">
                            <span className="inline-flex max-w-full px-4 py-1.5 bg-yellow-400 text-slate-900 text-[10px] font-black uppercase tracking-[0.08em] sm:tracking-[0.3em] rounded-full">{t('contact.secureTransmission')}</span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{t('contact.terminalTitle')}</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('contact.fullName')}</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full h-14 sm:h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-3xl px-4 sm:px-8 font-bold focus:border-yellow-400 outline-none transition-all placeholder:text-slate-200" placeholder={t('contact.placeholders.name')} />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('contact.email')}</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full h-14 sm:h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-3xl px-4 sm:px-8 font-bold focus:border-yellow-400 outline-none transition-all placeholder:text-slate-200" placeholder={t('contact.placeholders.email')} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('contact.sector')}</label>
                                <select value={formData.sector} onChange={(e) => setFormData({...formData, sector: e.target.value})} className="w-full h-14 sm:h-16 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-3xl px-4 sm:px-8 font-bold focus:border-yellow-400 outline-none transition-all appearance-none cursor-pointer">
                                    <option>{t('contact.sectors.sales')}</option>
                                    <option>{t('contact.sectors.support')}</option>
                                    <option>{t('contact.sectors.partnership')}</option>
                                    <option>{t('contact.sectors.billing')}</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{t('contact.briefing')}</label>
                                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full h-36 sm:h-40 bg-slate-50 border-2 border-slate-50 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 font-bold focus:border-yellow-400 outline-none transition-all resize-none placeholder:text-slate-200" placeholder={t('contact.briefingPlaceholder')}></textarea>
                            </div>

                            <button type="submit" className="w-full min-h-16 sm:h-20 bg-slate-900 hover:bg-black text-white rounded-2xl sm:rounded-[2.5rem] font-black uppercase tracking-[0.08em] sm:tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 group px-4">
                                {t('contact.submit')}
                                <Send size={20} className="text-yellow-400 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            </div>
            <PublicFooter />

            
        </div>
    );
};

export default ContactUs;
