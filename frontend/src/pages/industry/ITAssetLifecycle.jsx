import { Laptop, Server, Network, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ITAssetLifecycle = () => {
    const { t } = useTranslation();

    const assets = [
        { id: 'SVR-MAIN', type: 'Core Router', location: 'Data Center A', status: 'optimal', uptime: '99.99%', nextMaintenance: '2026-11-01' },
        { id: 'LAP-LIB-01', type: 'Student Lab PC', location: 'Main Library', status: 'maintenance', uptime: 'N/A', nextMaintenance: 'Overdue' },
        { id: 'PROJ-LEC1', type: 'Smart Projector', location: 'Lecture Hall 1', status: 'warning', uptime: '94.2%', nextMaintenance: '2026-06-20' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-indigo-950 p-10 rounded-[3rem] text-indigo-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-indigo-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <Server size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.itassetlifecycle.it_asset_lifecycle_1", "IT Asset Lifecycle")}</h1>
                        <p className="text-indigo-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.itassetlifecycle.campus_hardware_network_infrastructure_2", "Campus Hardware & Network Infrastructure")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">12,450</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.itassetlifecycle.managed_endpoints_3", "Managed Endpoints")}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Laptop size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">99.8%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.itassetlifecycle.core_network_uptime_4", "Core Network Uptime")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Network size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">14</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.itassetlifecycle.critical_hardware_alerts_5", "Critical Hardware Alerts")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertCircle size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.itassetlifecycle.hardware_diagnostics_6", "Hardware Diagnostics")}</h3>
                <div className="space-y-4">
                    {assets.map((asset, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${asset.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : asset.status === 'maintenance' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {asset.type.includes('Router') ? <Network size={20} /> : <Laptop size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{asset.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{asset.location} • {asset.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.itassetlifecycle.uptime_sla_7", "Uptime SLA")}</p>
                                    <p className={`font-black text-xs uppercase ${asset.status === 'maintenance' ? 'text-rose-600' : 'text-slate-900'}`}>{asset.uptime}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.itassetlifecycle.next_maintenance_8", "Next Maintenance")}</p>
                                    <p className={`font-black text-xs uppercase ${asset.nextMaintenance === 'Overdue' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{asset.nextMaintenance}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ITAssetLifecycle;
