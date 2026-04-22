import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Activity, Fuel, Gauge, Share2, ClipboardList, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const FleetTelematics = () => {
    const { t } = useTranslation();
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFleet = async () => {
            try {
                const res = await api.get('/gis/fleet');
                if (res.data.success) setFleet(res.data.data);
            } catch (e) {
                console.error("Telematics Sync Failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFleet();
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 italic animate-pulse tracking-widest uppercase italic">{t('roadmap.streaming_telemetry_da', 'Streaming Telemetry Data...')}</div>;

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">{t('roadmap.gis.telematics')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-amber-500 rounded-full"></span>
                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('roadmap.fleet_oversight', 'Fleet Oversight Matrix')}</p>
                    </div>
                </div>
                <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <ShieldCheck size={14} /> {t('roadmap.all_systems_nominal', 'All Systems Nominal')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {fleet.map((asset, i) => (
                            <div key={i} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${asset.status === 'active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                </div>
                                
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                                        <Truck size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{asset.asset_name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {asset.asset_id.split('-')[0]}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.gis.fuel')}</span>
                                            <span className="text-slate-900 font-black italic">{asset.fuel_level_percent}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${asset.fuel_level_percent}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.gis.odometer')}</span>
                                        </div>
                                        <p className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <Gauge className="text-indigo-600" size={18} /> {asset.odometer_km} <span className="text-[10px] uppercase tracking-widest text-slate-400 not-italic">{t('common.km', 'km')}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                            <Activity size={14} className="text-slate-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">{t('roadmap.transmission_nominal', 'Transmission Nominal')}</span>
                                    </div>
                                    <button className="p-3 hover:bg-slate-950 hover:text-white rounded-xl transition-all text-slate-400">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
                        <ClipboardList className="text-indigo-400 mb-6" size={40} />
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{t('roadmap.fleet_summary', 'Fleet Summary')}</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('roadmap.total_units', 'Total Units')}</span>
                                <span className="text-2xl font-black italic">{fleet.length}</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('roadmap.avg_fuel', 'Avg Fuel')}</span>
                                <span className="text-2xl font-black italic">
                                    {Math.round(fleet.reduce((acc, curr) => acc + curr.fuel_level_percent, 0) / (fleet.length || 1))}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('roadmap.incidents_24h', 'Incidents (24h)')}</span>
                                <span className="text-2xl font-black italic text-rose-500">0</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 text-amber-600">
                            <AlertTriangle size={24} />
                            <h4 className="font-black uppercase tracking-widest text-[10px]">{t('roadmap.optimization_alerts', 'Optimization Alerts')}</h4>
                        </div>
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                            <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest leading-relaxed">
                                {t('roadmap.fleet_alert_msg', 'Unit HF-882 suggests preventive oil analysis in 450km based on vibration flux.')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetTelematics;
