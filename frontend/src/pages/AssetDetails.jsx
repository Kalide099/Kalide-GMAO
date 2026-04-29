import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { Wrench, MapPin, Hash, ShieldCheck, Clock, BrainCircuit, Activity, ChevronLeft, Plus, History, Paperclip, File, Upload, ExternalLink } from 'lucide-react';

const AssetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [asset, setAsset] = useState(null);
    const [predictive, setPredictive] = useState(null);
    const [history, setHistory] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [assetRes, predRes, histRes, attachRes] = await Promise.all([
                api.get(`/assets/${id}`), 
                api.get(`/predictive/asset/${id}`),
                api.get(`/work-orders?assetId=${id}`),
                api.get(`/attachments?entity_type=asset&entity_id=${id}`)
            ]);

            setAsset(assetRes.data.data);
            setPredictive(predRes.data.data);
            setHistory(histRes.data.data);
            setAttachments(attachRes.data.data);
        } catch (err) {
            console.error("Payload synchronization failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">{t('common.loading')}...</div>;
    if (!asset) return <div className="p-10 text-center font-bold text-rose-500">{t('common.none')}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">{asset.name}</h1>
                        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">{asset.serial_number || t('assets.noSerialTag') || 'ST-000-XX'}</p>
                    </div>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> {t('assets.print_passport')}
                </button>
            </div>

            {/* Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">{t('predictive.healthScore')}</span>
                        <BrainCircuit className="text-indigo-400" />
                    </div>
                    <div>
                        <span className="text-6xl font-black">{predictive?.healthScore || '96'}%</span>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${predictive?.healthScore || 96}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('predictive.mtbf')}</span>
                        <Activity className="text-indigo-500" />
                    </div>
                    <div>
                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{predictive?.mtbf || '720'}</span>
                        <span className="ml-2 text-slate-400 font-bold uppercase text-xs">{t('predictive.hours')}</span>
                        <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">{t('predictive.mtbf')}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('predictive.mttr')}</span>
                        <Clock className="text-rose-500" />
                    </div>
                    <div>
                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{predictive?.mttr || '4.2'}</span>
                        <span className="ml-2 text-slate-400 font-bold uppercase text-xs">{t('predictive.hours')}</span>
                        <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">{t('predictive.mttr')}</p>
                    </div>
                </div>
            </div>

            {/* Asset Details Info */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                        <Wrench size={20} className="text-indigo-600" /> 
                        {t('workOrders.technicalSpecs')}
                    </h3>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('workOrders.operationalLocation')}</p>
                                <p className="text-lg font-bold text-slate-800">{asset.location || t('assets.centralSiteA')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Hash size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('workOrders.assetRef')}</p>
                                <p className="text-lg font-bold text-slate-800 font-mono tracking-tight">{asset.id}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className={`p-6 rounded-2xl flex items-center gap-4 border-2 ${
                            asset.status === 'active' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                            <ShieldCheck size={28} />
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('workOrders.digitalStatus')}</p>
                                <p className="text-xl font-black uppercase tracking-tighter">{t(`common.status.${asset.status}`)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 px-4">
                    <History size={24} className="text-indigo-600" /> 
                    {t('workOrders.maintenanceHistory')}
                </h3>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
                    {history.map(wo => (
                        <div key={wo.id} className="p-8 flex justify-between items-center group hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="text-lg font-black text-slate-800 tracking-tight">{wo.title}</p>
                                <p className="text-slate-400 text-sm font-medium mt-1">{new Date(wo.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                wo.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {t(`common.status.${wo.status}`)}
                            </span>
                        </div>
                    ))}
                    {history.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-bold italic">{t('workOrders.noHistory')}</div>
                    )}
                </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/10">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                        <Paperclip size={24} className="text-indigo-600" /> 
                        {t('common.attachments') || 'Documents Matrix'}
                    </h3>
                    <label className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-black transition-all flex items-center gap-2">
                        <Upload size={14} /> {t('common.upload') || 'Upload'}
                        <input 
                            type="file" 
                            className="hidden" 
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('entity_type', 'asset');
                                formData.append('entity_id', id);
                                
                                try {
                                    await api.post('/attachments/upload', formData);
                                    fetchData();
                                } catch (err) {
                                    alert("Synchronization Failed.");
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attachments.map(file => (
                        <div key={file.id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                           <div className="flex items-center gap-4">
                               <File className="text-slate-400 group-hover:text-indigo-600" size={20} />
                               <div>
                                   <p className="text-sm font-black text-slate-800 truncate max-w-[150px] uppercase italic tracking-tighter">{file.file_name}</p>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{(file.file_size / 1024).toFixed(1)} KB</p>
                               </div>
                           </div>
                           <a 
                                href={`${api.defaults.baseURL.replace('/api/v1', '')}/${file.file_path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-3 bg-white text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                           >
                               <ExternalLink size={16} />
                           </a>
                        </div>
                    ))}
                    {attachments.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">{t('common.noFiles') || 'Empty Vault'}</div>
                    )}
                </div>
            </div>

            {/* HIGH-FIDELITY PRINTABLE CERTIFICATE (HIDDEN ON SCREEN) */}
            <div className="hidden print:block print:p-10 bg-white min-h-screen text-slate-900 font-sans border-[12px] border-double border-slate-200 m-4 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={120} className="text-slate-900" />
                </div>
                
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600">{t('common.brandNameFull') || 'Kalide Global Industrial Intelligence'}</h1>
                    <h2 className="text-5xl font-black uppercase tracking-tighter">{t('workOrders.healthCertificate')}</h2>
                    <div className="h-1 w-24 bg-slate-900 mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-16">
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('workOrders.identifierSignature')}</p>
                            <p className="text-3xl font-black uppercase tracking-tight">{asset.name}</p>
                            <p className="font-mono text-sm text-slate-500">{asset.id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('workOrders.operationalLocation')}</p>
                            <p className="text-xl font-bold">{asset.location || t('assets.centralSiteA')}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                         <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase tracking-widest">{t('predictive.healthScore')}</span>
                            <span className="text-5xl font-black">{predictive?.healthScore || 96}%</span>
                         </div>
                         <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900" style={{ width: `${predictive?.healthScore || 96}%` }}></div>
                         </div>
                    </div>
                </div>

                <div className="space-y-6 mb-16">
                    <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-slate-100 pb-2">{t('workOrders.forensicMetrics')}</h3>
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('predictive.mtbf')}</p>
                            <p className="text-2xl font-black">{predictive?.mtbf || 720}h</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('predictive.mttr')}</p>
                            <p className="text-2xl font-black">{predictive?.mttr || 4.2}h</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t('admin.status')}</p>
                            <p className="text-2xl font-black uppercase">{t(`common.status.${asset.status}`)}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-20 border-t border-slate-100 flex justify-between items-center opacity-50 italic text-xs">
                    <p>{t('workOrders.verifiedBy')}</p>
                    <p>{t('workOrders.generatedOn')}: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Quick Actions Footer (Sticky on Mobile) */}
            <div className="fixed bottom-6 inset-x-6 z-40 lg:hidden print:hidden">
                <button 
                    onClick={() => navigate('/app/work-orders', { state: { assetId: asset.id }})}
                    className="w-full bg-slate-900 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-black text-lg tracking-tight active:scale-95 transition-all"
                >
                    <Plus size={24} /> {t('workOrders.dispatchMaintenance')}
                </button>
            </div>
        </div>
    );
};

export default AssetDetails;
