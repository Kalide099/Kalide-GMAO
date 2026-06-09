import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    ShieldCheck, Key, Globe, Plus, Trash2, 
    Fingerprint, Lock
} from 'lucide-react';

const SSOConfig = () => {
    const { t } = useTranslation();
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusTone, setStatusTone] = useState('');
    const [formData, setFormData] = useState({
        provider_name: '',
        idp_entity_id: '',
        sso_url: '',
        public_certificate: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/sso-config');
            if (res.data.success) setConfigs(res.data.data);
        } catch (err) {
            console.error("SSO Sync Failed.", err);
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
            const res = await api.post('/auth/sso-config', formData);
            if (res.data.success) {
                setIsModalOpen(false);
                setStatusTone('success');
                setStatusMessage(res.data.message || 'SSO configuration created.');
                fetchData();
            }
        } catch (err) {
            setStatusTone('error');
            setStatusMessage(err?.response?.data?.message || 'Protocol Violation.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirmDelete') || 'Delete this SSO configuration?')) return;

        try {
            await api.delete(`/auth/sso-config/${id}`);
            await fetchData();
        } catch (err) {
            setStatusTone('error');
            setStatusMessage(err?.response?.data?.message || 'Delete failed.');
        }
    };

    const handleVerify = (url) => {
        if (!url) {
            setStatusTone('error');
            setStatusMessage('Missing SSO endpoint URL.');
            return;
        }
        setStatusTone('success');
        setStatusMessage('SSO endpoint opened in a new tab.');
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl group cursor-pointer hover:rotate-12 transition-transform border border-white/10">
                        <Fingerprint className="text-yellow-400 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('marketing.sso.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('marketing.sso.subtitle')}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all"
                >
                    <Plus size={20} />
                    {t('marketing.sso.integrate')}
                </button>
            </div>

            {statusMessage && (
                <div className={`rounded-[2rem] px-6 py-4 font-bold text-xs uppercase tracking-widest border ${statusTone === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {statusMessage}
                </div>
            )}

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-yellow-400 rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{t('marketing.sso.syncing')}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {configs.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                            <Lock size={48} className="mx-auto text-slate-200 mb-6" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t('marketing.sso.empty')}</p>
                        </div>
                    ) : (
                        configs.map((cfg) => (
                            <div key={cfg.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group animate-fade-in-up">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                        <Globe size={24} />
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        {t('marketing.sso.active_nexus')}
                                    </span>
                                </div>
                                
                                <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">{cfg.provider_name}</h3>
                                <div className="space-y-4 border-t border-slate-50 pt-8 mb-10">
                                    <div className="flex items-center gap-4 text-slate-500 overflow-hidden">
                                        <Key size={16} className="opacity-40" />
                                        <span className="text-xs font-bold text-slate-700 truncate">{cfg.idp_entity_id}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-500 overflow-hidden">
                                        <ShieldCheck size={16} className="text-emerald-500" />
                                        <span className="text-xs font-bold text-slate-700 truncate">{cfg.sso_url}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => handleVerify(cfg.sso_url)} className="flex-1 py-4 bg-slate-950 text-yellow-400 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl">
                                        {t('marketing.sso.verify')}
                                    </button>
                                    <button onClick={() => handleDelete(cfg.id)} className="px-5 py-4 bg-rose-50 text-rose-300 hover:bg-rose-600 hover:text-white rounded-2xl transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-900/90 backdrop-blur-xl animate-fade-in">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] shadow-3xl overflow-hidden animate-scale-in flex flex-col">
                        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic font-black">{t('marketing.sso.link_node')}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] sm:tracking-[0.3em] mt-2">{t('marketing.sso.protocol')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('marketing.sso.provider_domain')}</label>
                                <input 
                                    type="text" required
                                    placeholder={t('marketing.sso.provider_placeholder')}
                                    value={formData.provider_name}
                                    onChange={(e) => setFormData({...formData, provider_name: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('marketing.sso.idp_entity_id')}</label>
                                <input 
                                    type="text" required
                                    placeholder={t('marketing.sso.idp_placeholder')}
                                    value={formData.idp_entity_id}
                                    onChange={(e) => setFormData({...formData, idp_entity_id: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('marketing.sso.entry_point')}</label>
                                <input 
                                    type="text" required
                                    placeholder={t('marketing.sso.entry_placeholder')}
                                    value={formData.sso_url}
                                    onChange={(e) => setFormData({...formData, sso_url: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('marketing.sso.x509_cert')}</label>
                                <textarea 
                                    placeholder={t('marketing.sso.cert_placeholder')}
                                    value={formData.public_certificate}
                                    onChange={(e) => setFormData({...formData, public_certificate: e.target.value})}
                                    className="w-full h-32 px-4 sm:px-8 py-4 sm:py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-mono text-[10px]"
                                />
                            </div>

                            <button type="submit" className="w-full py-5 sm:py-6 bg-slate-900 text-white font-black rounded-2xl sm:rounded-3xl shadow-2xl hover:bg-black transition-all uppercase tracking-[0.08em] sm:tracking-widest text-[10px]">
                                {t('marketing.sso.establish')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SSOConfig;
