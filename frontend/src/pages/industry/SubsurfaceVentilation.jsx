import { Wind, HardHat, Pickaxe, AlertTriangle, Fan } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SubsurfaceVentilation = () => {
    const { t } = useTranslation();

    const shafts = [
        { id: 'SHAFT-1', depth: '1.2km', airQuality: '98%', fanStatus: 'optimal', gasLevel: '0.01%' },
        { id: 'SHAFT-2', depth: '2.4km', airQuality: '85%', fanStatus: 'warning', gasLevel: '0.04%' },
        { id: 'SHAFT-3', depth: '3.1km', airQuality: '99%', fanStatus: 'optimal', gasLevel: '0.00%' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-stone-950 p-10 rounded-[3rem] text-stone-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center border border-stone-700 shadow-inner">
                        <Pickaxe size={32} className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.subsurfaceventilation.subsurface_mining_operations_1", "Subsurface Mining Operations")}</h1>
                        <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.subsurfaceventilation.ventilation_gas_telemetry_2", "Ventilation & Gas Telemetry")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">94%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.subsurfaceventilation.global_air_quality_3", "Global Air Quality")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Wind size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-amber-600 tracking-tighter">0.04%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Peak Gas (Shaft 2)</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertTriangle size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">24/24</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.subsurfaceventilation.main_fans_active_4", "Main Fans Active")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Fan size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.subsurfaceventilation.deep_shaft_diagnostics_5", "Deep Shaft Diagnostics")}</h3>
                <div className="space-y-4">
                    {shafts.map((shaft, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-amber-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${shaft.fanStatus === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <HardHat size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{shaft.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Depth: {shaft.depth}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.subsurfaceventilation.air_quality_6", "Air Quality")}</p>
                                    <p className={`font-black text-xs uppercase ${shaft.fanStatus === 'optimal' ? 'text-emerald-600' : 'text-amber-600'}`}>{shaft.airQuality}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.subsurfaceventilation.toxic_gas_7", "Toxic Gas")}</p>
                                    <p className={`font-black text-xs uppercase ${shaft.gasLevel !== '0.00%' ? 'text-rose-600' : 'text-emerald-600'}`}>{shaft.gasLevel}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubsurfaceVentilation;
