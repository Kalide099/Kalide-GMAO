import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Box, Maximize2, Layers, Cpu, Database } from 'lucide-react';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const BimExplorer = () => {
    const { t } = useTranslation();
    const [simModal, setSimModal] = useState({ isOpen: false, type: null });

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-yellow-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-yellow-200">
                        <Zap className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('nexus.bim.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.bim.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSimModal({ isOpen: true, type: 'capture' })} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3">
                        <Maximize2 size={18} /> {t('nexus.bim.reality_capture')}
                    </button>
                </div>
            </div>

            {/* BIM 3D Canvas Placeholder */}
            <div className="relative group rounded-[5rem] overflow-hidden bg-slate-900 h-[700px] border-[12px] border-white shadow-3xl">
                {/* 3D Visual Rendering (Simplified Representation) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="relative">
                        <Box size={300} className="text-white/10 animate-spin-slow" />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <Cpu size={100} className="text-yellow-400 opacity-40" />
                        </div>
                    </div>
                </div>

                {/* HUD Overlays */}
                <div className="absolute top-10 left-10 space-y-6">
                    <div className="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-white w-80 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{t('nexus.bim.spatial_intelligence')}</h4>
                        <p className="text-2xl font-black italic tracking-tighter uppercase">{t('nexus.bim.machine_node')} 04-A</p>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-yellow-400 w-2/3"></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                            <span>{t('nexus.bim.health_score')}</span>
                            <span className="text-yellow-400">68.2%</span>
                        </div>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-white w-80">
                         <div className="flex items-center gap-4 mb-4">
                            <Layers className="text-emerald-400" size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{t('nexus.bim.active_layer')}: {t('nexus.loto.energy.elec')}</span>
                         </div>
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl space-y-4 w-80 translate-y-20 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <Database className="text-white" size={18} />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 uppercase italic">{t('nexus.bim.digital_twin_data')}</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{t('nexus.bim.telemetry_stream')}</p>
                    <button onClick={() => setSimModal({ isOpen: true, type: 'diagnostics' })} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">
                        {t('nexus.bim.examine_diagnostics')}
                    </button>
                </div>
            </div>

            <SimulatedProcessModal 
                isOpen={simModal.isOpen} 
                onClose={() => setSimModal({ isOpen: false, type: null })} 
                title={simModal.type === 'capture' ? 'Activating LiDAR Scan' : 'Fetching Asset Telemetry'} 
                processingText={simModal.type === 'capture' ? 'Constructing point cloud mesh...' : 'Extracting real-time database schema...'} 
                successText="Rendering Complete"
                onSuccessCallback={() => {
                    toast.success(simModal.type === 'capture' ? '3D Environment Synchronized.' : 'Diagnostics Data Loaded to HUD.');
                }}
            />
        </div>
    );
};

export default BimExplorer;
