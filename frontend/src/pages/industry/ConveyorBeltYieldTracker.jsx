import { Activity, Combine, TrendingUp, AlertOctagon, Cog } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ConveyorBeltYieldTracker = () => {
    const { t } = useTranslation();

    const belts = [
        { id: 'BELT-MAIN', length: '4.2km', tonnage: '14,200 T/day', vibration: 'Normal', status: 'optimal' },
        { id: 'BELT-EAST', length: '1.8km', tonnage: '4,100 T/day', vibration: 'High (Motor 4)', status: 'critical' },
        { id: 'BELT-WEST', length: '2.1km', tonnage: '8,500 T/day', vibration: 'Elevated', status: 'warning' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-stone-900 p-10 rounded-[3rem] text-stone-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-stone-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center border border-stone-700">
                        <Combine size={32} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.conveyorbeltyieldtracker.excavation_conveyor_yield_1", "Excavation & Conveyor Yield")}</h1>
                        <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.conveyorbeltyieldtracker.belt_vibration_tonnage_tracking_2", "Belt Vibration & Tonnage Tracking")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.conveyorbeltyieldtracker.26_8k_3", "26.8k")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.conveyorbeltyieldtracker.daily_tonnage_yield_4", "Daily Tonnage Yield")}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><TrendingUp size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.conveyorbeltyieldtracker.motor_vibration_alert_5", "Motor Vibration Alert")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertOctagon size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">98.1%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.conveyorbeltyieldtracker.conveyor_uptime_6", "Conveyor Uptime")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Cog size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.conveyorbeltyieldtracker.belt_diagnostics_7", "Belt Diagnostics")}</h3>
                <div className="space-y-4">
                    {belts.map((belt, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-stone-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${belt.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : belt.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{belt.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Length: {belt.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.conveyorbeltyieldtracker.live_yield_8", "Live Yield")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{belt.tonnage}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.conveyorbeltyieldtracker.vibration_sensor_9", "Vibration Sensor")}</p>
                                    <p className={`font-black text-xs uppercase ${belt.status === 'critical' ? 'text-rose-600 animate-pulse' : belt.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>{belt.vibration}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConveyorBeltYieldTracker;
