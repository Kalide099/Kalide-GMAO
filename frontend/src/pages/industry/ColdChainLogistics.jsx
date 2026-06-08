import { ThermometerSnowflake, Truck, AlertTriangle, Snowflake, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ColdChainLogistics = () => {
    const { t } = useTranslation();

    const shipments = [
        { id: 'FRT-992', load: 'Frozen Poultry', temp: '-18.2°C', target: '-18°C', status: 'optimal', eta: '4 Hrs' },
        { id: 'FRT-104', load: 'Fresh Produce', temp: '4.8°C', target: '2.0°C', status: 'warning', eta: '1 Hr' },
        { id: 'FRT-885', load: 'Dairy Output', temp: '8.4°C', target: '3.0°C', status: 'critical', eta: 'Delayed' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-cyan-950 p-10 rounded-[3rem] text-cyan-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-cyan-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                        <ThermometerSnowflake size={32} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.coldchainlogistics.cold_chain_tracker_1", "Cold Chain Tracker")}</h1>
                        <p className="text-cyan-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.coldchainlogistics.agribusiness_refrigerated_transport_2", "Agribusiness Refrigerated Transport")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">142</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.coldchainlogistics.active_reefer_trucks_3", "Active Reefer Trucks")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Truck size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.coldchainlogistics.temp_breach_alert_4", "Temp Breach Alert")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertTriangle size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">99.1%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.coldchainlogistics.spoilage_prevention_5", "Spoilage Prevention")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><ShieldCheck size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.coldchainlogistics.active_shipments_6", "Active Shipments")}</h3>
                <div className="space-y-4">
                    {shipments.map((shipment, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-cyan-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${shipment.status === 'optimal' ? 'bg-cyan-50 text-cyan-600' : shipment.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <Snowflake size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{shipment.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{shipment.load}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.coldchainlogistics.target_temp_7", "Target Temp")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{shipment.target}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.coldchainlogistics.live_temp_8", "Live Temp")}</p>
                                    <p className={`font-black text-xs uppercase ${shipment.status === 'critical' ? 'text-rose-600 animate-pulse' : shipment.status === 'warning' ? 'text-amber-600' : 'text-cyan-600'}`}>{shipment.temp}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.coldchainlogistics.eta_9", "ETA")}</p>
                                    <p className={`font-black text-xs uppercase ${shipment.eta === 'Delayed' ? 'text-rose-600' : 'text-slate-900'}`}>{shipment.eta}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColdChainLogistics;
