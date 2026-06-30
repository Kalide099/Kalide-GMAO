import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, CheckCircle2, Lock, Key, FileSignature, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api/axiosConfig';

const LotoProtocol = () => {
    const { t } = useTranslation();

    const handleGenericAction = () => {
        toast.success(t('common.actionSuccess') || 'Action queued successfully.');
    };
        const [steps, setSteps] = useState([
        { id: 1, title: t('nexus.loto.steps.s1'), status: 'pending', energyType: t('nexus.loto.energy.elec') },
        { id: 2, title: t('nexus.loto.steps.s2'), status: 'pending', energyType: t('nexus.loto.energy.pneu') },
        { id: 3, title: t('nexus.loto.steps.s3'), status: 'pending', energyType: t('nexus.loto.energy.resid') },
    ]);
    const [isSigned, setIsSigned] = useState(false);
    
    const toggleStep = (id) => {
        setSteps(steps.map(s => s.id === id ? { ...s, status: s.status === 'completed' ? 'pending' : 'completed' } : s));
    };

    const allCompleted = steps.every(s => s.status === 'completed');

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-rose-600 p-12 rounded-[3.5rem] shadow-2xl shadow-rose-200">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center border border-white/30">
                        <ShieldAlert className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {t('nexus.loto.title')}
                        </h1>
                        <p className="text-rose-100 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.loto.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 px-8 py-4 rounded-3xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest">
                    <AlertCircle size={18} className="animate-pulse" /> {t('nexus.loto.danger_zone')}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Protocol Steps */}
                <div className="lg:col-span-2 space-y-8">
                    {steps.map((step) => (
                        <div 
                            key={step.id} 
                            onClick={() => toggleStep(step.id)}
                            className={`p-10 rounded-[3.5rem] border transition-all cursor-pointer flex items-center justify-between group ${step.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100 hover:border-rose-200'}`}
                        >
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-500'}`}>
                                    {step.status === 'completed' ? <CheckCircle2 /> : <Lock />}
                                </div>
                                <div>
                                    <h4 className={`text-2xl font-black uppercase italic tracking-tight ${step.status === 'completed' ? 'text-emerald-900' : 'text-slate-900'}`}>
                                        {step.title}
                                    </h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('nexus.loto.source')}: {step.energyType}</span>
                                </div>
                            </div>
                            <div className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest ${step.status === 'completed' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                                {step.status === 'completed' ? t('nexus.loto.isolated') : t('nexus.loto.locked')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Authority Signature */}
                <div className="bg-slate-900 p-12 rounded-[4rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Key size={140} />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">{t('nexus.loto.auth_title')}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{t('nexus.loto.auth_desc')}</p>
                    </div>

                    <div className="aspect-video bg-white/5 border-2 border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center relative group overflow-hidden">
                        {isSigned ? (
                            <div className="text-emerald-400 text-center animate-fade-in-up">
                                <FileSignature size={48} className="mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">{t('nexus.loto.signed')}</p>
                            </div>
                        ) : (
                            <div className="text-center opacity-40">
                                <FileSignature size={48} className="mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">{t('nexus.loto.draw_here')}</p>
                            </div>
                        )}
                        <canvas className="absolute inset-0 w-full h-full cursor-crosshair" onClick={() => setIsSigned(true)}></canvas>
                    </div>

                    <button 
                        disabled={!allCompleted || !isSigned}
                        onClick={() => handleGenericAction()}
                        className={`w-full py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all ${allCompleted && isSigned ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 shadow-2xl shadow-yellow-400/20 active:scale-95' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}
                    >
                        {t('nexus.loto.verify_lock')}
                    </button>
                    
                    {!allCompleted && (
                        <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                            {t('nexus.loto.pending')} {steps.filter(s => s.status !== 'completed').length} {t('nexus.loto.isolation_steps')}
                        </p>
                    )}
                </div>
            </div>

            
        </div>
    );
};

export default LotoProtocol;
