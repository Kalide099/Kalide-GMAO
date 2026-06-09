import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { 
    UserPlus, CheckCircle, XCircle, Clock, 
    Building2, Mail, Search, Zap, Eye, Phone, Lock
} from 'lucide-react';

const AdminRegistrations = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get('/registrations/list');
            if (res.data.success) setRequests(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const processRequest = async (id, status) => {
        const notes = prompt(t('admin_registrations.processingNotes'));
        try {
            const res = await api.post(`/registrations/${id}/process`, { status, notes });
            if (res.data.success) {
                alert(res.data.message);
                fetchRequests();
            }
        } catch (err) {
            alert(t('admin_registrations.processingFailed'));
        }
    };

    const formatPlan = (plan) => {
        const normalized = plan || 'basic';
        return t(`pricing.tiers.${normalized}.name`) || normalized;
    };

    const filteredRequests = requests.filter(r => 
        r.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.admin_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.admin_last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.requested_plan?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">
            {/* Header Terminal */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-yellow-200 group cursor-pointer hover:rotate-12 transition-transform">
                        <UserPlus className="text-slate-900 w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('admin.onboardingRequests')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('admin.onboardingRequestsSub')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
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

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-[0.5em] text-[10px]">{t('admin_registrations.syncing')}</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em]">{t('admin.companyIdentity')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em]">{t('admin.adminPersona')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em] text-center">{t('admin.industrySector')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em] text-center">Plan</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em] text-center">{t('admin.status')}</th>
                                    <th className="px-5 md:px-12 py-5 md:py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.12em] md:tracking-[0.3em]">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRequests.length === 0 ? (
                                    <tr><td colSpan="6" className="px-5 md:px-12 py-20 md:py-32 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">{t('admin_registrations.zeroRequests')}</td></tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-5 md:px-12 py-6 md:py-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all duration-500">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-slate-900 transition-colors leading-none">
                                                            {req.company_name}
                                                        </div>
                                                        <div className="text-[9px] text-slate-400 mt-2 font-black tracking-widest uppercase">NODE-REQUEST: {req.id.slice(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 md:px-12 py-6 md:py-10">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{req.admin_first_name} {req.admin_last_name}</span>
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium italic">
                                                        <Mail size={12} className="opacity-50" /> {req.admin_email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 md:px-12 py-6 md:py-10 text-center">
                                                <span className="px-5 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                                    {req.industry}
                                                </span>
                                            </td>
                                            <td className="px-5 md:px-12 py-6 md:py-10 text-center">
                                                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                                                    {formatPlan(req.requested_plan)}
                                                </span>
                                            </td>
                                            <td className="px-5 md:px-12 py-6 md:py-10">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            req.status === 'approved' ? 'bg-emerald-500' : 
                                                            req.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-400 animate-pulse'
                                                        }`}></div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                            req.status === 'approved' ? 'text-emerald-500' : 
                                                            req.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'
                                                        }`}>
                                                            {req.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 md:px-12 py-6 md:py-10">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <button 
                                                        onClick={() => setSelectedRequest(req)}
                                                        className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                    >
                                                        <Eye size={14} /> {t('admin.viewProfile') || 'View Profile'}
                                                    </button>
                                                    {req.status === 'pending' ? (
                                                        <>
                                                            <button 
                                                                onClick={() => processRequest(req.id, 'approved')}
                                                                className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                            >
                                                                <CheckCircle size={14} /> {t('admin_registrations.authorize')}
                                                            </button>
                                                            <button 
                                                                onClick={() => processRequest(req.id, 'rejected')}
                                                                className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                            >
                                                                <XCircle size={14} /> {t('admin_registrations.deny')}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Onboarding Status */}
                    <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <Clock size={20} className="text-amber-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('admin_registrations.slaNote')}</p>
                        </div>
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('admin_registrations.pendingRequests')}</span>
                                <span className="text-xl font-black text-slate-900 italic">{requests.filter(r => r.status === 'pending').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter break-words">{selectedRequest.company_name}</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        ID: {selectedRequest.id.slice(0, 8)} • {selectedRequest.industry}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                            >
                                <Zap className="rotate-45" size={20} />
                            </button>
                        </div>
                        <div className="p-5 sm:p-8 md:p-10 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Admin Profile Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Name</div>
                                        <div className="text-sm font-bold text-slate-700">{selectedRequest.admin_first_name} {selectedRequest.admin_last_name}</div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Address</div>
                                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400" /> {selectedRequest.admin_email}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone Number</div>
                                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" /> {selectedRequest.admin_phone || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Requested Plan</div>
                                        <div className="text-sm font-bold text-slate-700">{formatPlan(selectedRequest.requested_plan)}</div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 border-l-4 border-l-emerald-500">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Password Status</div>
                                        <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Lock size={14} className="text-emerald-500" /> Secured & Encrypted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 sm:p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 shrink-0">
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-100 transition-all shadow-sm"
                            >
                                {t('common.close')}
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <button 
                                    onClick={() => {
                                        setSelectedRequest(null);
                                        processRequest(selectedRequest.id, 'approved');
                                    }}
                                    className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-600 transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={16} /> {t('admin_registrations.authorize')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRegistrations;
