import { Bed, Clock, AlertCircle, Sparkles, Thermometer } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HousekeepingSLA = () => {
    const { t } = useTranslation();

    const tasks = [
        { id: 'RM-402', type: 'Turnaround', priority: 'High', sla: '15 mins', status: 'delayed', maid: 'Team Alpha' },
        { id: 'RM-510', type: 'Deep Clean', priority: 'Medium', sla: '45 mins', status: 'on-time', maid: 'Team Beta' },
        { id: 'KITCHEN-1', type: 'Refrigeration IoT', priority: 'Critical', sla: 'Immediate', status: 'warning', temp: '4.5°C' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-amber-950 p-10 rounded-[3rem] text-amber-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
                        <Sparkles size={32} className="text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.housekeepingsla.hotel_maintenance_1", "Hotel Maintenance")}</h1>
                        <p className="text-amber-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.housekeepingsla.housekeeping_equipment_sla_2", "Housekeeping & Equipment SLA")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.housekeepingsla.24m_3", "24m")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.housekeepingsla.avg_turnaround_4", "Avg Turnaround")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Clock size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">3</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.housekeepingsla.sla_breaches_5", "SLA Breaches")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertCircle size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">99.9%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.housekeepingsla.kitchen_temp_uptime_6", "Kitchen Temp Uptime")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Thermometer size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.housekeepingsla.active_service_board_7", "Active Service Board")}</h3>
                <div className="space-y-4">
                    {tasks.map((task, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-amber-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.status === 'delayed' || task.status === 'warning' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {task.type === 'Refrigeration IoT' ? <Thermometer size={20} /> : <Bed size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{task.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{task.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.housekeepingsla.time_remaining_8", "Time Remaining")}</p>
                                <p className={`font-black text-xs uppercase ${task.status === 'delayed' || task.status === 'warning' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{task.sla}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HousekeepingSLA;
