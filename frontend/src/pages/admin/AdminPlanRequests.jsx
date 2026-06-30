import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle, Clock, Building2, Search, Zap } from 'lucide-react';

const statusBadge = (status) => {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (status === 'rejected')  return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
};

const AdminPlanRequests = () => {
    const { t } = useTranslation();
    const [requests, setRequests]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/plan-requests');
            if (res.data.success) setRequests(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const processRequest = async (id, status) => {
        const notes = prompt(t('planRequests.notesPrompt'));
        if (notes === null) return; // cancelled
        try {
            const res = await api.patch(`/admin/plan-request/${id}/process`, { status, admin_notes: notes || null });
            if (res.data.success) {
                toast.success(res.data.message);
                fetchRequests();
            }
        } catch {
            toast.error(t('planRequests.processFailed'));
        }
    };

    const filtered = requests.filter(r =>
        r.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requested_plan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-yellow-200 hover:rotate-12 transition-transform cursor-default">
                        <CreditCard className="text-slate-900 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('planRequests.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('planRequests.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-yellow-400/5 focus:border-yellow-400 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    <button
                        onClick={fetchRequests}
                        className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                        <Zap size={24} />
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-300 font-black italic animate-pulse uppercase tracking-[0.5em] text-[10px]">
                        {t('planRequests.syncing')}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('planRequests.company')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('planRequests.currentPlan')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('planRequests.requestedPlan')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('admin.status')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-12 py-32 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">
                                            {t('planRequests.noneFound')}
                                        </td>
                                    </tr>
                                ) : filtered.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-5 md:px-12 py-6 md:py-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all duration-300 shrink-0">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{req.company_name}</div>
                                                    <div className="text-[9px] text-slate-400 font-black tracking-widest uppercase mt-1">
                                                        {new Date(req.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 md:px-12 py-6 md:py-10">
                                            <span className="px-5 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {req.current_plan}
                                            </span>
                                        </td>
                                        <td className="px-5 md:px-12 py-6 md:py-10">
                                            <span className="px-5 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {req.requested_plan}
                                            </span>
                                        </td>
                                        <td className="px-5 md:px-12 py-6 md:py-10">
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        req.status === 'approved' ? 'bg-emerald-500' :
                                                        req.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'
                                                    }`}></div>
                                                    <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusBadge(req.status)}`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 md:px-12 py-6 md:py-10">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                {req.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => processRequest(req.id, 'approved')}
                                                            className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={14} /> {t('planRequests.approve')}
                                                        </button>
                                                        <button
                                                            onClick={() => processRequest(req.id, 'rejected')}
                                                            className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center gap-2"
                                                        >
                                                            <XCircle size={14} /> {t('planRequests.reject')}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="inline-flex items-center px-6 py-3 bg-slate-50 text-slate-300 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest cursor-not-allowed">
                                                        {t('admin_registrations.processed')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlanRequests;
