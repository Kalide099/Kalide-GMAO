import { ShoppingCart, Zap, TrendingUp, MonitorSmartphone, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StoreLayoutOptimization = () => {
    const { t } = useTranslation();

    const stores = [
        { id: 'STR-NY01', location: 'Fifth Ave', posStatus: '100%', footTraffic: '+14%', energy: 'optimal' },
        { id: 'STR-LA04', location: 'Melrose', posStatus: '92%', footTraffic: '-2%', energy: 'warning' },
        { id: 'STR-TX09', location: 'Domain', posStatus: '100%', footTraffic: '+5%', energy: 'optimal' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-fuchsia-950 p-10 rounded-[3rem] text-fuchsia-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 left-0 w-64 h-64 bg-fuchsia-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-fuchsia-500/20 rounded-2xl flex items-center justify-center border border-fuchsia-500/30">
                        <ShoppingCart size={32} className="text-fuchsia-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.storelayoutoptimization.retail_operations_1", "Retail Operations")}</h1>
                        <p className="text-fuchsia-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.storelayoutoptimization.pos_uptime_layout_optimization_2", "POS Uptime & Layout Optimization")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">99.8%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.storelayoutoptimization.global_pos_uptime_3", "Global POS Uptime")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><MonitorSmartphone size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">+8.4%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.storelayoutoptimization.foot_traffic_impact_4", "Foot Traffic Impact")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><TrendingUp size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-fuchsia-600 tracking-tighter">{t("generated.pages.industry.storelayoutoptimization.1_2kw_5", "1.2kW")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">HVAC Waste (LA04)</p>
                    </div>
                    <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Zap size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.storelayoutoptimization.store_performance_matrix_6", "Store Performance Matrix")}</h3>
                <div className="space-y-4">
                    {stores.map((store, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-fuchsia-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${store.energy === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <Map size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{store.location}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{store.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.storelayoutoptimization.pos_7", "POS")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{store.posStatus}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.storelayoutoptimization.traffic_8", "Traffic")}</p>
                                    <p className={`font-black text-xs uppercase ${store.footTraffic.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{store.footTraffic}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreLayoutOptimization;
