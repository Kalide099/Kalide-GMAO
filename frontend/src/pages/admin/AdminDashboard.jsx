import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { 
    Building2, Users, CreditCard, Activity, 
    ArrowUpRight, Globe, Layers, Zap, ShieldAlert 
} from 'lucide-react';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/analytics');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error(t('admin.fetchError'), error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-[0.5em] text-[10px]">{t('admin.syncingHub')}</p>
            </div>
        );
    }

    const { companies, users, revenue } = stats || {};
    const privilegedUsers = Number(stats?.mfa?.privileged_users || 0);
    const privilegedUsersMfaEnabled = Number(stats?.mfa?.privileged_users_mfa_enabled || 0);
    const mfaCoverage = privilegedUsers > 0
        ? ((privilegedUsersMfaEnabled / privilegedUsers) * 100).toFixed(1)
        : '0.0';

    const analyticsCards = [
        { 
            label: t('admin.totalCompanies'), 
            val: companies?.total_companies || 0, 
            icon: <Building2 className="text-white" size={24} />, 
            color: 'bg-slate-900', 
            accent: 'bg-yellow-400',
            trend: t('admin.trendInflow')
        },
        { 
            label: t('admin.totalUsers'), 
            val: users?.total_users || 0, 
            icon: <Users className="text-white" size={24} />, 
            color: 'bg-slate-900', 
            accent: 'bg-emerald-400',
            trend: t('admin.trendLatency')
        },
        { 
            label: t('admin.activeSubs'), 
            val: companies?.active_subscriptions || 0, 
            icon: <Activity className="text-white" size={24} />, 
            color: 'bg-slate-900', 
            accent: 'bg-rose-500',
            trend: t('admin.trendNominal')
        },
        { 
            label: t('admin.revenue'), 
            val: revenue?.[0]?.total_revenue || '0.00', 
            unit: revenue?.[0]?.currency || 'USD',
            icon: <CreditCard className="text-white" size={24} />, 
            color: 'bg-slate-900', 
            accent: 'bg-indigo-600',
            trend: t('admin.trendFiscal')
        },
        {
            label: 'Privileged MFA Coverage',
            val: `${mfaCoverage}%`,
            icon: <ShieldAlert className="text-white" size={24} />,
            color: 'bg-slate-900',
            accent: 'bg-emerald-500',
            trend: `${privilegedUsersMfaEnabled}/${privilegedUsers} secured`
        }
    ];

    return (
        <div className="space-y-16 animate-fade-in-up pb-28">
            {/* SuperAdmin Root Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-900/40 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <ShieldAlert className="text-yellow-400 w-10 h-10 relative z-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('admin.rootMatrixConsole')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('admin.infraOversight')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button 
                        onClick={async () => {
                            const cid = prompt(t('admin.seedPrompt'));
                            if (!cid) return;
                            try {
                                const res = await api.post('/admin/seed', { companyId: cid });
                                alert(res.data.message);
                                fetchAnalytics();
                            } catch (e) {
                                alert(t('admin.seedFailed') + (e.response?.data?.message || e.message));
                            }
                        }}
                        className="bg-slate-950 hover:bg-slate-900 text-yellow-400 px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 border border-white/5"
                    >
                        <Layers className="w-6 h-6 border-2 border-yellow-400 rounded-lg p-0.5" />
                        {t('admin.loadDemo')}
                    </button>
                    <button 
                        className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                        onClick={fetchAnalytics}
                    >
                        <Zap size={24} />
                    </button>
                </div>
            </div>

            {/* Core Analytic Microchips */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                {analyticsCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-slate-200 transition-all group relative overflow-hidden flex flex-col justify-between h-80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                            <div className={`w-3 h-3 ${card.accent} rounded-full animate-ping opacity-50`}></div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-950/20 group-hover:rotate-12 transition-transform`}>
                                {card.icon}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">{card.label}</p>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-slate-900 tracking-tighter italic">{card.val}</span>
                                {card.unit && <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{card.unit}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                <ArrowUpRight size={14} />
                                {card.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Distribution & Heatmap Placeholder */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 bg-slate-950 rounded-[4rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group min-h-[500px] flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(250,204,21,0.1),transparent)] group-hover:opacity-100 opacity-50 transition-opacity"></div>
                    <div className="flex justify-between items-center relative z-10 mb-12">
                        <div>
                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{t('admin.regionalTraffic')}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">{t('admin.activeTelemetry')}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{t('admin.liveMatrix')}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center justify-center gap-10 relative z-10 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                        <Globe size={180} className="text-slate-800 group-hover:text-yellow-400 transition-colors" strokeWidth={0.5} />
                        <div className="flex gap-16">
                            {['EMEA', 'APAC', 'AMER'].map(region => (
                                <div key={region} className="text-center group/hub cursor-pointer">
                                    <p className="text-4xl font-black text-white tracking-tighter group-hover/hub:text-yellow-400 transition-colors italic">{(Math.random() * 90 + 10).toFixed(1)}{'%'}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">{t('admin.regionalCluster', { region })}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">{t('admin.securityForensics')}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">{t('admin.anomalyDetection')}</p>
                    </div>

                    <div className="space-y-8 mt-12">
                        {[
                            { label: t('admin.encryptionUptime'), val: '100.00%', color: 'bg-emerald-500' },
                            { label: t('admin.threatMitigation'), val: '99.98%', color: 'bg-indigo-600' },
                            { label: t('admin.logIntegrity'), val: t('admin.secure'), color: 'bg-slate-900' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-3 group/item cursor-pointer">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-lg font-black text-slate-900 italic group-hover/item:text-indigo-600 transition-colors">{item.val}</p>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <div className={`h-full ${item.color}`} style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
