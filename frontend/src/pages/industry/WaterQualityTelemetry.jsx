import { Droplet, Activity, AlertTriangle, ShieldAlert, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WaterQualityTelemetry = () => {
    const { t } = useTranslation();

    const sensors = [
        { id: 'WQ-N1', zone: 'North River', ph: '7.2', turbidity: '2.4 NTU', status: 'optimal' },
        { id: 'WQ-S4', zone: 'South Lake', ph: '6.4', turbidity: '8.1 NTU', status: 'warning' },
        { id: 'WQ-E2', zone: 'East Estuary', ph: '4.8', turbidity: '15.2 NTU', status: 'critical' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-emerald-950 p-10 rounded-[3rem] text-emerald-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-emerald-900/50">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                        <Waves size={32} className="text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.waterqualitytelemetry.water_quality_telemetry_1", "Water Quality Telemetry")}</h1>
                        <p className="text-emerald-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.waterqualitytelemetry.effluent_ph_iot_monitoring_2", "Effluent & pH IoT Monitoring")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">7.1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.waterqualitytelemetry.global_avg_ph_3", "Global Avg pH")}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Droplet size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Acidic Breach (East)</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertTriangle size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.waterqualitytelemetry.8_5_ntu_4", "8.5 NTU")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.waterqualitytelemetry.avg_turbidity_5", "Avg Turbidity")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Activity size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.waterqualitytelemetry.live_sensor_matrix_6", "Live Sensor Matrix")}</h3>
                <div className="space-y-4">
                    {sensors.map((sensor, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-emerald-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sensor.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : sensor.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {sensor.status === 'optimal' ? <Droplet size={20} /> : <ShieldAlert size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{sensor.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sensor.zone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.waterqualitytelemetry.ph_level_7", "pH Level")}</p>
                                    <p className={`font-black text-xs uppercase ${sensor.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{sensor.ph}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.waterqualitytelemetry.turbidity_8", "Turbidity")}</p>
                                    <p className={`font-black text-xs uppercase ${sensor.status !== 'optimal' ? 'text-amber-600' : 'text-slate-900'}`}>{sensor.turbidity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WaterQualityTelemetry;
