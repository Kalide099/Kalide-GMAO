import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    DollarSign, Briefcase, PieChart, TrendingDown, 
    Layers, ShieldCheck
} from 'lucide-react';

const FinanceMatrix = () => {
    const { t } = useTranslation();
    const [contracts, setContracts] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('contracts');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusTone, setStatusTone] = useState('');

    const percentage = (numerator, denominator) => {
        if (!denominator || Number(denominator) === 0) return 0;
        return (Number(numerator) / Number(denominator)) * 100;
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [contractsRes, budgetsRes] = await Promise.all([
                api.get('/finance/contracts'),
                api.get('/finance/budgets')
            ]);
            if (contractsRes.data.success) setContracts(contractsRes.data.data);
            if (budgetsRes.data.success) setBudgets(budgetsRes.data.data);
        } catch (err) {
            console.error("Finance Sync Failure.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalBudgetSpent = budgets.reduce((acc, b) => acc + (parseFloat(b.spent_amount) || 0), 0);
    const totalBudgetAllocated = budgets.reduce((acc, b) => acc + (parseFloat(b.allocated_amount) || 0), 0);

    const handleAnalyzeContract = (contract) => {
        const content = [
            `Contract: ${contract.title || 'N/A'}`,
            `Reference: ${contract.id || 'N/A'}`,
            `Subcontractor: ${contract.subcontractor_name || 'N/A'}`,
            `Status: ${contract.status || 'N/A'}`,
            `Start Date: ${contract.start_date || 'N/A'}`,
            `End Date: ${contract.end_date || 'N/A'}`,
            `Value: ${contract.value || 0} ${contract.currency || 'USD'}`
        ].join('\n');

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contract-${(contract.id || 'summary').toString().slice(0, 8)}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleArchiveContract = async (contractId) => {
        if (!window.confirm(t('common.confirmDelete') || 'Archive this contract?')) return;
        try {
            await api.patch(`/finance/contracts/${contractId}/archive`);
            setStatusTone('success');
            setStatusMessage('Contract archived.');
            await fetchData();
        } catch (err) {
            setStatusTone('error');
            setStatusMessage(err?.response?.data?.message || 'Failed to archive contract.');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <DollarSign className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('cmms.finance.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('cmms.finance.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center bg-slate-100/80 p-2 rounded-[2.5rem] border border-slate-100 w-full xl:w-auto">
                    <button 
                        onClick={() => setActiveTab('contracts')}
                        className={`flex-1 xl:flex-none px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'contracts' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {t('cmms.finance.contracts')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('budgets')}
                        className={`flex-1 xl:flex-none px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'budgets' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {t('cmms.finance.budgets')}
                    </button>
                </div>
            </div>

            {statusMessage && (
                <div className={`rounded-[2rem] px-6 py-4 font-bold text-xs uppercase tracking-widest border ${statusTone === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {statusMessage}
                </div>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl flex flex-col justify-between h-48 border border-white/5">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{t('cmms.finance.global_spent')}</span>
                        <TrendingDown className="text-rose-500" />
                    </div>
                    <div>
                        <h4 className="text-4xl font-black italic tracking-tighter">${totalBudgetSpent.toLocaleString()}</h4>
                            <div className="h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, percentage(totalBudgetSpent, totalBudgetAllocated))}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.active_contracts')}</span>
                        <Briefcase className="text-indigo-600" />
                    </div>
                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter italic">{contracts.filter(c => c.status === 'active').length}</h4>
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.allocated_fund')}</span>
                        <ShieldCheck className="text-emerald-500" />
                    </div>
                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter italic">${(totalBudgetAllocated/1000).toFixed(1)}k</h4>
                </div>
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.utilization_rate')}</span>
                        <PieChart className="text-amber-500" />
                    </div>
                    <h4 className="text-5xl font-black text-slate-900 tracking-tighter italic">{percentage(totalBudgetSpent, totalBudgetAllocated).toFixed(1)}%</h4>
                </div>
            </div>

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400 animate-pulse">
                    <Layers size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t('cmms.finance.initializing')}</span>
                </div>
            ) : activeTab === 'contracts' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {contracts.map((contract, i) => (
                        <div key={contract.id} className="bg-white rounded-[3.5rem] p-12 border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="flex justify-between items-start mb-10">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${contract.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {contract.status}
                                </span>
                                <span className="text-xs font-black text-slate-300 font-mono italic">{t('cmms.finance.ref_no')}: {contract.id.slice(0, 8)}</span>
                            </div>
                            
                            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors uppercase">{contract.title}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">{contract.subcontractor_name || t('cmms.finance.individual_entity')}</p>

                            <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-50">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('cmms.finance.protocol_value')}</p>
                                    <p className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">${parseFloat(contract.value).toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('cmms.finance.expiration')}</p>
                                    <p className="text-lg font-black text-slate-950 uppercase">{new Date(contract.end_date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-10">
                                <button onClick={() => handleAnalyzeContract(contract)} className="flex-1 py-5 bg-slate-950 text-yellow-400 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200">
                                    {t('cmms.finance.analyze_pdf')}
                                </button>
                                <button onClick={() => handleArchiveContract(contract.id)} className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100">
                                    {t('cmms.finance.archive')}
                                </button>
                            </div>
                        </div>
                    ))}
                    {contracts.length === 0 && (
                       <div className="col-span-full py-24 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
                            <Layers size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.no_contracts')}</p>
                       </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden animate-fade-in-up">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.sector_domain')}</th>
                                <th className="p-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.allocated_fund')}</th>
                                <th className="p-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.global_spent')}</th>
                                <th className="p-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('cmms.finance.utilization_rate')}</th>
                                <th className="p-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('common.sync')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {budgets.map(b => (
                                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-10">
                                        <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">{b.sector}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">{t('cmms.finance.fiscal_year')} {b.year}</p>
                                    </td>
                                    <td className="p-10 text-center font-black text-slate-800 tracking-tighter italic text-xl">${parseFloat(b.allocated_amount).toLocaleString()}</td>
                                    <td className="p-10 text-center font-black text-rose-500 tracking-tighter italic text-xl">${parseFloat(b.spent_amount).toLocaleString()}</td>
                                    <td className="p-10 w-64">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${Math.min(100, percentage(b.spent_amount, b.allocated_amount))}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{percentage(b.spent_amount, b.allocated_amount).toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-10 text-right">
                                        <ShieldCheck className="text-emerald-500 inline-block" size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FinanceMatrix;
