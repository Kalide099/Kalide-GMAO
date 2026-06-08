import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WifiOff, Database, RefreshCcw, Server, Globe } from 'lucide-react';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const OfflineMatrix = () => {
    const { t } = useTranslation();
    const [isSyncing, setIsSyncing] = useState(false);
    const [simModalOpen, setSimModalOpen] = useState(false);

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-slate-900 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-slate-700">
                        <WifiOff className="text-yellow-400 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                            {t('nexus.offline.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.offline.subtitle')}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => { setIsSyncing(true); setTimeout(() => setIsSyncing(false), 2000); }}
                    className="px-10 py-5 bg-yellow-400 text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-yellow-300 transition-all flex items-center gap-3"
                >
                    <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} /> {t('nexus.offline.force_sync')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Local Cache Stats */}
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                     <div className="flex items-center gap-4">
                        <Database className="text-indigo-600" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{t('nexus.offline.engine')}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.offline.cached_assets')}</p>
                            <p className="text-4xl font-black text-slate-800 italic">{"1,242"}</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.offline.pending_sync')}</p>
                            <p className="text-4xl font-black text-rose-500 italic">{"0"}</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.offline.latency')}</p>
                            <p className="text-4xl font-black text-emerald-500 italic">{"1ms"}</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.offline.integrity')}</p>
                            <p className="text-4xl font-black text-slate-800 italic">{"100%"}</p>
                        </div>
                    </div>
                </div>

                {/* Cloud Connectivity Status */}
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                    <div className="flex items-center gap-4">
                        <Globe className="text-emerald-500" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{t('nexus.offline.topology')}</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                                    <Server size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 uppercase italic">{t('nexus.offline.hq_relay')}</h4>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{t('nexus.offline.hq_status')}</span>
                                </div>
                            </div>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>

                         <div className="p-8 bg-slate-50 rounded-[2.5rem] flex items-center justify-between group grayscale opacity-50">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-400 rounded-2xl flex items-center justify-center text-white">
                                    <Server size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 uppercase italic">{t('nexus.offline.edge_relay')}</h4>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('nexus.offline.edge_status')}</span>
                                </div>
                            </div>
                            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                        </div>
                    </div>

                    <button onClick={() => setSimModalOpen(true)} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200">
                        {t('nexus.offline.diag_feed')}
                    </button>
                </div>
            </div>

            <SimulatedProcessModal 
                isOpen={simModalOpen} 
                onClose={() => setSimModalOpen(false)} 
                title="Pinging Edge Relays" 
                processingText="Analyzing localized node topology..." 
                successText="Topology Verified"
                onSuccessCallback={() => toast.success('Diagnostic feed streamed successfully.')}
            />
        </div>
    );
};

export default OfflineMatrix;
