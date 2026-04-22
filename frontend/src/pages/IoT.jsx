import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { Activity, Zap, Thermometer, Waves, ShieldCheck, AlertCircle, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

const IoT = () => {
    const { t } = useTranslation();
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [telemetry, setTelemetry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);

    const [history, setHistory] = useState([]);

    const fetchData = async () => {
        try {
            const res = await api.get('/assets');
            if (res.data.success) {
                setAssets(res.data.data);
                if (res.data.data.length > 0 && !selectedAsset) {
                    setSelectedAsset(res.data.data[0]);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTelemetry = async () => {
        if (!selectedAsset) return;
        try {
            const res = await api.get(`/iot/asset/${selectedAsset.id}`);
            if (res.data.success) {
                setTelemetry(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        if (!selectedAsset) return;
        try {
            const res = await api.get(`/iot/history/${selectedAsset.id}`);
            if (res.data.success) setHistory(res.data.data);
        } catch (e) { console.warn("History stream silent."); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchTelemetry();
        fetchHistory();
        const interval = setInterval(() => {
            fetchTelemetry();
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedAsset]);

    const handleSimulate = async () => {
        setSimulating(true);
        try {
            await api.post('/iot/simulate');
            fetchTelemetry();
            fetchHistory();
        } catch (err) {
            alert(t('iot.simulationFailed'));
        } finally {
            setSimulating(false);
        }
    };

    if (loading) return <div className="p-12 text-center font-bold text-slate-400">{t('common.loading')}</div>;

    const renderSparkline = (type) => {
        const data = history.filter(h => h.sensor_type === type).slice(0, 20).reverse();
        if (data.length < 2) return null;
        const max = Math.max(...data.map(d => Number(d.reading_value)));
        const min = Math.min(...data.map(d => Number(d.reading_value)));
        const range = max - min || 1;
        
        return (
            <div className="flex items-end gap-1 h-12 mt-4">
                {data.map((d, i) => {
                    const height = ((Number(d.reading_value) - min) / range) * 100;
                    return (
                        <div 
                            key={i} 
                            className={`flex-1 rounded-t-sm transition-all duration-500 ${type === 'temperature' ? 'bg-indigo-400/30' : 'bg-emerald-400/30'}`}
                            style={{ height: `${Math.max(10, height)}%` }}
                        ></div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-20">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <Zap className="text-white w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter uppercase">{t('iot.title')}</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">{t('iot.subtitle')}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSimulate}
                        disabled={simulating}
                        className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all disabled:opacity-50 active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${simulating ? 'animate-spin' : ''}`} />
                        {simulating ? t('common.loading') : t('iot.simulate')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Left: Global Site Map Widget */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Layers size={14} className="text-indigo-600" /> {t('iot.siteMap')}
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {Array.from({ length: 16 }).map((_, i) => {
                                const assetAtPos = assets[i];
                                return (
                                    <div 
                                        key={i} 
                                        title={assetAtPos?.name || t('iot.emptyBay')}
                                        onClick={() => assetAtPos && setSelectedAsset(assetAtPos)}
                                        className={`aspect-square rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                                            selectedAsset?.id === assetAtPos?.id 
                                                ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-100' 
                                                : assetAtPos ? 'bg-slate-50 border-slate-100 hover:border-indigo-200' : 'bg-slate-50/30 border-dashed border-slate-100'
                                        }`}
                                    >
                                        {assetAtPos && <div className={`w-2 h-2 rounded-full ${selectedAsset?.id === assetAtPos?.id ? 'bg-white' : 'bg-indigo-400'}`}></div>}
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-6 font-bold uppercase text-center italic tracking-widest">{t('iot.fleetGrid')}</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4 shadow-sm">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('iot.active')}</span>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('nav.assets')}</h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {assets.map(asset => (
                                <button
                                    key={asset.id}
                                    onClick={() => setSelectedAsset(asset)}
                                    className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${
                                        selectedAsset?.id === asset.id 
                                            ? 'bg-indigo-50 text-indigo-600 shadow-inner' 
                                            : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <span className="font-bold tracking-tight text-left truncate text-[10px] uppercase tracking-[0.2em] leading-none">
                                        {asset.name || asset.name_en || asset.name_fr}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Intelligence Panels */}
                <div className="xl:col-span-3 space-y-8">
                    {selectedAsset ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                                    <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{t('iot.tempCore')}</h4>
                                    <div className="flex items-end gap-3">
                                        <span className="text-6xl font-black text-slate-800 tracking-tighter">
                                            {telemetry.find(t => t.sensor_type === 'temperature')?.reading_value 
                                                ? Number(telemetry.find(t => t.sensor_type === 'temperature').reading_value).toFixed(1) 
                                                : "68.2"}
                                        </span>
                                        <span className="text-2xl font-black text-indigo-400 mb-2">{t('iot.celsius')}</span>
                                    </div>
                                    {renderSparkline('temperature')}
                                    <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                                        <ShieldCheck size={16} /> <span>{t('iot.synchronized')}</span>
                                    </div>
                                </div>

                                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                                    <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4">{t('iot.vibrationAnalysis')}</h4>
                                    <div className="flex items-end gap-3">
                                        <span className="text-6xl font-black text-slate-800 tracking-tighter">
                                           {telemetry.find(t => t.sensor_type === 'vibration')?.reading_value 
                                                ? Number(telemetry.find(t => t.sensor_type === 'vibration').reading_value).toFixed(2) 
                                                : "0.24"}
                                        </span>
                                        <span className="text-2xl font-black text-indigo-400 mb-2">{t('iot.mmPerSec')}</span>
                                    </div>
                                    {renderSparkline('vibration')}
                                    <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                                        <ShieldCheck size={16} /> <span>{t('iot.stable')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                                        <Activity className="text-indigo-600" /> {t('iot.liveFeed')}
                                    </h3>
                                    <span className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
                                        {t('iot.active')}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 uppercase text-[10px] font-black text-slate-400 tracking-[0.2em] border-b border-slate-100">
                                            <tr>
                                                <th className="px-10 py-6">{t('iot.sensorType')}</th>
                                                <th className="px-10 py-6">{t('iot.reading')}</th>
                                                <th className="px-10 py-6">{t('iot.timestamp')}</th>
                                                <th className="px-10 py-6">{t('iot.status')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {telemetry.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-10 py-6 font-black text-slate-700 uppercase text-[10px] tracking-widest">{log.sensor_type}</td>
                                                    <td className="px-10 py-6 font-mono font-bold text-slate-900">{Number(log.reading_value).toFixed(4)}</td>
                                                    <td className="px-10 py-6 text-slate-500 text-sm font-medium">{new Date(log.recorded_at).toLocaleTimeString()}</td>
                                                    <td className="px-10 py-6">
                                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 size={12} /> {t('iot.syncOk')}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-32 rounded-[3.5rem] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                           <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 border-4 border-white shadow-inner">
                                <Activity size={64} className="text-slate-100" />
                           </div>
                           <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{t('iot.siteMatrix')}</h3>
                           <p className="text-slate-500 mt-4 max-w-sm font-medium text-lg leading-relaxed">{t('iot.selectTwin')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IoT;
