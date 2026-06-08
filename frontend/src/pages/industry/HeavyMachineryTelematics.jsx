import { Tractor, Fuel, AlertOctagon, LocateFixed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HeavyMachineryTelematics = () => {
    const { t } = useTranslation();

    const machinery = [
        { id: 'DOZER-D9', type: 'Bulldozer', operator: 'John M.', fuel: '45%', hours: '12,450', status: 'optimal' },
        { id: 'CRANE-T4', type: 'Tower Crane', operator: 'Sarah K.', fuel: '20%', hours: '8,120', status: 'warning' },
        { id: 'EXCAV-320', type: 'Excavator', operator: 'Unassigned', fuel: '0%', hours: '14,200', status: 'critical' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-orange-950 p-10 rounded-[3rem] text-orange-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-orange-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                        <Tractor size={32} className="text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.heavymachinerytelematics.machinery_telematics_1", "Machinery Telematics")}</h1>
                        <p className="text-orange-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.heavymachinerytelematics.heavy_equipment_gps_diagnostics_2", "Heavy Equipment GPS & Diagnostics")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">42</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.heavymachinerytelematics.active_machinery_3", "Active Machinery")}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Tractor size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-amber-600 tracking-tighter">{t("generated.pages.industry.heavymachinerytelematics.8_4l_h_4", "8.4L/h")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.heavymachinerytelematics.avg_fuel_burn_rate_5", "Avg Fuel Burn Rate")}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Fuel size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.heavymachinerytelematics.geo_fence_breach_6", "Geo-Fence Breach")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertOctagon size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.heavymachinerytelematics.fleet_diagnostics_7", "Fleet Diagnostics")}</h3>
                <div className="space-y-4">
                    {machinery.map((mach, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-orange-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mach.status === 'optimal' ? 'bg-orange-50 text-orange-600' : mach.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <LocateFixed size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{mach.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{mach.type} • {mach.operator}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.heavymachinerytelematics.fuel_8", "Fuel")}</p>
                                    <p className={`font-black text-xs uppercase ${mach.status === 'warning' ? 'text-amber-600' : 'text-slate-900'}`}>{mach.fuel}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.heavymachinerytelematics.engine_hrs_9", "Engine Hrs")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{mach.hours}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.heavymachinerytelematics.status_10", "Status")}</p>
                                    <p className={`font-black text-xs uppercase ${mach.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                                        {mach.status === 'critical' ? 'Geo-Breach' : 'Secure'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeavyMachineryTelematics;
