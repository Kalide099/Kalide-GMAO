import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { ShieldCheck, User, Clock, Database } from 'lucide-react';

const AuditLogs = () => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/audit');
            if (res.data.success) setLogs(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        if (action.includes('delete') || action.includes('removed')) return 'bg-rose-50 text-rose-600';
        if (action.includes('update') || action.includes('edit')) return 'bg-amber-50 text-amber-600';
        if (action.includes('create') || action.includes('add')) return 'bg-emerald-50 text-emerald-600';
        return 'bg-slate-50 text-slate-600';
    };

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <ShieldCheck className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">{t('nav.audit')}</h1>
                        <p className="text-slate-500 font-medium tracking-tight">{t('audit.subtitle')}</p>
                    </div>
                </div>
                <div className="px-8 py-4 bg-emerald-50 text-emerald-700 rounded-3xl border-2 border-emerald-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-black uppercase tracking-widest">{t('audit.isoStatus')}</span>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-left">
                        <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">{t('common.timestamp')}</th>
                                <th className="px-10 py-6">{t('admin.logUser')}</th>
                                <th className="px-10 py-6">{t('admin.payload')}</th>
                                <th className="px-10 py-6">{t('admin.target')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 italic">{t('common.loading')}...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 italic">{t('audit.emptyState')}</td></tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-slate-300" />
                                                <span className="text-sm font-bold text-slate-600 font-mono">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm">
                                                    <User size={14} className="text-slate-500" />
                                                </div>
                                                <span className="text-sm font-black text-slate-800 tracking-tight uppercase">
                                                    {log.user_name || t('audit.systemBot')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <Database size={14} className="text-slate-400" />
                                                <span className="text-sm font-bold text-slate-500 tracking-tight uppercase">
                                                    {log.entity_type}: {log.entity_id.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
