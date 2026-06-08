import { Activity, Settings, Zap, Factory, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductionOEETracking = () => {
    const { t } = useTranslation();

    const lines = [
        { id: 'LINE-A', name: 'Assembly Alpha', oee: 88, availability: 92, performance: 95, quality: 100 },
        { id: 'LINE-B', name: 'Milling Beta', oee: 72, availability: 80, performance: 94, quality: 95 },
        { id: 'LINE-C', name: 'Packaging Gamma', oee: 94, availability: 98, performance: 98, quality: 98 }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-slate-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                        <Factory size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.productionoeetracking.production_oee_1", "Production OEE")}</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.productionoeetracking.overall_equipment_effectiveness_2", "Overall Equipment Effectiveness")}</p>
                    </div>
                </div>
                <div className="relative z-10 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
                    <Activity className="text-emerald-400" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.productionoeetracking.global_plant_oee_3", "Global Plant OEE")}</p>
                        <p className="text-2xl font-black text-white">84.6%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">90%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.productionoeetracking.avg_availability_4", "Avg Availability")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Settings size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">95%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.productionoeetracking.avg_performance_5", "Avg Performance")}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Zap size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">97%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.productionoeetracking.avg_quality_yield_6", "Avg Quality Yield")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><CheckCircle2 size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.productionoeetracking.line_metrics_7", "Line Metrics")}</h3>
                <div className="space-y-4">
                    {lines.map((line, i) => (
                        <div key={i} className="p-6 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${line.oee > 85 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{line.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{line.id}</p>
                                </div>
                            </div>
                            
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("generated.pages.industry.productionoeetracking.availability_8", "Availability")}</p>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${line.availability > 90 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${line.availability}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 mt-1">{line.availability}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("generated.pages.industry.productionoeetracking.performance_9", "Performance")}</p>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${line.performance}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 mt-1">{line.performance}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("generated.pages.industry.productionoeetracking.quality_10", "Quality")}</p>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${line.quality}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-600 mt-1">{line.quality}%</p>
                                </div>
                            </div>
                            
                            <div className="min-w-[100px] text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t("generated.pages.industry.productionoeetracking.oee_score_11", "OEE Score")}</p>
                                <p className={`text-2xl font-black ${line.oee > 85 ? 'text-emerald-600' : 'text-amber-600'}`}>{line.oee}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductionOEETracking;
