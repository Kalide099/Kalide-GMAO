import { Bot, Radio, AlertOctagon, Navigation2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WarehouseRoboticsManager = () => {
    const { t } = useTranslation();

    const robots = [
        { id: 'AGV-04', role: 'Pallet Jack', zone: 'Aisle 4', battery: '82%', status: 'optimal', load: 'Loaded' },
        { id: 'AGV-12', role: 'Picker', zone: 'Aisle 1', battery: '15%', status: 'warning', load: 'Charging' },
        { id: 'AGV-09', role: 'Sorter', zone: 'Dock B', battery: '68%', status: 'critical', load: 'Collision Alert' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-purple-950 p-10 rounded-[3rem] text-purple-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-purple-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                        <Bot size={32} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.warehouseroboticsmanager.agv_robotics_manager_1", "AGV Robotics Manager")}</h1>
                        <p className="text-purple-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.warehouseroboticsmanager.autonomous_fleet_telemetry_2", "Autonomous Fleet Telemetry")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">24</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.warehouseroboticsmanager.active_agvs_3", "Active AGVs")}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Bot size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">98.5%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.warehouseroboticsmanager.routing_efficiency_4", "Routing Efficiency")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Navigation2 size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.warehouseroboticsmanager.collision_alert_5", "Collision Alert")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertOctagon size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.warehouseroboticsmanager.fleet_status_6", "Fleet Status")}</h3>
                <div className="space-y-4">
                    {robots.map((bot, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-purple-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bot.status === 'optimal' ? 'bg-purple-50 text-purple-600' : bot.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <Radio size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{bot.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{bot.role} • {bot.zone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.warehouseroboticsmanager.battery_7", "Battery")}</p>
                                    <p className={`font-black text-xs uppercase ${bot.status === 'warning' ? 'text-amber-600' : 'text-slate-900'}`}>{bot.battery}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.warehouseroboticsmanager.status_8", "Status")}</p>
                                    <p className={`font-black text-xs uppercase ${bot.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>{bot.load}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WarehouseRoboticsManager;
