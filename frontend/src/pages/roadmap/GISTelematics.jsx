import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, Truck, Fuel, Share2 } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import toast from 'react-hot-toast';

const GISTelematics = () => {
    const { t } = useTranslation();

    const handleGenericAction = async () => {
        try {
            const res = await api.post('/n/gistelematics', { action: 'Generic Action Executed', timestamp: new Date() });
            if(res.data.success) {
                toast.success('Route sent to asset autopilot.');
            }
        } catch (err) {
            toast.error('Failed to communicate with Nexus Backend');
        }
    };
        const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('satellite');
    
    useEffect(() => {
        const fetchFleet = async () => {
            try {
                const res = await api.get('/gis/fleet');
                if (res.data.success) setFleet(res.data.data);
            } catch (e) {
                console.error("GIS Sync Failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchFleet();
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-slate-300 italic animate-pulse tracking-widest uppercase italic">{t('roadmap.streaming_spatial_da', 'Streaming Spatial Data...')}</div>;

    const selectedAsset = fleet[0] || null;

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">{t('roadmap.gis.title')}</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-1 w-12 bg-indigo-600 rounded-full"></span>
                        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('roadmap.spatial_forensics', 'Spatial Forensics Intelligence')}</p>
                    </div>
                </div>
                <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => setViewMode('satellite')}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'satellite' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t('roadmap.satellite_view', 'Satellite View')}
                    </button>
                    <button 
                        onClick={() => setViewMode('terrain')}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'terrain' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        {t('roadmap.terrain_map', 'Terrain Map')}
                    </button>
                </div>
            </div>

            <div className="h-[750px] w-full bg-slate-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Map size={400} />
                </div>
                
                {/* Dynamic GPS Nodes */}
                {fleet.map((asset, i) => (
                    <div 
                        key={i}
                        className="absolute w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-slate-900 animate-bounce transition-all cursor-pointer hover:scale-110"
                        style={{ top: `${30 + (i * 15)}%`, left: `${40 + (i * 10)}%` }}
                    >
                        <Truck className={asset.status === 'active' ? 'text-indigo-600' : 'text-slate-400'} size={24} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                ))}
                
                {selectedAsset && (
                    <div className="absolute top-12 right-12 p-10 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/50 w-96 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{selectedAsset.asset_name}</span>
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic ${selectedAsset.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                                {selectedAsset.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.gis.fuel')}</p>
                                <p className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Fuel className="text-amber-500" size={16} /> {selectedAsset.fuel_level_percent}%
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('roadmap.coordinates', 'Coordinates')}</p>
                                <p className="text-[10px] font-black text-slate-900 mt-2">{selectedAsset.latitude}, {selectedAsset.longitude}</p>
                            </div>
                        </div>
                        <button onClick={() => handleGenericAction()} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-[10px] uppercase tracking-widest hover:bg-slate-800">
                            <Share2 size={16} /> {t('roadmap.trace_route_sync', 'Trace Route Sync')}
                        </button>
                    </div>
                )}

                <div className="absolute bottom-12 left-12 flex items-center gap-4 bg-slate-900/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-900">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t('roadmap.nominal_flow', 'Nominal Flow')}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div> {t('roadmap.inactive_node', 'Inactive Node')}
                    </div>
                </div>
            </div>

            
        </div>
    );
};


export default GISTelematics;
