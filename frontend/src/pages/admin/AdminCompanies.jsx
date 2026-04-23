import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api/axiosConfig';
import { 
    Building2, Power, UserCheck, Settings2, ShieldAlert, Cpu, BrainCircuit, Globe,
    Package, Radio, Boxes, Link, Leaf, Eye, X, Award, DollarSign, Search, Layers, Thermometer, FileText, Box, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminCompanies = () => {
    const { t, i18n } = useTranslation();
    const { logout } = useAuth(); 
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const currentLang = i18n.language || 'en';

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const response = await api.get('/admin/companies');
                if (response.data.success) setCompanies(response.data.data);
            } catch (err) {
                console.error(t('admin.fetchError'), err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const forceSuspend = async (id, currentStatus) => {
        if (!window.confirm(t('admin.suspensionConfirm'))) return;
        const targetState = currentStatus === 'suspended' ? 'active' : 'suspended';
        
        try {
            const res = await api.patch(`/admin/company/${id}/status`, { status: targetState });
            if (res.data.success) {
                setCompanies(companies.map(c => c.id === id ? {...c, subscription_status: targetState} : c));
            }
        } catch (e) {
            console.error(t('admin.suspensionError'));
        }
    };

    const toggleModule = async (companyId, moduleName, currentModules) => {
        let normalized = [];
        try {
            normalized = Array.isArray(currentModules) 
                ? currentModules 
                : (typeof currentModules === 'string' ? JSON.parse(currentModules) : []);
        } catch (e) {
            normalized = [];
        }

        let updatedModules = [...normalized];
        if (updatedModules.includes(moduleName)) {
            updatedModules = updatedModules.filter(m => m !== moduleName);
        } else {
            updatedModules.push(moduleName);
        }

        try {
            const res = await api.patch(`/admin/company/${companyId}/modules`, { modules: updatedModules });
            if (res.data.success) {
                setCompanies(companies.map(c => c.id === companyId ? {...c, enabled_modules: updatedModules} : c));
            }
        } catch (e) {
            alert(t('admin.moduleConfigError'));
        }
    };

    const updatePlan = async (id, plan) => {
        try {
            const res = await api.patch(`/admin/company/${id}/plan`, { plan });
            if (res.data.success) {
                setCompanies(companies.map(c => c.id === id ? {...c, plan} : c));
                setSelectedCompany({...selectedCompany, plan});
            }
        } catch (e) {
            alert(t('admin.planUpdateError'));
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('common.loading')}...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase italic">
                        <Building2 className="text-rose-600" size={36} /> {t('admin.tenantsMaster')}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">{t('admin.oversight')}</p>
                </div>
            </div>
            
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('admin.companyName')}</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('admin.usersCount')}</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('admin.status')}</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('admin.platformModules')}</th>
                                <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('admin.rootActions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {companies.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="text-base font-black text-slate-900 uppercase tracking-tight">
                                            {currentLang === 'fr' ? c.name_fr : c.name_en}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-1">{t('admin.entityId')}: {c.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500 uppercase">
                                        <span className="text-slate-900">{c.user_count}</span> {t('admin.seats')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            c.subscription_status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                : 'bg-rose-50 text-rose-600 border border-rose-100'
                                        }`}>
                                            {t(`common.status.${c.subscription_status}`)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                                            {[
                                                // Nexus Modules
                                                { id: 'rca', icon: <Search size={14} />, label: t('nexus.rca.title') || 'RCA' },
                                                { id: 'fmea', icon: <Layers size={14} />, label: t('nexus.fmea.title') || 'FMEA' },
                                                { id: 'loto', icon: <ShieldAlert size={14} />, label: t('nexus.loto.title') || 'LOTO' },
                                                { id: 'calibration', icon: <Thermometer size={14} />, label: t('nexus.calibration.title') || 'Calibration' },
                                                { id: 'dms', icon: <FileText size={14} />, label: t('nexus.dms.title') || 'DMS' },
                                                { id: 'tpm', icon: <Settings2 size={14} />, label: t('nexus.tpm.title') || 'TPM' },
                                                { id: 'inventory', icon: <Box size={14} />, label: t('nexus.inventory.title') || 'Inventory' },
                                                { id: 'bim', icon: <Zap size={14} />, label: t('nexus.bim.title') || 'BIM' },
                                                { id: 'offline', icon: <Power size={14} />, label: t('nexus.offline.title') || 'Offline' },
                                                // Global Matrix Modules
                                                { id: 'safety', icon: <ShieldAlert size={14} />, label: t('roadmap.safety.title') },
                                                { id: 'iot', icon: <Cpu size={14} />, label: t('iot.title') },
                                                { id: 'predictive', icon: <BrainCircuit size={14} />, label: t('predictive.title') },
                                                { id: 'global', icon: <Globe size={14} />, label: t('global.title') },
                                                { id: 'warehouse', icon: <Package size={14} />, label: t('roadmap.warehouse.title') },
                                                { id: 'skills', icon: <Award size={14} />, label: t('roadmap.skills.title') },
                                                { id: 'ar', icon: <Eye size={14} />, label: t('nav.ar_workforce') },
                                                { id: 'command', icon: <Radio size={14} />, label: t('nav.command_center') },
                                                { id: 'twin', icon: <Boxes size={14} />, label: t('nav.digital_twin') },
                                                { id: 'hub', icon: <Link size={14} />, label: t('nav.integration_hub') },
                                                { id: 'esg', icon: <Leaf size={14} />, label: t('roadmap.esg.title') },
                                                { id: 'finance', icon: <DollarSign size={14} />, label: t('roadmap.finance.title') }
                                            ].map(mod => {
                                                let currentMods = c.enabled_modules;
                                                if (typeof currentMods === 'string') {
                                                    try { currentMods = JSON.parse(currentMods); } catch (e) { currentMods = []; }
                                                }
                                                if (!Array.isArray(currentMods)) {
                                                    currentMods = [];
                                                }
                                                return (
                                                <button
                                                    key={mod.id}
                                                    onClick={() => toggleModule(c.id, mod.id, currentMods)}
                                                    className={`p-2 rounded-xl transition-all border ${
                                                        currentMods.includes(mod.id)
                                                            ? 'bg-slate-950 text-yellow-500 border-slate-950 shadow-lg shadow-yellow-500/10'
                                                            : 'bg-white text-slate-300 border-slate-100 hover:border-slate-300 hover:text-slate-500 shadow-sm'
                                                    }`}
                                                    title={mod.label}
                                                >
                                                    {mod.icon}
                                                </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => setSelectedCompany(c)}
                                                    className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                    title={t('admin.viewProfile')}
                                                >
                                                    <Eye size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => forceSuspend(c.id, c.subscription_status)}
                                                    className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title={t('admin.toggleSuspension')}
                                                >
                                                    <Power size={20} />
                                                </button>
                                                <button 
                                                    className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                    title={t('admin.impersonateTenant')}
                                                >
                                                    <UserCheck size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
    
                {selectedCompany && createPortal(
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-fade-in">
                        <div className="bg-white rounded-[3rem] shadow-2xl border border-white/20 w-full max-w-2xl overflow-hidden animate-scale-in">
                            <div className="bg-slate-50 p-10 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                                        <Building2 className="text-rose-600" size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                            {t('admin.companyProfile')}
                                        </h3>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{t('admin.industrialNode')}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedCompany(null)}
                                    className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                            
                            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t('admin.companyName')}</p>
                                        <p className="text-xl font-black text-slate-900 uppercase italic">
                                            {currentLang === 'fr' ? selectedCompany.name_fr : selectedCompany.name_en}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{t('admin.industry')}</p>
                                        <p className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                                            {t(`marketing.industries.${selectedCompany.industry_en || 'manufacturing'}`)}
                                        </p>
                                    </div>
                                </div>
    
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-right md:text-left">{t('admin.status')}</p>
                                        <div className="flex justify-end md:justify-start gap-4">
                                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                selectedCompany.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                            }`}>
                                                {t(`common.status.${selectedCompany.subscription_status}`)}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-right md:text-left">{t('admin.operationalTier')}</p>
                                        <div className="flex justify-end md:justify-start gap-2">
                                            {['basic', 'pro', 'enterprise'].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => updatePlan(selectedCompany.id, p)}
                                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                        selectedCompany.plan === p 
                                                            ? 'bg-slate-950 text-yellow-500 border-slate-950 shadow-lg' 
                                                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-right md:text-left">{t('admin.registrationDate')}</p>
                                        <p className="text-slate-700 font-bold uppercase text-sm">
                                            {new Date(selectedCompany.created_at).toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
    
                                <div className="md:col-span-2 pt-8 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{t('admin.platformModules')}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(selectedCompany.enabled_modules) && selectedCompany.enabled_modules.length > 0 ? (
                                            selectedCompany.enabled_modules.map(mod => (
                                                <span key={mod} className="px-4 py-2 bg-slate-950 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/5 border border-white/5">
                                                    {mod}
                                                </span>
                                            ))
                                        ) : (
                                            <div className="p-6 bg-slate-50 rounded-2xl w-full text-center border border-dashed border-slate-200">
                                                <p className="text-slate-400 italic font-bold uppercase text-[10px] tracking-widest">{t('admin.zeroModules')}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
    
                            <div className="bg-slate-50 p-8 px-12 flex justify-end">
                                <button 
                                    onClick={() => setSelectedCompany(null)}
                                    className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-900 hover:text-white transition-all shadow-xl"
                                >
                                    {t('common.close')}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default AdminCompanies;
