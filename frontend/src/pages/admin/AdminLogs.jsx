import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { ShieldAlert, Terminal as TerminalIcon, Search, Zap, Trash2, Cpu } from 'lucide-react';

const AdminLogs = () => {
    const { t } = useTranslation();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/logs');
            if (response.data.success) setLogs(response.data.data);
        } catch (err) {
            console.error(t('admin.fetchError'), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">
            {/* Header Terminal */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <ShieldAlert className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('admin.securityLogs')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('admin.auditStream')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('common.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-rose-600/5 focus:border-rose-600 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    
                    <button 
                        onClick={fetchLogs}
                        className="w-16 h-16 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                        <Zap size={24} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="p-20 text-center font-black text-slate-300 italic animate-pulse uppercase tracking-[0.5em] text-[10px]">{t('admin.ingestingLogs')}</p>
                </div>
            ) : (
                <div className="bg-slate-950 rounded-[3.5rem] shadow-3xl border border-white/5 overflow-hidden font-mono min-h-[600px] flex flex-col">
                    <div className="bg-slate-900/50 p-8 border-b border-white/5 flex justify-between items-center text-slate-500 text-[10px] font-black tracking-widest uppercase">
                        <div className="flex items-center gap-4">
                            <TerminalIcon size={18} className="text-yellow-400" />
                            <span>{t('admin.authLevel')}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <span>{filteredLogs.length} {t('admin.eventsIngested')}</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>
                    
                    <div className="flex-1 p-8 overflow-y-auto max-h-[700px] custom-scrollbar-dark space-y-4">
                        {filteredLogs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                                <Cpu size={64} className="text-slate-600 italic" />
                                <p className="text-xs uppercase tracking-[0.4em]">{t('admin.noLogs')}</p>
                            </div>
                        ) : (
                            filteredLogs.map(log => (
                                <div key={log.id} className="group/log border-b border-white/5 pb-6 hover:bg-white/5 rounded-2xl p-6 transition-all">
                                    <div className="flex flex-wrap items-center gap-4 mb-3">
                                        <span className="text-emerald-500 font-black text-[10px] tracking-tight bg-emerald-500/10 px-3 py-1 rounded-md">
                                            [{new Date(log.created_at).toISOString().replace('T', ' ').slice(0, 19)}]
                                        </span>
                                        <span className="text-rose-500 font-black text-[10px] tracking-[0.2em] uppercase bg-rose-500/10 px-3 py-1 rounded-md">
                                            {log.action}
                                        </span>
                                        <span className="text-indigo-400 font-black text-[10px] tracking-widest uppercase italic">
                                            {t('admin.logSource')}: {log.user_name || t('admin.systemCore')}
                                        </span>
                                        <span className="text-slate-600 font-black text-[10px] tracking-widest uppercase">
                                            {t('admin.entityType')}: {log.entity_type} {t('admin.entityId')}_{log.entity_id?.slice(0, 8)}
                                        </span>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-[1.5rem] border border-white/5 group-hover/log:border-white/10 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2.5 shrink-0"></div>
                                            <p className="text-slate-400 text-xs leading-relaxed break-all font-medium italic">
                                                {log.details || t('admin.emptyPayload')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="bg-slate-900/50 p-6 border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-4">
                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                        </div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t('admin.forensicProtocol')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;
