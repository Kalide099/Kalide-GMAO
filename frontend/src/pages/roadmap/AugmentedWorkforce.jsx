import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tablet, Video, Radio, ClipboardCheck, UserCheck, MessageSquare, PhoneCall } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api/axiosConfig';

const AugmentedWorkforce = () => {
    const { t } = useTranslation();

    const handleGenericAction = async () => {
        try {
            const res = await api.post('/n/augmentedworkforce', { action: 'Generic Action Executed', timestamp: new Date() });
            if(res.data.success) {
                toast.success('Action synced to database.');
            }
        } catch (err) {
            toast.error('Failed to communicate with Nexus Backend');
        }
    };
        const [step, setStep] = useState(1);
    
    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.augmented_workforce', 'Augmented Workforce')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-rose-500 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.mixed_reality_proced', 'Mixed Reality Procedural Intelligence')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => handleGenericAction()} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] shadow-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all">
                        <Video size={20} className="text-rose-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{t('roadmap.connect_remote_exper', 'Connect Remote Expert')}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* AR Viewfinder Scaffolding */}
                <div className="lg:col-span-3 bg-slate-900 rounded-[4rem] h-[650px] relative overflow-hidden shadow-2xl border-r-8 border-rose-500">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    
                    {/* Simulated AR Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center p-20">
                        <div className="w-full h-full border-2 border-dashed border-rose-500/30 rounded-[3rem] flex items-center justify-center relative">
                            {/* Visual Tracking Points */}
                            <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-rose-500"></div>
                            <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-rose-500"></div>
                            <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-rose-500"></div>
                            <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-rose-500"></div>

                            {/* Procedure Hologram Simulation */}
                            <div className="text-center space-y-6 bg-slate-800/50 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/5 shadow-2xl">
                                <Radio className="text-rose-500 mx-auto animate-ping" size={48} />
                                <h3 className="text-4xl font-black text-white italic">Step {step}: Calibrate Pressure Valve</h3>
                                <p className="text-slate-400 text-[10px] font-black tracking-widest leading-loose max-w-md mx-auto">
                                    {t('roadmap._turn_the_central_bo', '"Turn the central bolt 15° clockwise until the digital HUD indicator turns neon green."')}
                                </p>
                                <div className="pt-8 flex justify-center gap-6">
                                    <button onClick={() => setStep(Math.max(1, step - 1))} className="px-8 py-3 bg-white/5 text-white rounded-xl border border-white/10 font-black text-[10px] tracking-widest hover:bg-white/10">{t('roadmap.back', 'BACK')}</button>
                                    <button onClick={() => setStep(step + 1)} className="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-600/20">{t('roadmap.next_step', 'NEXT STEP')}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HUD Status */}
                    <div className="absolute top-12 left-12 flex gap-4">
                        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                            <Tablet className="text-white" size={16} />
                            <span className="text-[10px] font-black text-white tracking-widest uppercase">{t('roadmap.ar_hud_active', 'AR HUD ACTIVE')}</span>
                        </div>
                    </div>
                </div>

                {/* Remote Assistance Controls */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-4 italic uppercase">
                            <UserCheck className="text-rose-600" /> {t('roadmap.active_support', 'Active Support')}
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:bg-slate-900 transition-all cursor-pointer">
                                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all font-black italic">M</div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 group-hover:text-white leading-none">{t('roadmap.maxime_l', 'Maxime L.')}</p>
                                    <p className="text-[9px] text-slate-400 font-black tracking-widest mt-1 uppercase">{t('roadmap.senior_fluid_expert', 'Senior Fluid Expert')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50 space-y-4">
                             <button onClick={() => handleGenericAction()} className="w-full py-5 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all">
                                <PhoneCall size={16} /> {t('roadmap.start_voice_link', 'START VOICE LINK')}
                             </button>
                             <button 
                                onClick={() => step >= 3 && handleGenericAction()}
                                className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all ${step >= 3 ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800' : 'bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed'}`}
                             >
                                <ClipboardCheck size={16} /> {t('roadmap.sign_off_task', 'SIGN OFF TASK')}
                             </button>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-6">
                        <MessageSquare className="text-yellow-400" size={32} />
                        <h4 className="text-lg font-black italic tracking-tight">{t('roadmap.expert_notes', 'Expert Notes')}</h4>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest leading-loose">
                            {t('roadmap._double_check_the_o', '"Double check the O-ring seal before increasing pressure to 400 bar."')}
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default AugmentedWorkforce;
