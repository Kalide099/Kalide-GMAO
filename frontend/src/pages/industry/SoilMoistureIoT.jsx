import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Thermometer, Zap, Activity, Radio, Map } from 'lucide-react';

const SoilMoistureIoT = () => {
    const { t } = useTranslation();
    const [sensors, setSensors] = useState([
        { id: 'S-101', location: 'Alpha North', moisture: 42, temp: 24, battery: 88, status: 'online' },
        { id: 'S-102', location: 'Alpha South', moisture: 38, temp: 24, battery: 92, status: 'online' },
        { id: 'S-103', location: 'Beta East', moisture: 15, temp: 26, battery: 45, status: 'warning' },
        { id: 'S-104', location: 'Beta West', moisture: 45, temp: 23, battery: 12, status: 'offline' }
    ]);

    // Simulate live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prev => prev.map(s => {
                if (s.status === 'offline') return s;
                const newMoisture = Math.max(10, Math.min(60, s.moisture + (Math.random() > 0.5 ? 1 : -1)));
                return { 
                    ...s, 
                    moisture: newMoisture,
                    status: newMoisture < 20 ? 'warning' : 'online'
                };
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const avgMoisture = Math.round(sensors.filter(s => s.status !== 'offline').reduce((acc, s) => acc + s.moisture, 0) / (sensors.filter(s => s.status !== 'offline').length || 1));

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            {/* Control Header */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
                                    <Droplets size={24} />
                                </div>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-300">{t("generated.pages.industry.soilmoistureiot.iot_mesh_active_1", "IoT Mesh Active")}</span>
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter italic">{t('nav.industry.soilIoT') || 'Soil Moisture Matrix'}</h1>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">{t("generated.pages.industry.soilmoistureiot.live_subsurface_telemetry_2", "Live Subsurface Telemetry")}</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.soilmoistureiot.global_average_3", "Global Average")}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black tracking-tighter text-blue-400">{avgMoisture}%</span>
                                </div>
                            </div>
                            <div className="w-px h-16 bg-white/10 hidden md:block"></div>
                            <button onClick={() => window.location.assign('/app/iot')} className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 flex items-center gap-2">
                                <Zap size={16} />{t("generated.pages.industry.soilmoistureiot.auto_irrigate_4", "Auto-Irrigate")}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sensors.map((sensor) => (
                    <div key={sensor.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        {/* Status Indicator */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${sensor.status === 'online' ? 'bg-emerald-500' : sensor.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{sensor.id}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                    <Map size={10} /> {sensor.location}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sensor.status === 'online' ? 'bg-emerald-50 text-emerald-600' : sensor.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                <Radio size={20} className={sensor.status === 'online' ? 'animate-pulse' : ''} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Moisture Bar */}
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                                    <span>{t("generated.pages.industry.soilmoistureiot.moisture_5", "Moisture")}</span>
                                    <span className={sensor.moisture < 20 ? 'text-rose-500' : 'text-slate-900'}>{sensor.moisture}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${sensor.moisture < 20 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${sensor.moisture}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                    <Thermometer size={16} className="text-amber-500 mb-1" />
                                    <span className="text-lg font-black text-slate-900">{sensor.temp}°C</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{t("generated.pages.industry.soilmoistureiot.temp_6", "Temp")}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                                    <Zap size={16} className={sensor.battery < 20 ? 'text-rose-500 mb-1' : 'text-emerald-500 mb-1'} />
                                    <span className={`text-lg font-black ${sensor.battery < 20 ? 'text-rose-500' : 'text-slate-900'}`}>{sensor.battery}%</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{t("generated.pages.industry.soilmoistureiot.battery_7", "Battery")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Recommendation Panel */}
            <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Activity size={32} />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-1">{t("generated.pages.industry.soilmoistureiot.nexus_ai_recommendation_8", "Nexus AI Recommendation")}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{t("generated.pages.industry.soilmoistureiot.sensors_in_9", "Sensors in")}<span className="font-bold text-slate-900">{t("generated.pages.industry.soilmoistureiot.beta_east_10", "Beta East")}</span> are reporting critical moisture drops (&lt; 20%). Based on the upcoming weather forecast (no rain for 4 days) and current crop stage, an immediate irrigation cycle of 15mm is recommended to prevent yield loss.
                    </p>
                </div>
                <button onClick={() => window.location.assign('/app/iot')} className="px-6 py-4 bg-slate-900 hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-lg shadow-slate-900/20 active:scale-95">{t("generated.pages.industry.soilmoistureiot.execute_plan_11", "Execute Plan")}</button>
            </div>
        </div>
    );
};

export default SoilMoistureIoT;
