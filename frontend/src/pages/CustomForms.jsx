import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    Layout, Plus, Search, Layers, ShieldCheck, 
    Trash2, Edit3, Globe, Hammer, Terminal, FileText, CheckCircle2
} from 'lucide-react';

const CustomForms = () => {
    const { t } = useTranslation();
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/custom-forms');
            if (res.data.success) setForms(res.data.data);
        } catch (err) {
            console.error("Forms Sync Failed.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = forms.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <FileText className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('cmms.protocols.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('cmms.protocols.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('cmms.protocols.search')}
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
                        {t('cmms.protocols.add')}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{t('cmms.protocols.initializing')}</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map((form, i) => (
                        <div key={form.id} className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-4 bg-slate-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Layers size={24} />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${form.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {form.is_active ? t('common.status.active') : t('common.status.offline')}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors">{form.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">{t('cmms.protocols.target')}: {form.entity_type}</p>

                            <div className="space-y-4 border-t border-slate-50 pt-8 mb-12">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">6 {t('cmms.protocols.fields')}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-500">
                                    <FileText size={16} className="opacity-40" />
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Modified: {new Date(form.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 py-4 bg-slate-950 text-yellow-400 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-slate-200">
                                    {t('cmms.protocols.build_logic')}
                                </button>
                                <button className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-slate-100">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                            <Terminal size={48} className="mx-auto text-slate-200 mb-6" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">{t('cmms.protocols.empty')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomForms;
