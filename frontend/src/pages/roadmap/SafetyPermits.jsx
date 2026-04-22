import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, FileCheck, Camera, ShieldX, Clock, CheckCircle, Smartphone } from 'lucide-react';
import api from '../../services/api/axiosConfig';

const SafetyPermits = () => {
    const { t } = useTranslation();
    const [permits, setPermits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPermits = async () => {
        try {
            const res = await api.get('/safety/pending');
            if (res.data.success) setPermits(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermits();
    }, []);

    const validatePermit = async (permitId) => {
        const photoUrl = prompt("Industrial Evidence: Enter LOTO Photo URL (for demo):", "https://industrial-cdn.kgmao.com/evid/lockout_v12.jpg");
        if (!photoUrl) return;

        try {
            const res = await api.post('/safety/validate', {
                permitId,
                photoUrl,
                signature: 'Digital_Cert_X509'
            });
            if (res.data.success) {
                alert(res.data.message);
                fetchPermits();
            }
        } catch (e) {
            alert("Validation failed.");
        }
    };

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">{t('roadmap.safety.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-rose-500 rounded-full"></span>
                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('roadmap.safety.permitSubtitle')}</p>
                    </div>
                </div>
                <div className="px-10 py-5 bg-rose-900 rounded-[2rem] shadow-2xl shadow-rose-900/10 flex items-center gap-4 border border-rose-800 group transition-all">
                    <ShieldAlert className="text-white w-6 h-6 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t('roadmap.active_compliance_mo', 'Active Compliance Monitoring')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic flex items-center gap-3">
                        <Clock className="text-rose-500" /> {t('roadmap.pending_work_authori', 'Pending Work Authorizations')}
                    </h2>
                    
                    <div className="space-y-4">
                        {loading ? (
                            <div className="p-20 text-center font-bold text-slate-300 italic">{t('roadmap.syncing_forensic_dat', 'Syncing Forensic Data...')}</div>
                        ) : permits.length === 0 ? (
                            <div className="p-20 bg-slate-50 rounded-[3rem] text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">{t('roadmap.all_active_assets_ar', 'All active assets are verified & compliant.')}</p>
                            </div>
                        ) : (
                            permits.map(permit => (
                                <div key={permit.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-center gap-8 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{permit.priority} Criticality</p>
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{permit.asset_name}</h3>
                                            <p className="text-xs text-slate-400 font-medium">LOTO ID: {permit.id.substring(0,8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => validatePermit(permit.id)}
                                            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 hover:text-slate-900 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10"
                                        >
                                            <CheckCircle size={14} /> {t('roadmap.validate_unlock', 'Validate & Unlock')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic">{t('roadmap.safety.checklist')}</h2>
                    <div className="bg-slate-900 p-10 rounded-[3rem] space-y-6 shadow-2xl">
                        {[
                            'Electrical Isolation Verified',
                            'Hydraulic Pressure Purged',
                            'Physical Hub Consigned',
                            'Ambient Gas Levels Nominal'
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-6 h-6 rounded-lg border-2 border-white/20 flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors">
                                    <CheckCircle size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[4rem] p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px]"></div>
                <div className="relative z-10 space-y-8">
                    <Clock className="mx-auto text-rose-500" size={48} />
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t('roadmap.forensic_compliance', 'Forensic Compliance Stream')}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed uppercase tracking-widest text-xs">
                        {t('roadmap.all_safety_permits_a', 'All safety permits are cryptographically linked to work orders, creating a legally-defensible audit trail for high-risk industrial environments.')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyPermits;
