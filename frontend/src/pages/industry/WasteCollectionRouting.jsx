import { Route, Truck, Trash2, AlertCircle, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WasteCollectionRouting = () => {
    const { t } = useTranslation();

    const fleets = [
        { id: 'TRK-990', zone: 'North Sector', capacity: '92%', status: 'routing', eta: 'On Time' },
        { id: 'TRK-412', zone: 'Downtown', capacity: '100%', status: 'critical', eta: 'Heading to Dump' },
        { id: 'TRK-881', zone: 'East Suburbs', capacity: '45%', status: 'routing', eta: 'Delayed (Traffic)' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-sky-950 p-10 rounded-[3rem] text-sky-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-sky-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30">
                        <Route size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.wastecollectionrouting.waste_collection_fleet_1", "Waste Collection Fleet")}</h1>
                        <p className="text-sky-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.wastecollectionrouting.dynamic_routing_bin_telemetry_2", "Dynamic Routing & Bin Telemetry")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">24</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.wastecollectionrouting.active_trucks_3", "Active Trucks")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Truck size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">18%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Fuel Saved (AI Route)</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Leaf size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">2</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.wastecollectionrouting.full_capacity_alerts_4", "Full Capacity Alerts")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertCircle size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.wastecollectionrouting.fleet_routing_status_5", "Fleet Routing Status")}</h3>
                <div className="space-y-4">
                    {fleets.map((fleet, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-sky-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fleet.status === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{fleet.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fleet.zone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.wastecollectionrouting.capacity_6", "Capacity")}</p>
                                    <p className={`font-black text-xs uppercase ${fleet.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{fleet.capacity}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.wastecollectionrouting.route_status_7", "Route Status")}</p>
                                    <p className={`font-black text-xs uppercase ${fleet.eta.includes('Delay') ? 'text-amber-600' : 'text-emerald-600'}`}>{fleet.eta}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WasteCollectionRouting;
