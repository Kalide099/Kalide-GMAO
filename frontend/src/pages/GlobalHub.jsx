import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MapPin, Activity, Package, Building2 } from 'lucide-react';
import api from '../services/api/axiosConfig';

const GlobalHub = () => {
    const { t } = useTranslation();
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSites = async () => {
        try {
            const res = await api.get('/sites');
            if (res.data.success) {
                setFacilities(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedFacility(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error("GIS Synchronization Terminal Failure:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSites();
    }, []);

    const handleOpenDetails = () => {
        if (!selectedFacility) return;
        const query = encodeURIComponent(selectedFacility.name || selectedFacility.city || 'Facility');
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">{t('common.loading')}...</div>;

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Map Header */}
            <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-teal-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-teal-200">
                        <Globe className="text-white w-12 h-12 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter uppercase mb-2">{t('global.title')}</h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">{t('global.subtitle')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        {facilities.length} {t('global.clustersActive')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* World Map SVG Container */}
                <div className="lg:col-span-3 bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden h-[600px] border border-white/5">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    
                    {/* SVG World Projection (Abstract) */}
                    <svg className="w-full h-full opacity-30 fill-indigo-500/20 stroke-indigo-500/30" viewBox="0 0 1000 500">
                        <path d="M150,150 Q200,100 250,150 T350,150" fill="none" strokeWidth="2" strokeDasharray="5,5" />
                        {/* Simplistic Continent Shapes */}
                        <rect x="200" y="150" width="150" height="200" rx="40" />
                        <rect x="450" y="100" width="120" height="150" rx="30" />
                        <rect x="750" y="180" width="150" height="220" rx="50" />
                    </svg>

                    {/* Facility Plotters */}
                    {facilities.map(facility => (
                        <div 
                            key={facility.id}
                            style={{ left: facility.x, top: facility.y }}
                            onClick={() => setSelectedFacility(facility)}
                            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        >
                            <div className="relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-125 border-4 border-slate-900 ${
                                    facility.status === 'optimal' ? 'bg-emerald-500' : 
                                    facility.status === 'caution' ? 'bg-amber-500' : 'bg-rose-500'
                                }`}>
                                    <MapPin size={14} className="text-white" />
                                </div>
                                <div className={`absolute -inset-4 rounded-full animate-ping opacity-20 ${
                                    facility.status === 'optimal' ? 'bg-emerald-500' : 
                                    facility.status === 'caution' ? 'bg-amber-500' : 'bg-rose-500'
                                }`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Sidebar */}
                <div className="space-y-8 h-full">
                    {selectedFacility ? (
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 animate-fade-in-right">
                             <div className="space-y-2">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                     selectedFacility.status === 'optimal' ? 'bg-emerald-50 text-emerald-700' :
                                     selectedFacility.status === 'caution' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                                }`}>
                                   {selectedFacility.status} {t('global.node')}
                                </span>
                                <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">{selectedFacility.city || selectedFacility.name.split(',')[0]}</h2>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">{selectedFacility.name}</p>
                             </div>

                             <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                                    <span>{t('global.clusterHealth')}</span>
                                    <span>{Math.round(selectedFacility.health)}%</span>
                                </div>
                                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                                     <div className={`h-full rounded-full transition-all duration-1000 ${
                                         selectedFacility.health > 90 ? 'bg-emerald-500' :
                                         selectedFacility.health > 80 ? 'bg-amber-500' : 'bg-rose-500'
                                     }`} style={{ width: `${selectedFacility.health}%` }}></div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                                    <Activity size={24} className="text-indigo-600 mx-auto mb-2" />
                                    <span className="block text-xl font-black text-slate-800">12</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('global.activeThreads')}</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl text-center">
                                    <Package size={24} className="text-emerald-600 mx-auto mb-2" />
                                    <span className="block text-xl font-black text-slate-800">{selectedFacility.assetCount || 0}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('global.assetsLinked')}</span>
                                </div>
                             </div>

                                      <button onClick={handleOpenDetails} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all">
                                {t('global.openDetails')}
                             </button>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-inner">
                                <Building2 size={42} className="text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('global.selectCluster')}</h3>
                            <p className="text-slate-400 mt-4 max-w-[200px] text-sm font-medium">{t('global.syncInstructions')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalHub;
