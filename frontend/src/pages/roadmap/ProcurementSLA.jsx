import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ShoppingCart, Gavel, TrendingUp, Users, Briefcase } from 'lucide-react';

const ProcurementSLA = () => {
    const { t } = useTranslation();
    const [view, setView] = useState('procurement'); // 'procurement' or 'sla'

    const suppliers = [
        { name: 'Industrial Parts Global', reliability: '98%', avgDelivery: '2 days', priceRank: 'Low' },
        { name: 'Precision Components Ltd', reliability: '94%', avgDelivery: '5 days', priceRank: 'Medium' }
    ];

    const slaBreaches = [
        { vendor: 'Atlas Services', kpi: 'Uptime < 99.8%', penalty: '$1,200', status: 'UNPAID' },
        { vendor: 'Connect IoT', kpi: 'Response > 4h', penalty: '$450', status: 'ACKNOWLEDGED' }
    ];

    return (
        <div className="space-y-12 animate-fade-in-up uppercase">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">{t('roadmap.procurement_sla', 'Procurement & SLA')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
                        <p className="text-slate-400 font-black tracking-[0.4em] text-[10px]">{t('roadmap.supply_chain_contrac', 'Supply Chain & Contract Lifecycle Intelligence')}</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 p-2 rounded-[2rem] border border-slate-200">
                    <button 
                        onClick={() => setView('procurement')}
                        className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest transition-all ${view === 'procurement' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500'}`}
                    >
                        {t('roadmap.smart_procurement', 'SMART PROCUREMENT')}
                    </button>
                    <button 
                        onClick={() => setView('sla')}
                        className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest transition-all ${view === 'sla' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500'}`}
                    >
                        {t('roadmap.sla_management', 'SLA MANAGEMENT')}
                    </button>
                </div>
            </div>

            {view === 'procurement' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-emerald-900 p-12 rounded-[4rem] text-white flex justify-between items-center shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 opacity-10">
                                <ShoppingCart size={140} />
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-4xl font-black tracking-tighter italic">{t('roadmap.ai_recommendation', 'AI Recommendation')}</h3>
                                <p className="text-[10px] text-emerald-400 font-black tracking-widest leading-loose max-w-sm">
                                    {t('roadmap._stock_for_hydraulic', '"Stock for \'Hydraulic Filter X\' will reach critical threshold in 7 days. Automatic purchase of 50 units suggested."')}
                                </p>

                             </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 italic">
                                <Users className="text-indigo-600" /> {t('roadmap.supplier_reliability', 'Supplier Reliability Matrix')}
                            </h2>
                            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
<table className="w-full text-left">
                                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 tracking-widest border-b border-slate-100 uppercase">
                                        <tr>
                                            <th className="px-10 py-6">{t('roadmap.vendor', 'Vendor')}</th>
                                            <th className="px-10 py-6">{t('roadmap.reliability', 'Reliability')}</th>
                                            <th className="px-10 py-6">{t('roadmap.lead_time', 'Lead Time')}</th>
                                            <th className="px-10 py-6 text-right">{t('roadmap.price_rank', 'Price Rank')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {suppliers.map((s, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-10 py-8 font-black text-slate-900">{s.name}</td>
                                                <td className="px-10 py-8 font-black text-emerald-600">{s.reliability}</td>
                                                <td className="px-10 py-8 font-black text-slate-500">{s.avgDelivery}</td>
                                                <td className="px-10 py-8 text-right font-black italic text-indigo-600">{s.priceRank}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-12 rounded-[4.5rem] text-white space-y-10 shadow-2xl">
                        <div className="space-y-4">
                            <TrendingUp className="text-yellow-400" size={48} />
                            <h3 className="text-3xl font-black italic tracking-tighter">{t('roadmap.budget_flux', 'Budget Flux')}</h3>
                            <p className="text-[10px] text-slate-400 font-black tracking-widest leading-loose">
                                {t('roadmap._cumulative_procurem', '"Cumulative procurement efficiency improved by 14% since AI-integration."')}
                            </p>
                        </div>
                        <div className="h-64 border-l-2 border-white/5 flex flex-col justify-end gap-2 p-6">
                            <div className="w-full bg-indigo-500 h-1/2 rounded-full opacity-20"></div>
                            <div className="w-full bg-indigo-500 h-3/4 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="space-y-8">
                        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-10">
                            <h2 className="text-3xl font-black text-slate-900 italic flex items-center gap-4">
                                <Gavel className="text-rose-600" /> {t('roadmap.active_sla_breaches', 'Active SLA Breaches')}
                            </h2>
                            <div className="space-y-4">
                                {slaBreaches.map((b, i) => (
                                    <div key={i} className="p-8 bg-rose-50 rounded-[3rem] border border-rose-100 flex justify-between items-center group hover:bg-rose-600 transition-all">
                                        <div>
                                            <p className="text-lg font-black text-rose-900 group-hover:text-white leading-none italic">{b.vendor}</p>
                                            <p className="text-[10px] text-rose-400 group-hover:text-rose-200 font-black mt-2 tracking-widest">{b.kpi}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-rose-600 group-hover:text-yellow-400">{b.penalty}</p>
                                            <p className="text-[9px] font-black text-rose-300 group-hover:text-rose-100 tracking-widest">{t('roadmap.penalty', 'PENALTY')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl space-y-10">
                            <h2 className="text-3xl font-black italic flex items-center gap-4">
                                <Briefcase className="text-yellow-400" /> {t('roadmap.contract_lifecycle', 'Contract Lifecycle')}
                            </h2>
                            <div className="space-y-6">
                                <div className="border-l-4 border-yellow-400 pl-8 space-y-2">
                                    <p className="text-xl font-black italic text-white uppercase tracking-tight">{t('roadmap.maintenance_masters', 'Maintenance Masters S.A.')}</p>
                                    <p className="text-[10px] text-slate-400 font-black tracking-widest">{t('roadmap.expires_in_42_days', 'EXPIRES IN: 42 DAYS')}</p>
                                </div>
                                <div className="border-l-4 border-white/10 pl-8 space-y-2">
                                    <p className="text-xl font-black italic text-white/50 uppercase tracking-tight">{t('roadmap.global_logistics_hub', 'Global Logistics Hub')}</p>
                                    <p className="text-[10px] text-slate-600 font-black tracking-widest">{t('roadmap.status_in_negotiatio', 'STATUS: IN NEGOTIATION')}</p>
                                </div>
                            </div>

                        </div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default ProcurementSLA;
