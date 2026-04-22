import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { Wrench, Plus, Circle, MapPin, Hash, CheckCircle2, Globe, QrCode, X, ExternalLink, Trash2, Printer, Search, Upload } from 'lucide-react';

const Assets = () => {
    const { t } = useTranslation();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrAsset, setQrAsset] = useState(null);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [formData, setFormData] = useState({
        name_en: '',
        name_fr: '',
        description_en: '',
        description_fr: '',
        location: '',
        serialNumber: '',
        status: 'active'
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await api.get('/assets');
            if (response.data.success) {
                setAssets(response.data.data);
            }
        } catch (error) {
            console.error("Failed to load assets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const handleCreateAsset = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const response = await api.post('/assets', formData);
            if (response.data.success) {
                setIsModalOpen(false);
                setFormData({ name_en: '', name_fr: '', description_en: '', description_fr: '', location: '', serialNumber: '', status: 'active' });
                fetchAssets();
            }
        } catch (error) {
            const backendError = error.response?.data?.message || t('common.error');
            alert(`Error: ${backendError}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            const response = await api.delete(`/assets/${id}`);
            if (response.data.success) fetchAssets();
        } catch (err) {
            alert(t('assets.deletionFailed'));
        }
    };

    const renderStatusBadge = (status) => {
        const statusMap = {
            active: { label: t('assets.statusActive'), classes: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
            maintenance: { label: t('assets.statusMaintenance'), classes: 'bg-amber-50 text-amber-600 border-amber-100' },
            retired: { label: t('assets.statusRetired'), classes: 'bg-slate-50 text-slate-600 border-slate-100' }
        };
        const config = statusMap[status] || statusMap.active;
        return (
            <span className={`px-4 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-full border ${config.classes}`}>
                {config.label}
            </span>
        );
    };

    const filteredAssets = assets.filter(asset => {
        const name = (asset.name || asset.name_en || asset.name_fr || '').toLowerCase();
        const sn = (asset.serial_number || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || sn.includes(query);
    });

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4 uppercase italic">
                        <Wrench className="text-indigo-600" size={48} /> {t('assets.title')}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t('assets.assetSubtitle')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative group flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder={t('common.search') || "Search assets..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm font-bold text-slate-700"
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        {t('assets.addAsset')}
                    </button>

                    <label className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all shadow-sm">
                        <Upload className="w-5 h-5" />
                        {t('common.import') || 'Import'}
                        <input 
                            type="file" 
                            accept=".csv" 
                            className="hidden" 
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = async (event) => {
                                    const text = event.target.result;
                                    const lines = text.split('\n').filter(l => l.trim());
                                    const assetsToCreate = lines.slice(1).map(line => {
                                        const [name_en, name_fr, serialNumber, location] = line.split(',');
                                        return { name_en, name_fr, serialNumber, location, status: 'active' };
                                    });
                                    
                                    setLoading(true);
                                    try {
                                        for (const asset of assetsToCreate) {
                                            await api.post('/assets', asset);
                                        }
                                        alert(t('assets.sync_success'));
                                        fetchAssets();
                                    } catch (err) {
                                        alert(t('assets.sync_failed'));
                                        fetchAssets();
                                    }
                                };
                                reader.readAsText(file);
                            }}
                        />
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left order-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('assets.name')}</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('assets.status')}</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('assets.location')}</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">{t('common.loading')}...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredAssets.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
                                                <Wrench className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">{t('assets.noAssets')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAssets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <Wrench size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
                                                       {asset.name || asset.name_en || asset.name_fr}
                                                    </div>
                                                    {asset.serial_number && (
                                                        <div className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded inline-block">
                                                            SN: {asset.serial_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-center">
                                            {renderStatusBadge(asset.status)}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                                                    <MapPin size={14} />
                                                </div>
                                                {asset.location || '-'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => { setQrAsset(asset); setIsQrModalOpen(true); }}
                                                    className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                    title={t('assets.passport')}
                                                >
                                                    <QrCode size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(asset.id)}
                                                    className="p-3 bg-rose-50 text-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Asset Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{t('assets.add_title')}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{t('assets.initNewUnit') || 'Initialize New Industrial Unit'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={28} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateAsset} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={14} className="text-blue-500" /> {t('assets.field_name')} (EN)
                                    </label>
                                    <input 
                                        type="text" required
                                        value={formData.name_en}
                                        onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                                        className="w-full px-6 py-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={14} className="text-indigo-500" /> {t('assets.field_name')} (FR)
                                    </label>
                                    <input 
                                        type="text" required
                                        value={formData.name_fr}
                                        onChange={(e) => setFormData({...formData, name_fr: e.target.value})}
                                        className="w-full px-6 py-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-rose-500" /> {t('assets.field_location')}</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-6 py-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 focus:border-indigo-500 transition-all font-bold" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Hash size={14} className="text-amber-500" /> {t('assets.field_serial')}</label>
                                    <input type="text" value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} className="w-full px-6 py-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 focus:border-indigo-500 transition-all font-bold" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('assets.field_status')}</label>
                                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-6 py-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 focus:border-indigo-500 transition-all font-bold appearance-none">
                                    <option value="active">{t('assets.statusActive')}</option>
                                    <option value="maintenance">{t('assets.statusMaintenance')}</option>
                                    <option value="retired">{t('assets.statusRetired')}</option>
                                </select>
                            </div>
                            <div className="flex gap-6 pt-10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 border border-slate-200 text-slate-600 font-bold rounded-[1.5rem] hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">{t('common.cancel')}</button>
                                <button type="submit" disabled={formLoading} className="flex-1 px-8 py-5 bg-slate-950 text-yellow-400 font-black rounded-[1.5rem] shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-widest text-xs border border-white/5">{formLoading ? '...' : t('assets.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Passport Modal */}
            {isQrModalOpen && qrAsset && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in text-center">
                    <div className="bg-white rounded-[4rem] w-full max-w-sm shadow-2xl space-y-10 animate-scale-in overflow-hidden border border-white/10">
                        <div className="bg-slate-50 p-10 border-b border-slate-100 flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                                <QrCode className="text-indigo-600" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{t('assets.passport')}</h3>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">{t('assets.cryptoIdentity') || 'Cryptographic Unit Identity'}</p>
                        </div>
                        
                        <div className="px-10 pb-10 space-y-10">
                            <div className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 flex flex-col items-center shadow-inner">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${window.location.origin}/app/assets/${qrAsset.id}`} alt="QR" className="w-40 h-40 rounded-2xl shadow-2xl border border-white/50" />
                                <div className="mt-8">
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{qrAsset.name || qrAsset.name_en || qrAsset.name_fr}</p>
                                    <p className="text-slate-400 font-mono text-[10px] mt-1 tracking-widest">{qrAsset.serial_number || t('assets.noSerialTag') || 'NO-SERIAL-TAG'}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => window.print()} className="py-5 bg-slate-950 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3"><Printer size={16} /> {t('assets.printTag') || 'Print'}</button>
                                <button onClick={() => window.open(`/app/assets/${qrAsset.id}`, '_blank')} className="py-5 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center justify-center gap-3"><ExternalLink size={16} /> {t('assets.openMobile') || 'Mobile'}</button>
                            </div>
                            
                            <button onClick={() => setIsQrModalOpen(false)} className="w-full py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors uppercase">{t('common.close')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assets;
