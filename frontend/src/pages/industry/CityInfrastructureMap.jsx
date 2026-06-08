import { Map, Lightbulb, Droplet, TrafficCone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CityInfrastructureMap = () => {
    const { t } = useTranslation();

    const works = [
        { id: 'ST-092', type: 'Streetlight Grid', zone: 'Downtown', status: 'optimal', lastMaintenance: '2 Days Ago' },
        { id: 'WT-004', type: 'Water Treatment', zone: 'North River', status: 'warning', lastMaintenance: '14 Days Ago' },
        { id: 'RD-POTH', type: 'Road Repair', zone: 'Highway 61', status: 'critical', lastMaintenance: 'Pending Dispatch' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-sky-950 p-10 rounded-[3rem] text-sky-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
                        <Map size={32} className="text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.cityinfrastructuremap.city_infrastructure_hub_1", "City Infrastructure Hub")}</h1>
                        <p className="text-sky-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.cityinfrastructuremap.public_works_grid_maintenance_2", "Public Works & Grid Maintenance")}</p>
                    </div>
                </div>
                <button onClick={() => window.location.assign('/app/map')} className="relative z-10 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]">{t("generated.pages.industry.cityinfrastructuremap.dispatch_unit_3", "Dispatch Unit")}</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">98.2%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.cityinfrastructuremap.grid_illumination_4", "Grid Illumination")}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Lightbulb size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.cityinfrastructuremap.optimal_5", "Optimal")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.cityinfrastructuremap.water_pressure_6", "Water Pressure")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Droplet size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">14</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.cityinfrastructuremap.pothole_reports_7", "Pothole Reports")}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><TrafficCone size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.cityinfrastructuremap.active_dispatches_8", "Active Dispatches")}</h3>
                <div className="space-y-4">
                    {works.map((work, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-sky-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${work.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : work.status === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {work.type.includes('Road') ? <TrafficCone size={20} /> : work.type.includes('Water') ? <Droplet size={20} /> : <Lightbulb size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{work.type}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{work.id} • {work.zone}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.cityinfrastructuremap.status_9", "Status")}</p>
                                <p className={`font-black text-xs uppercase ${work.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{work.lastMaintenance}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CityInfrastructureMap;
