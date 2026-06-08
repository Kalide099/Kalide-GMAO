import { Wind, Activity, AlertOctagon, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NegativePressureIoT = () => {
    const { t } = useTranslation();

    const rooms = [
        { id: 'ISO-W1', ward: 'Infectious Disease', diff: -2.5, temp: 21, ach: 12, status: 'optimal' },
        { id: 'ISO-W2', ward: 'Infectious Disease', diff: -2.4, temp: 22, ach: 12, status: 'optimal' },
        { id: 'ISO-E4', ward: 'Emergency', diff: -0.5, temp: 24, ach: 6, status: 'critical' },
        { id: 'OR-7', ward: 'Surgical (Positive)', diff: 2.1, temp: 19, ach: 20, status: 'optimal' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-teal-950 p-10 rounded-[3rem] text-teal-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center border border-teal-500/30">
                        <Wind size={32} className="text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.negativepressureiot.isolation_ward_iot_1", "Isolation Ward IoT")}</h1>
                        <p className="text-teal-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.negativepressureiot.hvac_pressure_differentials_2", "HVAC Pressure Differentials")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">100%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.negativepressureiot.hepa_filter_integrity_3", "HEPA Filter Integrity")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><ShieldCheck size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.negativepressureiot.pressure_breach_alarm_4", "Pressure Breach Alarm")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertOctagon size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">12</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Avg ACH (Air Changes)</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Wind size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.negativepressureiot.live_room_telemetry_5", "Live Room Telemetry")}</h3>
                <div className="space-y-4">
                    {rooms.map((room, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-teal-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${room.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{room.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{room.ward}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Differential (Pa)</p>
                                    <p className={`font-black text-xs uppercase ${room.status === 'critical' ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>{room.diff} Pa</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.negativepressureiot.ach_6", "ACH")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{room.ach} / hr</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.negativepressureiot.temp_7", "Temp")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{room.temp}°C</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NegativePressureIoT;
