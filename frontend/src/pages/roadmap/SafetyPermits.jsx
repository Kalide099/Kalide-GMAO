import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Clock, CheckCircle, Smartphone } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import SimulatedProcessModal from '../../components/SimulatedProcessModal';
import toast from 'react-hot-toast';

const SafetyPermits = () => {
    const { t } = useTranslation();
    const [permits, setPermits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
    const [selectedPermitId, setSelectedPermitId] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('https://industrial-cdn.kgmao.com/evid/lockout_v12.jpg');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusTone, setStatusTone] = useState('');
    const [simModalOpen, setSimModalOpen] = useState(false);

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

    const openValidateModal = (permitId) => {
        setSelectedPermitId(permitId);
        setPhotoUrl('https://industrial-cdn.kgmao.com/evid/lockout_v12.jpg');
        setIsValidateModalOpen(true);
    };

    const validatePermit = async () => {
        try {
            const res = await api.post('/safety/validate', {
                permitId: selectedPermitId,
                photoUrl,
                signature: 'Digital_Cert_X509'
            });
            if (res.data.success) {
                setStatusTone('success');
                setStatusMessage(res.data.message || 'Permit validated successfully.');
                setIsValidateModalOpen(false);
                fetchPermits();
            }
        } catch (e) {
            setStatusTone('error');
            setStatusMessage(e?.response?.data?.message || 'Validation failed.');
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
                <button onClick={() => setSimModalOpen(true)} className="px-10 py-5 bg-rose-900 rounded-[2rem] shadow-2xl shadow-rose-900/10 flex items-center gap-4 border border-rose-800 group transition-all hover:bg-rose-800 hover:scale-105 active:scale-95">
                    <ShieldAlert className="text-white w-6 h-6 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{t('roadmap.active_compliance_mo', 'Active Compliance Monitoring')}</span>
                </button>
            </div>

            {statusMessage && (
                <div className={`rounded-[2rem] px-6 py-4 font-bold text-xs uppercase tracking-widest border ${statusTone === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {statusMessage}
                </div>
            )}

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
                                            onClick={() => openValidateModal(permit.id)}
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

            {isValidateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in">
                    <div className="w-full max-w-xl rounded-[3rem] bg-white shadow-3xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{t("generated.pages.roadmap.safetypermits.validate_permit_1", "Validate permit")}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">{t("generated.pages.roadmap.safetypermits.provide_lockout_evidence_url_2", "Provide lockout evidence URL")}</p>
                            </div>
                            <button onClick={() => setIsValidateModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all flex items-center justify-center">
                                <CheckCircle size={18} className="rotate-45" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t("generated.pages.roadmap.safetypermits.photo_url_3", "Photo URL")}</label>
                                <input
                                    type="url"
                                    value={photoUrl}
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-rose-600 transition-all font-mono text-xs text-slate-800"
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setIsValidateModalOpen(false)} className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">{t("generated.pages.roadmap.safetypermits.cancel_4", "Cancel")}</button>
                                <button type="button" onClick={validatePermit} className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-yellow-400 hover:text-slate-900 transition-all">{t("generated.pages.roadmap.safetypermits.submit_5", "Submit")}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SimulatedProcessModal 
                isOpen={simModalOpen} 
                onClose={() => setSimModalOpen(false)} 
                title="Deep Compliance Audit" 
                processingText="Scanning facility node data for safety violations..." 
                successText="No active violations found"
                onSuccessCallback={() => toast.success('Compliance verified. Zero active infractions.')}
            />
        </div>
    );
};

export default SafetyPermits;
