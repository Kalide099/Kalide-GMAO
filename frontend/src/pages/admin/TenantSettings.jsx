import { useState } from 'react';
import { Settings, Users, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
const TenantSettings = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    const handleSaveChanges = () => {
        toast.success(t('tenantSettings.profileSaved'));
    };

    const handleInviteUser = () => {
        const email = window.prompt(t('tenantSettings.invitePrompt'));
        if (!email) return;
        window.location.href = `mailto:${email}?subject=KGMAO Workspace Invite`;
    };

    const handleManageSubscription = () => {
        navigate('/app/finance');
    };

    const handleEnable2FA = () => {
        navigate('/app/mfa-security');
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-12">
            <div className="bg-slate-900 p-5 sm:p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-slate-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
                        <Settings size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter">{t('tenantSettings.title')}</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.08em] sm:tracking-[0.2em] text-xs mt-2">{t('tenantSettings.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <Settings size={18} /> {t('tenantSettings.companyProfile')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <Users size={18} /> {t('tenantSettings.teamManagement')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'billing' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <CreditCard size={18} /> {t('tenantSettings.subscriptionBilling')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <Shield size={18} /> {t('tenantSettings.security2fa')}
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8 min-h-[500px] min-w-0">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('tenantSettings.companyDetails')}</h3>
                                <p className="text-xs text-slate-500 font-semibold mt-1">{t('tenantSettings.updateCoreInfo')}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('tenantSettings.companyName')}</label>
                                    <input type="text" defaultValue={user?.company_name || 'Kalide Global'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('tenantSettings.industrySector')}</label>
                                    <input type="text" disabled defaultValue={user?.industry || 'Technology'} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-500 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('tenantSettings.defaultCurrency')}</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                        <option>GBP (£)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('tenantSettings.timezone')}</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                                        <option>UTC (Coordinated Universal Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>PST (Pacific Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <button onClick={handleSaveChanges} className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors">{t('tenantSettings.saveChanges')}</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('tenantSettings.teamManagement')}</h3>
                                    <p className="text-xs text-slate-500 font-semibold mt-1">{t('tenantSettings.teamDescription')}</p>
                                </div>
                                <button onClick={handleInviteUser} className="bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">{t('tenantSettings.inviteUser')}</button>
                            </div>
                            <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
<table className="w-full text-left">
                                    <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
                                        <tr>
                                            <th className="px-6 py-4 font-black">{t('tenantSettings.user')}</th>
                                            <th className="px-6 py-4 font-black">{t('tenantSettings.role')}</th>
                                            <th className="px-6 py-4 font-black">{t('tenantSettings.status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{user?.first_name} {user?.last_name} (You)</td>
                                            <td className="px-6 py-4 text-slate-600">{t('tenantSettings.admin')}</td>
                                            <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">{t('tenantSettings.active')}</span></td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900">{t('tenantSettings.sampleUser')}</td>
                                            <td className="px-6 py-4 text-slate-600">{t('tenantSettings.technician')}</td>
                                            <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">{t('tenantSettings.active')}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="animate-fade-in space-y-8 text-center py-12">
                            <CreditCard size={48} className="mx-auto text-indigo-400 mb-4" />
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('tenantSettings.activePlan', { plan: user?.plan || 'Pro' })}</h3>
                            <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">{t('tenantSettings.billingDescription', { plan: user?.plan })}</p>
                            <button onClick={handleManageSubscription} className="mt-6 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors">{t('tenantSettings.manageSubscription')}</button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in space-y-8 text-center py-12">
                            <Shield size={48} className="mx-auto text-emerald-400 mb-4" />
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('tenantSettings.multiFactor')}</h3>
                            <p className="text-sm text-slate-500 font-semibold max-w-md mx-auto">{t('tenantSettings.securityDescription')}</p>
                            <button onClick={handleEnable2FA} className="mt-6 bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-xl hover:bg-slate-200 transition-colors">{t('tenantSettings.enable2fa')}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TenantSettings;
