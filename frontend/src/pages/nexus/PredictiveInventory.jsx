import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, TrendingDown, ArrowUpRight, ShoppingCart, RefreshCcw, Gauge } from 'lucide-react';

const PredictiveInventory = () => {
    const { t } = useTranslation();

    const parts = [
        { id: 1, name: t('nexus.inventory.parts.p1'), current: 14, min: 20, predicted: 8, status: 'urgent' },
        { id: 2, name: t('nexus.inventory.parts.p2'), current: 45, min: 30, predicted: 12, status: 'stable' },
        { id: 3, name: t('nexus.inventory.parts.p3'), current: 5, min: 10, predicted: 6, status: 'critical' },
    ];

    return (
        <div className="space-y-12 animate-fade-in-up pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-purple-200">
                        <Box className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic italic leading-none">
                            {t('nexus.inventory.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            {t('nexus.inventory.subtitle')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 active:scale-95">
                        <RefreshCcw size={18} /> {t('nexus.inventory.retrain')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="bg-slate-950 p-10 rounded-[3rem] text-white space-y-6">
                    <Gauge className="text-purple-400" />
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('nexus.inventory.accuracy')}</h4>
                    <p className="text-5xl font-black tracking-tighter">91.4%</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <TrendingDown className="text-rose-500" />
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('nexus.inventory.risk')}</h4>
                    <p className="text-5xl font-black text-slate-900 tracking-tighter">0.8%</p>
                </div>
                <div className="bg-indigo-600 p-10 rounded-[3rem] text-white space-y-6">
                    <ArrowUpRight className="text-white" />
                    <h4 className="text-[10px] font-black uppercase text-indigo-100 tracking-widest">{t('nexus.inventory.orders')}</h4>
                    <p className="text-5xl font-black tracking-tighter">14</p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-center items-center gap-4 group cursor-pointer hover:bg-emerald-500 transition-colors">
                     <ShoppingCart className="text-slate-400 group-hover:text-white" size={40} />
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{t('nexus.inventory.auto_purchase')}</p>
                </div>
            </div>

            {/* Prediction Feed */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden p-12">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-10">{t('nexus.inventory.forecast_title')}</h3>
                 <div className="space-y-6">
                    {parts.map(part => (
                        <div key={part.id} className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/30 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-2xl transition-all">
                             <div className="flex items-center gap-8 w-full lg:w-auto">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${part.status === 'urgent' ? 'bg-orange-500' : part.status === 'critical' ? 'bg-rose-500' : 'bg-slate-900'}`}>
                                    <Box size={24} />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">{part.name}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">ID: SKU-900{part.id}</p>
                                </div>
                             </div>

                             <div className="flex gap-16 w-full lg:w-auto text-center">
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.inventory.current_stock')}</p>
                                    <p className="text-3xl font-black text-slate-900">{part.current}</p>
                                 </div>
                                 <div className="px-10 border-x border-slate-200">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nexus.inventory.min_threshold')}</p>
                                    <p className="text-3xl font-black text-slate-400">{part.min}</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">{t('nexus.inventory.forecast_need')}</p>
                                    <p className="text-3xl font-black text-indigo-600">+{part.predicted}</p>
                                 </div>
                             </div>

                             <button className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${part.status === 'stable' ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200'}`}>
                                {part.status === 'stable' ? t('nexus.inventory.stable') : t('nexus.inventory.auth_order')}
                             </button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default PredictiveInventory;
