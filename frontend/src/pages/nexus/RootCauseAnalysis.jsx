import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Save, ArrowRight, BrainCircuit, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api/axiosConfig';

const RootCauseAnalysis = () => {
    const { t } = useTranslation();

    const handleGenericAction = async () => {
        try {
            const res = await api.post('/n/rootcauseanalysis', { action: 'Generic Action Executed', timestamp: new Date() });
            if(res.data.success) {
                toast.success('Action synced to database.');
            }
        } catch (err) {
            toast.error('Failed to communicate with Nexus Backend');
        }
    };
        const [whys, setWhys] = useState(['', '', '', '', '']);
    const [ishikawa, setIshikawa] = useState({
        man: '', machine: '', method: '', material: '', environment: ''
    });
    
    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <Search className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.rca.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.rca.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => handleGenericAction()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3">
                        <Save size={16} /> {t('common.save')}
                    </button>
                    <button onClick={() => handleGenericAction()} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
                        <Share2 size={16} /> {t('nexus.rca.export_protocol')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* 5 Whys Builder */}
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                    <div className="flex items-center gap-4">
                        <BrainCircuit className="text-indigo-600" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{t('nexus.rca.whys')}</h2>
                    </div>

                    <div className="space-y-6">
                        {whys.map((why, idx) => (
                            <div key={idx} className="relative group">
                                <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-100 group-focus-within:text-indigo-100 transition-colors">
                                    {idx + 1}
                                </span>
                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                                            {idx === 0 ? t('nexus.rca.initial_problem') : `${t('nexus.rca.why_num')}${idx + 1}`}
                                        </label>
                                        <input 
                                            type="text"
                                            value={why}
                                            onChange={(e) => {
                                                const newWhys = [...whys];
                                                newWhys[idx] = e.target.value;
                                                setWhys(newWhys);
                                            }}
                                            placeholder="..."
                                            className="w-full bg-slate-50 border-none rounded-2xl p-5 text-slate-800 font-bold focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                    {idx < whys.length - 1 && (
                                        <ArrowRight className="text-slate-200 mt-6" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ishikawa Matrix */}
                <div className="bg-slate-950 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 space-y-10">
                         <div className="flex items-center gap-4">
                            <Plus className="text-yellow-400" />
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">{t('nexus.rca.ishikawa')}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Object.keys(ishikawa).map((key) => (
                                <div key={key} className="space-y-3">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{key}</label>
                                    <textarea 
                                        value={ishikawa[key]}
                                        onChange={(e) => setIshikawa({ ...ishikawa, [key]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white font-bold h-32 focus:bg-white/10 focus:border-indigo-500/50 transition-all outline-none"
                                        placeholder={t('nexus.rca.analyze_factors', { key })}
                                    />
                                </div>
                            ))}
                            <div className="flex flex-col justify-end">
                                <div className="bg-yellow-400 p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-400/20 text-slate-950 font-black italic uppercase tracking-tighter text-2xl">
                                    {t('nexus.rca.root_found')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default RootCauseAnalysis;
