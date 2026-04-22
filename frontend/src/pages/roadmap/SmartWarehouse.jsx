import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, QrCode, ArrowRightLeft, AlertCircle, TrendingUp, MapPin, Truck, Plus } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const SmartWarehouse = () => {
    const { t } = useTranslation();
    const [data, setData] = useState({ locations: [], metrics: { total_items: 0, total_units: 0, active_bins: 0 } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/warehouse/overview');
                if (res.data.success) setData(res.data.data);
            } catch (e) {
                console.error("Warehouse Sync Failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 italic animate-pulse">{t('roadmap.warehouse.loading')}</div>;

    const { locations, metrics } = data;

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.warehouse.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-yellow-400 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.warehouse.subtitle')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] shadow-2xl shadow-slate-900/10 flex items-center gap-4 border border-slate-800 hover:scale-105 active:scale-95 transition-all">
                        <QrCode className="text-yellow-400 w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('roadmap.warehouse.scan')}</span>
                    </button>
                    <button className="p-5 bg-white border border-slate-100 rounded-[2rem] text-slate-900 shadow-sm hover:bg-slate-50 transition-all">
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-4">
                    <Package className="text-slate-900" size={32} />
                    <h3 className="text-sm font-black text-slate-400 tracking-widest leading-none">{t('roadmap.warehouse.total')}</h3>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">{metrics.total_items}</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase">
                        <TrendingUp size={14} /> {t('roadmap.warehouse.globalDist')}
                    </div>
                </div>
                <div className="bg-rose-900 p-12 rounded-[3.5rem] text-white space-y-4 shadow-2xl shadow-rose-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <AlertCircle size={120} />
                    </div>
                    <AlertCircle className="text-yellow-400" size={32} />
                    <h3 className="text-sm font-black text-rose-300 tracking-widest leading-none uppercase">{t('roadmap.warehouse.inTransit')}</h3>
                    <p className="text-5xl font-black tracking-tighter">{metrics.active_bins}</p>
                    <p className="text-rose-300 font-bold text-[10px] uppercase">{t('roadmap.warehouse.binUtilization')}</p>
                </div>
                <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white space-y-4 shadow-2xl shadow-slate-900/20">
                    <ArrowRightLeft className="text-yellow-400" size={32} />
                    <h3 className="text-sm font-black text-slate-400 tracking-widest leading-none uppercase">{t('roadmap.warehouse.totalQty')}</h3>
                    <p className="text-5xl font-black tracking-tighter">{metrics.total_units}</p>
                    <p className="text-slate-400 font-bold text-[10px] uppercase">{t('roadmap.warehouse.forecastNominal')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
                        <MapPin className="text-indigo-600" /> {t('roadmap.warehouse.bin')}
                    </h2>
                    <div className="space-y-4">
                        {locations.map(loc => (
                            <div key={loc.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:shadow-xl transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-yellow-400 transition-all">
                                        <QrCode size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-lg leading-tight">{loc.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">ID: WH-NODE-{loc.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900">{loc.occupancy}</p>
                                    <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{t('roadmap.warehouse.capacity')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
                        <Truck className="text-amber-600" /> {t('roadmap.warehouse.audit')}
                    </h2>
                    <div className="bg-slate-900 rounded-[3.5rem] p-10 h-full min-h-[400px] flex flex-col justify-between">
                        <div className="space-y-8">
                            {[
                            { user: t('roadmap.warehouse.techAlpha'), action: t('roadmap.warehouse.act1'), time: '14:20' },
                                { user: t('roadmap.warehouse.stockMgr'), action: t('roadmap.warehouse.act2'), time: '11:05' },
                                { user: t('roadmap.warehouse.foreman'), action: t('roadmap.warehouse.act3'), time: '09:44' }
                            ].map((audit, i) => (
                                <div key={i} className="flex justify-between items-start border-b border-white/5 pb-6">
                                    <div>
                                        <p className="text-xs font-black text-white italic">{audit.user}</p>
                                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">{audit.action}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-yellow-400/50">{audit.time}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:bg-white hover:text-slate-900 transition-all tracking-widest">
                            {t('roadmap.warehouse.ledger')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartWarehouse;
