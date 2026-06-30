import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import toast from 'react-hot-toast';
import {
    Building2, Crown, CheckCircle, Clock, XCircle, CreditCard, ChevronRight
} from 'lucide-react';

const PLANS = [
    {
        key: 'basic',
        emoji: '🔹',
        features: ['50 assets', 'Work orders', 'Inventory', 'Procurement', 'Basic reporting'],
    },
    {
        key: 'pro',
        emoji: '⚡',
        features: ['500 assets', 'All Basic features', 'Predictive AI', 'IoT monitoring', 'Energy analytics', 'Advanced reporting'],
    },
    {
        key: 'enterprise',
        emoji: '👑',
        features: ['Unlimited assets', 'All Pro features', 'Full module access', 'GIS & Fleet', 'Drone commander', 'Custom integrations', 'Dedicated support'],
    },
];

const STATUS_COLORS = {
    active:    'bg-emerald-50 text-emerald-600 border-emerald-100',
    trial:     'bg-amber-50 text-amber-600 border-amber-100',
    suspended: 'bg-rose-50 text-rose-600 border-rose-100',
    expired:   'bg-slate-100 text-slate-500 border-slate-200',
    cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const PLAN_COLORS = {
    basic:      'bg-slate-100 text-slate-700 border-slate-200',
    pro:        'bg-indigo-50 text-indigo-700 border-indigo-100',
    enterprise: 'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const CompanyProfile = () => {
    const { t } = useTranslation();
    const [company, setCompany]         = useState(null);
    const [planRequest, setPlanRequest] = useState(null);
    const [loadingCo, setLoadingCo]     = useState(true);
    const [loadingReq, setLoadingReq]   = useState(true);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [message, setMessage]         = useState('');
    const [submitting, setSubmitting]   = useState(false);
    const [showForm, setShowForm]       = useState(false);

    const fetchCompany = async () => {
        try {
            const res = await api.get('/company/my-company');
            if (res.data.success) setCompany(res.data.data);
        } catch { /* handled silently */ }
        finally { setLoadingCo(false); }
    };

    const fetchPlanRequest = async () => {
        try {
            const res = await api.get('/company/my-plan-request');
            if (res.data.success) setPlanRequest(res.data.data);
        } catch { /* handled silently */ }
        finally { setLoadingReq(false); }
    };

    useEffect(() => {
        fetchCompany();
        fetchPlanRequest();
    }, []);

    const handleSubmit = async () => {
        if (!selectedPlan) {
            toast.error(t('companyProfile.selectPlan'));
            return;
        }
        setSubmitting(true);
        try {
            const res = await api.post('/company/request-plan', { requested_plan: selectedPlan, message: message || undefined });
            if (res.data.success) {
                toast.success(t('companyProfile.requestSubmitted'));
                setShowForm(false);
                setSelectedPlan('');
                setMessage('');
                fetchPlanRequest();
            }
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error(t('companyProfile.alreadyPending'));
            } else {
                toast.error(t('companyProfile.requestFailed'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const planLabel = (key) => {
        const k = key || 'basic';
        return t(`companyProfile.plan${k.charAt(0).toUpperCase()}${k.slice(1)}`, k.toUpperCase());
    };

    if (loadingCo || loadingReq) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-300 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">{t('common.loading')}</p>
            </div>
        );
    }

    const isPending  = planRequest?.status === 'pending';
    const isApproved = planRequest?.status === 'approved';
    const isRejected = planRequest?.status === 'rejected';
    const isActive   = company?.subscription_status === 'active';

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">

            {/* ─── Header ─────────────────────────────────── */}
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-yellow-400 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-yellow-200 hover:rotate-12 transition-transform cursor-default">
                    <Building2 className="text-slate-900 w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                        {t('companyProfile.title')}
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                        {t('companyProfile.subtitle')}
                    </p>
                </div>
            </div>

            {/* ─── Company Info + Subscription Cards ──────── */}
            {company && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* Company Info */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 space-y-8">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            {t('companyProfile.companyInfo')}
                        </h2>
                        <div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                                {t('common.name') || 'Company Name'}
                            </div>
                            <div className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                {company.name}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { key: 'industry',    val: company.industry },
                                { key: 'currency',    val: company.currency },
                                { key: 'timezone',    val: company.timezone },
                                { key: 'memberSince', val: company.created_at ? new Date(company.created_at).toLocaleDateString() : null },
                            ].map(({ key, val }) => (
                                <div key={key}>
                                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                                        {t(`companyProfile.${key}`)}
                                    </div>
                                    <div className="text-base font-black text-slate-700 uppercase tracking-tight">{val || '—'}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subscription */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 space-y-8">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            {t('companyProfile.subscriptionStatus')}
                        </h2>

                        <div className="space-y-6">
                            <span className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${STATUS_COLORS[company.subscription_status] || STATUS_COLORS.trial}`}>
                                {company.subscription_status?.toUpperCase() || 'TRIAL'}
                            </span>

                            <div>
                                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">
                                    {t('companyProfile.currentPlan')}
                                </div>
                                <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider border ${PLAN_COLORS[company.plan] || PLAN_COLORS.basic}`}>
                                    <Crown size={16} />
                                    {planLabel(company.plan)}
                                </span>
                            </div>

                            {isActive && (
                                <div className="flex items-center gap-3 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <CheckCircle className="text-emerald-500 shrink-0" size={20} />
                                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                                        {t('companyProfile.requestApproved')}
                                    </span>
                                </div>
                            )}

                            {!isActive && !isPending && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-yellow-400 hover:text-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl"
                                >
                                    <CreditCard size={18} />
                                    {t('companyProfile.requestPlan')}
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Plan Request Status Banner ──────────────── */}
            {planRequest && (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10">
                    {isPending && (
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shrink-0">
                                <Clock className="text-amber-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                                    {t('companyProfile.requestPending')}
                                </h3>
                                <p className="text-[11px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                                    {t('companyProfile.requestPendingDesc')}
                                </p>
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <span className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        {t('companyProfile.requestedPlan')}: {planLabel(planRequest.requested_plan)}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold">
                                        {new Date(planRequest.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isApproved && !isPending && (
                        <div className="flex items-start gap-6">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
                                <CheckCircle className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                                    {t('companyProfile.requestApproved')}
                                </h3>
                                <p className="text-[11px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                                    {t('companyProfile.requestApprovedDesc')}
                                </p>
                            </div>
                        </div>
                    )}

                    {isRejected && (
                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shrink-0">
                                    <XCircle className="text-rose-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                                        {t('companyProfile.requestRejected')}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-bold mt-2 uppercase tracking-widest">
                                        {t('companyProfile.requestRejectedDesc')}
                                    </p>
                                    {planRequest.admin_notes && (
                                        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                {t('companyProfile.adminNotes')}
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">{planRequest.admin_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-yellow-400 hover:text-slate-900 transition-all inline-flex items-center gap-3 shadow-xl"
                            >
                                <CreditCard size={18} />
                                {t('companyProfile.resubmit')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Plan Request Form ──────────────────────── */}
            {showForm && (
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 space-y-10">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                        {t('companyProfile.requestPlan')}
                    </h2>

                    {/* Plan Selector Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.key}
                                type="button"
                                onClick={() => setSelectedPlan(plan.key)}
                                className={`text-left p-8 rounded-[2rem] border-2 transition-all ${
                                    selectedPlan === plan.key
                                        ? 'border-yellow-400 bg-yellow-50 shadow-xl shadow-yellow-100'
                                        : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                                }`}
                            >
                                <div className="text-3xl mb-4">{plan.emoji}</div>
                                <div className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">
                                    {planLabel(plan.key)}
                                </div>
                                <ul className="space-y-2">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                {selectedPlan === plan.key && (
                                    <div className="mt-5 px-4 py-1.5 bg-yellow-400 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-widest inline-block">
                                        ✓ {t('common.selected') || 'Selected'}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Optional Message */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-3">
                            {t('companyProfile.messageOptional')}
                        </label>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('companyProfile.messagePlaceholder')}
                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all font-bold text-slate-800 text-sm resize-none"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting || !selectedPlan}
                            className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-yellow-400 hover:text-slate-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl"
                        >
                            {submitting
                                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                : <CreditCard size={18} />
                            }
                            {t('companyProfile.submitRequest')}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowForm(false); setSelectedPlan(''); setMessage(''); }}
                            className="px-8 py-5 bg-slate-100 text-slate-700 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 transition-all"
                        >
                            {t('common.cancel')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyProfile;
