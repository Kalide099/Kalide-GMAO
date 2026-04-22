import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Boxes, Zap, Thermometer, ShieldCheck, Play, Save, History, Layout, Cpu } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const DigitalTwin = () => {
    const { t } = useTranslation();
    const [activeAsset, setActiveAsset] = useState({ name: 'Turbine-Omega-04', status: 'Optimal' });
    const [simulationMode, setSimulationMode] = useState(false);
    const [load, setLoad] = useState(74);

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.twin.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.twin.subtitle')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setSimulationMode(!simulationMode)}
                        className={`px-10 py-5 rounded-[2rem] font-black text-[10px] tracking-widest flex items-center gap-4 transition-all shadow-xl ${
                            simulationMode ? 'bg-rose-900 text-white shadow-rose-900/20' : 'bg-slate-900 text-white'
                        }`}
                    >
                        <Play size={18} className={simulationMode ? 'animate-pulse' : ''} />
                        {simulationMode ? t('roadmap.twin.exitSim') : t('roadmap.twin.enterSim')}
                    </button>
                    <button className="p-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:bg-slate-50 transition-all">
                        <Save size={24} className="text-slate-900" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 3D Viewer Scaffolding */}
                <div className="lg:col-span-2 bg-slate-900 rounded-[4rem] h-[600px] relative overflow-hidden shadow-2xl group border-l-8 border-indigo-500">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                    
                    {/* Simulated 3D Asset Center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <Boxes size={240} className={`text-white transition-all duration-1000 ${simulationMode ? 'animate-spin scale-110 text-yellow-400 shadow-[0_0_100px_rgba(250,204,21,0.2)]' : 'text-slate-700'}`} />
                            <div className="absolute -top-10 -right-10 bg-indigo-600 p-6 rounded-3xl shadow-2xl">
                                <Cpu className="text-white animate-pulse" size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Telemetry Overlays */}
                    <div className="absolute bottom-12 left-12 grid grid-cols-2 gap-6">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
                            <p className="text-[9px] font-black text-slate-400 tracking-widest leading-none">{t('roadmap.twin.rotationSpeed')}</p>
                            <p className="text-2xl font-black text-white mt-2 italic">{t('roadmap.14_240_rpm', '14,240 RPM')}</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
                            <p className="text-[9px] font-black text-slate-400 tracking-widest leading-none">{t('roadmap.twin.internalTemp')}</p>
                            <p className="text-2xl font-black text-white mt-2 italic">{t('roadmap.74_2_c', '74.2 °C')}</p>
                        </div>
                    </div>

                    <div className="absolute top-12 right-12 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 px-6 py-3 rounded-full flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500" size={16} />
                        <span className="text-[10px] font-black text-emerald-500 tracking-widest">{t('roadmap.twin.liveSyncActive')}</span>
                    </div>
                </div>

                {/* Simulation Control Hub */}
                <div className="space-y-8">
                    <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                        <h3 className="text-2xl font-black text-slate-900 italic">{t('roadmap.twin.coreParams')}</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase italic">{t('roadmap.twin.opLoad')}</span>
                                    <span className="text-lg font-black text-slate-900">{load}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    value={load}
                                    onChange={(e) => setLoad(e.target.value)}
                                    className="w-full accent-indigo-600 h-2 bg-slate-50 rounded-full" 
                                />
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Thermometer className="text-orange-600" size={24} />
                                    <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase leading-none">{t('roadmap.twin.thermalImpact')}</span>
                                </div>
                                <span className={`text-xl font-black italic ${load > 90 ? 'text-rose-600' : 'text-slate-900'}`}>
                                    {load > 90 ? t('roadmap.twin.critical') : t('roadmap.twin.safe')}
                                </span>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-slate-50">
                            <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-6 flex items-center gap-3">
                                <History size={14} /> {t('roadmap.twin.snapshots')}
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { date: '2026-04-10', state: t('roadmap.twin.preFailure') },
                                    { date: '2026-03-24', state: t('roadmap.twin.baseLine') }
                                ].map((snap, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer">
                                        <span className="text-[10px] font-black text-slate-900">{snap.date}</span>
                                        <span className="text-[9px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full uppercase">{snap.state}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalTwin;
