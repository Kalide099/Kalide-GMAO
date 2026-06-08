import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, TrendingUp, Sun, CloudRain, AlertTriangle, Layers } from 'lucide-react';

const CropYieldTracking = () => {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState('wheat');

    const crops = [
        { id: 'wheat', name: 'Winter Wheat', status: 'optimal', yieldEst: '4.2', moisture: '68%', health: 94 },
        { id: 'corn', name: 'Sweet Corn', status: 'caution', yieldEst: '8.5', moisture: '45%', health: 72 },
        { id: 'soy', name: 'Soybeans', status: 'optimal', yieldEst: '3.1', moisture: '62%', health: 88 }
    ];

    const currentCrop = crops.find(c => c.id === selectedCrop);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950 p-8 rounded-[3rem] text-emerald-50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Sprout size={32} className="text-emerald-950" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t('nav.industry.cropYield') || 'Crop Yield Analytics'}</h1>
                        <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mt-1">{t("generated.pages.industry.cropyieldtracking.agrifood_enterprise_suite_1", "Agrifood Enterprise Suite")}</p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <select 
                        value={selectedCrop}
                        onChange={(e) => setSelectedCrop(e.target.value)}
                        className="bg-emerald-900 border border-emerald-800 text-emerald-50 font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl appearance-none cursor-pointer hover:bg-emerald-800 transition-colors focus:ring-4 focus:ring-emerald-500/30 outline-none"
                    >
                        {crops.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.cropyieldtracking.est_yield_2", "Est. Yield")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{currentCrop.yieldEst}</h3>
                        <span className="text-sm font-bold text-slate-500 uppercase">{t("generated.pages.industry.cropyieldtracking.tons_ha_3", "Tons/Ha")}</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                            <CloudRain size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.cropyieldtracking.soil_moisture_4", "Soil Moisture")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{currentCrop.moisture}</h3>
                        <span className="text-sm font-bold text-slate-500 uppercase">{t("generated.pages.industry.cropyieldtracking.avg_5", "Avg")}</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform ${currentCrop.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {currentCrop.status === 'optimal' ? <Sprout size={24} /> : <AlertTriangle size={24} />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.cropyieldtracking.crop_health_6", "Crop Health")}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{currentCrop.health}%</h3>
                        <span className={`text-sm font-bold uppercase ${currentCrop.status === 'optimal' ? 'text-emerald-500' : 'text-amber-500'}`}>{currentCrop.status}</span>
                    </div>
                </div>
                
                <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 rounded-full blur-[40px] opacity-20"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-white/10 text-yellow-400 border border-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                            <Sun size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{t("generated.pages.industry.cropyieldtracking.climate_gdd_7", "Climate GDD")}</span>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h3 className="text-4xl font-black tracking-tighter text-white">1,420</h3>
                        <span className="text-sm font-bold text-white/50 uppercase">{t("generated.pages.industry.cropyieldtracking.deg_days_8", "Deg Days")}</span>
                    </div>
                </div>
            </div>

            {/* Predictive Chart & Fields Mapping */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{t("generated.pages.industry.cropyieldtracking.growth_trajectory_9", "Growth Trajectory")}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t("generated.pages.industry.cropyieldtracking.ai_predicted_vs_actual_biomass_10", "AI Predicted vs Actual Biomass")}</p>
                        </div>
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{t("generated.pages.industry.cropyieldtracking.model_98_confidence_11", "Model: 98% Confidence")}</div>
                    </div>
                    
                    {/* Simulated Chart */}
                    <div className="h-64 relative w-full border-b border-l border-slate-100">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between opacity-50">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-slate-100"></div>)}
                        </div>
                        
                        {/* Actual Data Area */}
                        <div className="absolute bottom-0 left-0 w-2/3 h-full overflow-hidden flex items-end">
                            <div className="w-full h-[60%] bg-gradient-to-t from-emerald-500/20 to-transparent absolute bottom-0"></div>
                            <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0,100 L0,80 Q20,70 40,50 T100,20 L100,100 Z" fill="none" stroke="#10b981" strokeWidth="2" />
                            </svg>
                        </div>
                        
                        {/* AI Predicted Data */}
                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                            <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0,80 Q20,70 40,50 T100,10" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                            </svg>
                        </div>

                        {/* Current Marker */}
                        <div className="absolute bottom-[50%] left-[66%] -translate-x-1/2 translate-y-1/2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest whitespace-nowrap">{t("generated.pages.industry.cropyieldtracking.today_12", "Today")}</div>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{t("generated.pages.industry.cropyieldtracking.planting_13", "Planting")}</span>
                        <span>{t("generated.pages.industry.cropyieldtracking.vegetative_14", "Vegetative")}</span>
                        <span>{t("generated.pages.industry.cropyieldtracking.flowering_15", "Flowering")}</span>
                        <span>{t("generated.pages.industry.cropyieldtracking.harvest_16", "Harvest")}</span>
                    </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
                    <div className="flex items-center gap-3 mb-8">
                        <Layers className="text-slate-400" />
                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{t("generated.pages.industry.cropyieldtracking.active_sectors_17", "Active Sectors")}</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: 'Sector Alpha', area: '120 Ha', status: 'optimal', progress: 85 },
                            { name: 'Sector Beta', area: '85 Ha', status: 'caution', progress: 45 },
                            { name: 'Sector Gamma', area: '200 Ha', status: 'optimal', progress: 60 }
                        ].map((sector, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase">{sector.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sector.area}</p>
                                    </div>
                                    <span className={`w-2 h-2 rounded-full ${sector.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${sector.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${sector.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => window.location.assign('/app/predictive')} className="w-full mt-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">{t("generated.pages.industry.cropyieldtracking.view_field_map_18", "View Field Map")}</button>
                </div>
            </div>
        </div>
    );
};

export default CropYieldTracking;
