import { useState, useEffect } from 'react';
import api from '../services/api/axiosConfig';
import { useTranslation } from 'react-i18next';
import { Truck, Ship, Globe, Anchor } from 'lucide-react';

const LogisticsTower = () => {
    const { t } = useTranslation();
    const [data, setData] = useState({
        shipments: [],
        portDelays: [],
        freightFlux: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/logistics/overview');
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error("Logistics Sync Failure", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && data.shipments.length === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* Header */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] [background-size:10px_10px] opacity-20"></div>
                        <Globe className="text-white w-12 h-12 group-hover:rotate-180 transition-transform duration-[3000ms]" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{t('logistics.title')}</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.4em] mt-2">{t('logistics.subtitle')}</p>
                    </div>
                </div>
                <div className="px-8 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-black text-xs uppercase tracking-widest flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    {t('logistics.trackingMatrix')}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 bg-slate-900 rounded-[4rem] p-4 relative overflow-hidden h-[600px] shadow-2xl border border-white/5">
                    {/* Global Logistics Visualizer */}
                    <div className="absolute inset-0 bg-slate-950">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>
                    </div>
                    
                    {/* Animated Shipment Dots */}
                    {data.shipments.map((s, idx) => (
                        <div 
                            key={s.id} 
                            className="absolute w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                            style={{ 
                                top: `${20 + (idx * 15)%60}%`, 
                                left: `${10 + (idx * 25)%80}%`,
                                animationDelay: `${idx * 0.5}s`
                            }}
                        ></div>
                    ))}

                    <div className="absolute top-10 left-10 z-10 flex gap-4">
                        <div className="p-4 bg-slate-950/80 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-3">
                            <Ship className="text-indigo-400" size={18} />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('logistics.globalMatrix')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm space-y-6 max-h-[400px] overflow-y-auto">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('logistics.liveShipments')}</h4>
                        <div className="space-y-6">
                            {data.shipments.length === 0 ? (
                                <p className="text-[10px] font-bold text-slate-300 italic uppercase">{t('logistics.noLiveTransits')}</p>
                            ) : data.shipments.map((order) => (
                                <div key={order.id} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <Truck className="text-slate-400 group-hover:text-white" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black uppercase text-slate-800 tracking-tight">{order.id.split('-')[0].toUpperCase()}</span>
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${order.status === 'received' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {order.status === 'received' ? t('common.status.completed') : t('logistics.enRoute')}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: order.status === 'received' ? '100%' : '65%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-indigo-950 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-950/20">
                        <div className="flex items-center gap-4">
                             <Anchor className="text-yellow-400" />
                             <h4 className="text-sm font-black uppercase tracking-widest">{t('logistics.portDelays')}</h4>
                        </div>
                        <div className="space-y-4">
                             {data.portDelays.map(port => (
                                 <div key={port.port} className="flex justify-between items-center border-b border-white/5 pb-2">
                                      <span className="text-[10px] font-bold text-white/40 uppercase">{port.port}</span>
                                      <span className={`font-black text-xs ${port.status === 'critical' ? 'text-rose-400' : port.status === 'caution' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                          {port.delay > 0 ? t('logistics.surgeSuffix', { hours: port.delay }) : t('logistics.nominal')}
                                      </span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default LogisticsTower;
