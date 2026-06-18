import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Calendar, AlertCircle, CheckCircle2, History, ShieldCheck, Plus, X, Tag, Globe } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import toast from 'react-hot-toast';

const CalibrationRegistry = () => {
    const { t, i18n } = useTranslation();
    const [instruments, setInstruments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({ tag: '', frequency: 180, name_en: '', name_fr: '' });

    const fetchInstruments = async () => {
        try {
            const res = await api.get('/n/calibration');
            if (res.data.success) setInstruments(res.data.data);
        } catch (err) {
            console.error('Calibration fetch failed', err);
        }
    };

    useEffect(() => {
        fetchInstruments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                lastCal: new Date().toISOString().split('T')[0],
                nextCal: new Date(Date.now() + formData.frequency * 86400000).toISOString().split('T')[0],
                drift: "0.0",
                status: "nominal"
            };
            const res = await api.post('/n/calibration', payload);
            if(res.data.success) {
                setIsModalOpen(false);
                toast.success('Instrument enrolled to metrology ledger.');
                fetchInstruments();
                setFormData({ tag: '', frequency: 180, name_en: '', name_fr: '' });
            }
        } catch (err) {
            toast.error("Failed to enroll instrument");
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200">
                        <Thermometer className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.calibration.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.calibration.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3">
                        <Plus size={18} /> {t('nexus.calibration.enroll_instrument')}
                    </button>
                </div>
            </div>

            {/* Metrology Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-emerald-500 p-10 rounded-[3rem] text-white space-y-6">
                    <ShieldCheck />
                    <h4 className="text-[10px] font-black uppercase text-emerald-100 tracking-widest">{t('nexus.calibration.compliance_rate')}</h4>
                    <p className="text-5xl font-black tracking-tighter">{"97.4%"}</p>
                </div>
                <div className="bg-rose-500 p-10 rounded-[3rem] text-white space-y-6">
                    <AlertCircle />
                    <h4 className="text-[10px] font-black uppercase text-rose-100 tracking-widest">{t('nexus.calibration.expired_drift')}</h4>
                    <p className="text-5xl font-black tracking-tighter">{"02"}</p>
                </div>
                 <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6">
                    <History />
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('nexus.calibration.logs_processed')}</h4>
                    <p className="text-5xl font-black tracking-tighter">{"1.4k"}</p>
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.calibration.tag')}</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.calibration.last_cal')}</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.calibration.next_due')}</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.calibration.drift_analysis')}</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.calibration.status')}</th>
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('nexus.calibration.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {instruments.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-[10px]">{t('nexus.calibration.tag_prefix')}</div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 truncate tracking-tight italic uppercase">{item.tag}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {i18n.language === 'fr' ? item.name_fr : item.name_en}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-10 text-slate-500 font-bold">{item.lastCal}</td>
                                    <td className="p-10 font-black text-slate-900">{item.nextCal}</td>
                                    <td className="p-10">
                                        <span className={`font-black ${parseFloat(item.drift) > 0.1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {item.drift}
                                        </span>
                                    </td>
                                    <td className="p-10">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit ${item.status === 'nominal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100 animate-pulse'}`}>
                                            {item.status === 'nominal' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="p-10 text-right">
                                        <button onClick={() => handleGenericAction()} className="px-6 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                            {t('nexus.calibration.recalibrate')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50 shrink-0">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{t('nexus.calibration.add_title')}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.08em] sm:tracking-widest mt-1">{t('nexus.calibration.add_subtitle')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X size={32} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">{t('nexus.calibration.tag_id')}</label>
                                    <div className="relative">
                                        <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} required placeholder={t('nexus.calibration.form.tag_placeholder')} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-600 transition-all font-black text-slate-950 text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">{t('nexus.calibration.frequency')}</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input type="number" value={formData.frequency} onChange={e => setFormData({...formData, frequency: Number(e.target.value)})} required placeholder={"180"} className="w-full pl-14 sm:pl-16 pr-4 sm:pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-600 transition-all font-black text-slate-950 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">{t('nexus.calibration.name_en')}</label>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-400" size={16} />
                                        <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} required className="w-full pl-14 sm:pl-16 pr-4 sm:pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-600 transition-all font-black text-slate-950 text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">{t('nexus.calibration.name_fr')}</label>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
                                        <input type="text" value={formData.name_fr} onChange={e => setFormData({...formData, name_fr: e.target.value})} required className="w-full pl-14 sm:pl-16 pr-4 sm:pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-emerald-600 transition-all font-black text-slate-950 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 sm:py-5 border border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-[0.08em] sm:tracking-widest text-[10px]">{t('nexus.calibration.cancel')}</button>
                                <button type="submit" className="flex-1 py-4 sm:py-5 bg-slate-950 text-emerald-400 font-black rounded-2xl shadow-2xl hover:bg-black transition-all uppercase tracking-[0.08em] sm:tracking-widest text-[10px]">{t('nexus.calibration.init_node')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
        </div>
    );
};

export default CalibrationRegistry;
