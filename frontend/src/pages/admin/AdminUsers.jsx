import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { Users, Search, Zap, Globe, ShieldCheck, Mail, Building2, UserCheck } from 'lucide-react';

const AdminUsers = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            if (response.data.success) setUsers(response.data.data);
        } catch (err) {
            console.error(t('admin.userPullError'), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u => 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">
            {/* Header Terminal */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <UserCheck className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('admin.identityMatrix')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('admin.identityMgmtSub')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('admin.searchUsers')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    
                    <button 
                        onClick={fetchUsers}
                        className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                        <Zap size={24} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-[0.5em] text-[10px]">{t('admin.syncingClusters')}</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('admin.enterpriseNode')}</th>
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('admin.systemIdentifier')}</th>
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('admin.accessProtocol')}</th>
                                    <th className="px-12 py-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.length === 0 ? (
                                    <tr><td colSpan="4" className="px-12 py-32 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">{t('admin.noIdentityMatches')}</td></tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:bg-indigo-600 transition-colors">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-indigo-600 transition-colors">
                                                            {u.company_name || t('admin.rootOrphan')}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 mt-2 font-black tracking-widest uppercase flex items-center gap-2">
                                                            <Globe size={12} className="text-slate-300" /> {t('admin.clusterId')}: {u.company_id || t('admin.localCore')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                                        <Mail size={16} />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-tight text-slate-600">{u.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                                                    u.role === 'super_admin' ? 'bg-slate-950 text-yellow-400 border-white/5' : 
                                                    u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                    {t(`common.roles.${u.role}`)}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <button className="px-6 py-3 bg-white border border-slate-100 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                        {t('admin.auditProfile')}
                                                    </button>
                                                    <button className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                                        {t('admin.revoke')}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Info Hub */}
                    <div className="bg-slate-50 p-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <ShieldCheck size={20} className="text-emerald-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{t('admin.identitySecurityMsg')}</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('admin.activeSeats')}: {filteredUsers.filter(u => u.status !== 'suspended').length}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t('admin.suspendedNodes')}: {filteredUsers.filter(u => u.status === 'suspended').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
