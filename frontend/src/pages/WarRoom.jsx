import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Globe, Shield, Activity, Zap, Cpu, 
    AlertTriangle, Server, Radio, Crosshair, 
    Terminal, Database, Maximize2, Layers
} from 'lucide-react';
import api from '../services/api/axiosConfig';

const WarRoom = () => {
    const { t } = useTranslation();
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [stats, setStats] = useState({
        totalAssets: 0,
        activeCritical: 0,
        globalHealth: 0,
        activeSites: 0
    });
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([
        { id: 1, time: '02:14:05', origin: 'CLUSTER_ALPHA', msg: 'Neural Link Synchronized', status: 'optimal' },
        { id: 2, time: '02:15:22', origin: 'CLUSTER_BETA', msg: 'IoT Gateway Pulse Detected', status: 'optimal' },
        { id: 3, time: '02:16:47', origin: 'REGION_APAC', msg: 'Latency Spikes: Node 404', status: 'caution' },
        { id: 4, time: '02:18:10', origin: 'HQ_CORE', msg: 'Deep AI Forensics Active', status: 'optimal' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sitesRes, statsRes] = await Promise.all([
                    api.get('/sites'),
                    api.get('/sites/war-room')
                ]);

                if (sitesRes.data.success) {
                    setFacilities(sitesRes.data.data);
                    if (sitesRes.data.data.length > 0) setSelectedFacility(sitesRes.data.data[0]);
                }

                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
            } catch (err) {
                console.error("GIS Synchronization Terminal Failure:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        
        // Simulating live log updates
        const interval = setInterval(() => {
            const newLog = {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                origin: ['NODE_NORTH', 'NODE_SOUTH', 'CORE'][Math.floor(Math.random() * 3)],
                msg: ['Diagnostic Ping Successful', 'Cluster Load Balanced', 'Encrypted Handshake Complete'][Math.floor(Math.random() * 3)],
                status: 'optimal'
            };
            setLogs(prev => [newLog, ...prev.slice(0, 5)]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">{t('warRoom.initializing')}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 -m-8 p-8 text-white font-sans selection:bg-yellow-400 selection:text-slate-950">
            {/* Header Matrix */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b border-white/5 pb-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.2)] animate-pulse">
                        <Radio className="text-slate-950 w-10 h-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/5 rounded-full">{t('warRoom.secureDeepLink')}</span>
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">{t('global.warRoomTitle')}</h1>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.5em] mt-2">{t('warRoom.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-xl">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('warRoom.globalHealth')}</p>
                        <div className="flex items-center gap-4 text-3xl font-black italic">
                            <Activity className={stats.activeCritical > 0 ? "text-rose-400" : "text-emerald-400"} />
                            {stats.globalHealth}%
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-xl">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('warRoom.activeClusters')}</p>
                        <div className="flex items-center gap-4 text-3xl font-black italic">
                            <Layers className="text-yellow-400" />
                            {stats.activeSites}
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Visual Matrix Container (Left & Center) */}
                <div className="lg:col-span-3 space-y-8">
                    
                    {/* Main Command Map */}
                    <div className="relative h-[600px] bg-slate-900/50 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_80%)]"></div>
                        
                        {/* Interactive UI Overlays */}
                        <div className="absolute top-10 left-10 z-10 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-xl">
                                <Crosshair className="text-yellow-400" size={20} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t('warRoom.trackingMode')}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-10 right-10 z-10 flex gap-4">
                             <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-yellow-400 hover:text-slate-900 transition-all text-white active:scale-95"><Maximize2 size={20}/></button>
                             <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/20 transition-all text-white active:scale-95"><Cpu size={20}/></button>
                        </div>

                        {/* Map Cluster Nodes */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full p-20">
                                {facilities.map(facility => (
                                    <div 
                                        key={facility.id}
                                        style={{ left: facility.x, top: facility.y }}
                                        onClick={() => setSelectedFacility(facility)}
                                        className="absolute cursor-pointer group"
                                    >
                                        <div className="relative">
                                            {/* Glowing Pulse */}
                                            <div className={`absolute -inset-8 rounded-full opacity-20 animate-ping delay-75 ${
                                                facility.status === 'optimal' ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}></div>
                                            
                                            {/* Node Core */}
                                            <div className={`w-6 h-6 rounded-full border-4 border-slate-950 shadow-2xl transition-all duration-500 group-hover:scale-150 ${
                                                selectedFacility?.id === facility.id ? 'scale-150 ring-4 ring-yellow-400/50' : ''
                                            } ${
                                                facility.status === 'optimal' ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}></div>

                                            {/* Label on Hover */}
                                            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all bg-slate-950 border border-white/10 px-4 py-2 rounded-xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white">{facility.name}</p>
                                                <p className="text-[8px] text-slate-500 font-bold uppercase">{Math.round(facility.health)}% {t('warRoom.operational')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Neural Interlink Lines (SVG) */}
                                <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-20">
                                    {selectedFacility && facilities.slice(1).map((f, i) => (
                                        <line 
                                            key={i}
                                            x1={selectedFacility.x} y1={selectedFacility.y}
                                            x2={f.x} y2={f.y}
                                            stroke="white" strokeWidth="0.5" strokeDasharray="5,5"
                                            className="animate-pulse"
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Matrix (Bottom Section) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] space-y-6">
                            <div className="flex items-center gap-4">
                                <Shield className="text-indigo-400" size={24} />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white">{t('warRoom.neuralFirewall')}</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>{t('warRoom.encryptedFlux')}</span>
                                    <span className="text-emerald-400">{t('warRoom.secure')}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-indigo-500 w-[85%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] space-y-6">
                            <div className="flex items-center gap-4">
                                <Server className="text-amber-400" size={24} />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white">{t('warRoom.edgeProcessing')}</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>{t('warRoom.computeLoad')}</span>
                                    <span>{t('roadmap.42_1_tflops', '42.1 TFLOPs')}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-amber-500 w-[60%] animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] space-y-6">
                            <div className="flex items-center gap-4">
                                <Database className="text-emerald-400" size={24} />
                                <h4 className="text-sm font-black uppercase tracking-widest text-white">{t('warRoom.forensicStorage')}</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>{t('warRoom.immutableDB')}</span>
                                    <span>{t('warRoom.active')}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500 w-[98%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Command Sidebar (Right) */}
                <div className="space-y-8 h-full">
                    
                    {/* Node Details (Dynamic) */}
                    {selectedFacility && (
                        <div className="bg-slate-900 p-10 rounded-[4rem] border border-white/10 shadow-3xl space-y-10 animate-fade-in">
                            <div className="space-y-4 text-center">
                                <div className="w-20 h-20 bg-slate-800 rounded-3xl mx-auto flex items-center justify-center border border-white/10 shadow-inner group">
                                     <Globe className="text-yellow-400 group-hover:rotate-180 transition-transform duration-1000" size={40} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic">{selectedFacility.city}</h3>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">{selectedFacility.name}</p>
                                </div>
                            </div>

                            <div className="space-y-8 pt-8 border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">{t('warRoom.nodeSync')}</span>
                                        <span className="text-emerald-400">{t('warRoom.optimal')}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className={`h-1.5 rounded-full ${i < 7 ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex flex-col items-center">
                                         <span className="text-white font-black text-xl italic">{selectedFacility.assetCount}</span>
                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t('warRoom.digitalTwins')}</span>
                                    </div>
                                    <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex flex-col items-center">
                                         <span className="text-white font-black text-xl italic">{Math.round(selectedFacility.health)}%</span>
                                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t('warRoom.integrity')}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full h-20 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-[2rem] font-black uppercase tracking-widest italic transition-all active:scale-95 shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                                {t('warRoom.initializeUplink')}
                            </button>
                        </div>
                    )}

                    {/* Forensic Event Log (Static/Simulated) */}
                    <div className="bg-slate-900 p-8 rounded-[3.5rem] border border-white/5 space-y-6">
                        <div className="flex items-center gap-4">
                             <Terminal className="text-yellow-400" size={20} />
                             <h4 className="text-xs font-black uppercase tracking-widest text-white">{t('warRoom.forensicFeed')}</h4>
                        </div>
                        <div className="space-y-6">
                            {logs.map(log => (
                                <div key={log.id} className="group cursor-pointer">
                                    <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase mb-1">
                                        <span>{log.time}</span>
                                        <span>{log.origin}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                        <p className="text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors uppercase truncate">{log.msg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarRoom;
