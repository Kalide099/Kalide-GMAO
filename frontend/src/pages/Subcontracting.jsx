import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    Users, Plus, Search, Star, Mail, Phone, ShieldCheck, 
    Trash2, Hammer, Terminal
} from 'lucide-react';

import SimulatedProcessModal from '../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const Subcontracting = () => {
    const { t } = useTranslation();
    const [subcontractors, setSubcontractors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [simModalOpen, setSimModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        contact_email: '',
        contact_phone: '',
        service_type: '',
        rating: 5
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/subcontractors');
            if (res.data.success) setSubcontractors(res.data.data);
        } catch (err) {
            console.error("Subcontractor Sync Failed.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/subcontractors', formData);
            if (res.data.success) {
                setIsModalOpen(false);
                setFormData({ name: '', contact_email: '', contact_phone: '', service_type: '', rating: 5 });
                fetchData();
                toast.success('Subcontractor Registered successfully.');
            }
        } catch (err) {
            toast.error(t('common.error'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            const res = await api.delete(`/subcontractors/${id}`);
            if (res.data.success) {
                fetchData();
                toast.success('Subcontractor profile deleted.');
            }
        } catch (err) {
            toast.error('Deletion failed');
        }
    };

    const filtered = subcontractors.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <Users className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('cmms.subcontracting.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('cmms.subcontracting.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('cmms.subcontracting.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-950 hover:bg-slate-900 text-yellow-400 px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 border border-white/5"
                    >
                        <Plus size={20} />
                        {t('cmms.subcontracting.add')}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{t('cmms.subcontracting.syncing')}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map((sub, i) => (
                        <div key={sub.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Hammer size={24} />
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 rounded-full">
                                    <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                    <span className="text-[11px] font-black text-yellow-700">{sub.rating}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors">{sub.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{sub.service_type || t('common.generalService')}</p>

                            <div className="space-y-4 border-t border-slate-50 pt-8 mb-10">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <Mail size={16} className="opacity-40" />
                                    <span className="text-xs font-bold text-slate-700">{sub.contact_email}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <Phone size={16} className="opacity-40" />
                                    <span className="text-xs font-bold text-slate-700">{sub.contact_phone}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">{t('common.activeProtocol')}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setSimModalOpen(true)} className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                                    {t('cmms.subcontracting.view_reports')}
                                </button>
                                <button onClick={() => handleDelete(sub.id)} className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-600 transition-all border border-slate-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && !loading && (
                        <div className="col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                            <Terminal size={48} className="mx-auto text-slate-200 mb-6" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t('cmms.subcontracting.empty')}</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('cmms.subcontracting.register_partner')}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{t('cmms.subcontracting.new_entity')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('cmms.subcontracting.partner_branding')}</label>
                                <input 
                                    type="text" required
                                    placeholder={t('cmms.subcontracting.company_placeholder')}
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-1 space-y-4">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('cmms.subcontracting.email_node')}</label>
                                    <input 
                                        type="email" required
                                        placeholder={t('cmms.subcontracting.email_placeholder')}
                                        value={formData.contact_email}
                                        onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('cmms.subcontracting.comms_channel')}</label>
                                    <input 
                                        type="text"
                                        placeholder={t('cmms.subcontracting.phone_placeholder')}
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('cmms.subcontracting.service_cluster')}</label>
                                <input 
                                    type="text"
                                    placeholder={t('cmms.subcontracting.service_placeholder')}
                                    value={formData.service_type}
                                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>

                            <button type="submit" className="w-full py-6 bg-slate-950 text-yellow-400 font-black rounded-3xl shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-widest text-[10px]">
                                {t('cmms.subcontracting.add')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <SimulatedProcessModal 
                isOpen={simModalOpen} 
                onClose={() => setSimModalOpen(false)} 
                title="Generating Forensic Report" 
                processingText="Compiling Partner Service Telemetry..." 
                successText="Report Generated & Available"
                onSuccessCallback={() => toast.success('Report cached in Document Vault.')}
            />
        </div>
    );
};

export default Subcontracting;
