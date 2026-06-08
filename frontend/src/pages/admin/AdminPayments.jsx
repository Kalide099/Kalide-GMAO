import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminPayments = () => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/admin/payments');
                if (response.data.success) setPayments(response.data.data);
            } catch (err) {
                console.error("Global Payment fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    if (loading) return <div className="p-8 text-slate-500">{t('common.loading')}...</div>;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                <CreditCard className="text-rose-500" /> {t('admin.financialFlows')}
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mt-8 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-bold text-slate-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-4">{t('admin.transactionId')}</th>
                            <th className="px-6 py-4">{t('admin.tenantMap')}</th>
                            <th className="px-6 py-4">{t('admin.revenue')}</th>
                            <th className="px-6 py-4">{t('admin.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                    {t('admin.noPayments')}
                                </td>
                            </tr>
                        ) : (
                            payments.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 font-mono text-sm text-slate-400">{p.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{p.company_name}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {p.currency} {p.amount}
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        {p.status === 'success' ? <ArrowUpRight className="text-emerald-500" size={16} /> : <ArrowDownRight className="text-rose-500" size={16} />}
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest text-[9px] ${
                                            p.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                        }`}>
                                            {t(`common.status.${p.status}`)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPayments;
