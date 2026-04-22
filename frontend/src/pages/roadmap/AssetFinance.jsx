import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingDown, Layers, Calculator, BarChart3, PieChart } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const AssetFinance = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await api.get('/finance/overview');
                if (res.data.success) setStats(res.data.data);
            } catch (e) {
                console.error("Finance Sync Failure", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 italic animate-pulse tracking-widest uppercase">{t('roadmap.fetching_fiscal_inte', 'Fetching Fiscal Intelligence...')}</div>;

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">{t('roadmap.finance.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-indigo-500 rounded-full"></span>
                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('roadmap.finance.capex')}</p>
                    </div>
                </div>
                <div className="px-10 py-5 bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-900/10 flex items-center gap-4 border border-slate-800">
                    <DollarSign className="text-yellow-400 w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t('roadmap.financial_valuation', 'Financial Valuation Active')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm space-y-8 group hover:shadow-2xl transition-all">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                        <PieChart size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 uppercase italic">{t('roadmap.total_asset_value', 'Total Asset Value')}</h3>
                        <p className="text-slate-500 font-medium">{t('roadmap.aggregated_acquisiti', 'Aggregated acquisition cost of all active industrial assets within the platform.')}</p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.active_capex', 'Active CAPEX')}</span>
                        <span className="text-xl font-black text-slate-900">${Number(stats?.total_asset_value || 0).toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-sm space-y-8 group hover:shadow-2xl transition-all">
                    <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center">
                        <TrendingDown size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 uppercase italic">{t('roadmap.maintenance_opex', 'Maintenance OPEX')}</h3>
                        <p className="text-slate-500 font-medium">{t('roadmap.global_expenditure_o', 'Global expenditure on repairs, labor, and spare parts across the current fiscal year.')}</p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.total_spend', 'Total SPEND')}</span>
                        <span className="text-xl font-black text-rose-600">${Number(stats?.total_maintenance_spend || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="p-20 bg-slate-50 rounded-[4rem] border border-slate-100 flex flex-col md:flex-row items-center gap-20">
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{t('roadmap.economic_intersectio', 'Economic Intersection')}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed uppercase tracking-[0.2em] text-xs">
                        {stats?.asset_count} assets monitored. Intelligence engine signals optimal replacement when Opex exceeds depreciated value.
                    </p>
                </div>
                <div className="w-full md:w-96 bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black text-slate-900 italic">{stats?.asset_count}</p>
                    <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-2">{t('roadmap.monitored_items', 'Monitored Items')}</p>
                </div>
            </div>
        </div>
    );
};

export default AssetFinance;
