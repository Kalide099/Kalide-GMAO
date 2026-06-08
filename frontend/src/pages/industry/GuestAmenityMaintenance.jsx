import { Coffee, Droplets, ArrowDownUp, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GuestAmenityMaintenance = () => {
    const { t } = useTranslation();

    const amenities = [
        { id: 'POOL-MAIN', type: 'Swimming Pool', status: 'optimal', metric: 'Chlorine: 2.0 ppm', issue: 'None' },
        { id: 'ELEV-A', type: 'Guest Elevator', status: 'warning', metric: 'Uptime: 99.1%', issue: 'Slow Doors' },
        { id: 'SPA-HOT', type: 'Hot Tub', status: 'critical', metric: 'Temp: 32°C', issue: 'Heater Failure' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-pink-950 p-10 rounded-[3rem] text-pink-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-pink-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center border border-pink-500/30">
                        <Coffee size={32} className="text-pink-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.guestamenitymaintenance.guest_amenities_1", "Guest Amenities")}</h1>
                        <p className="text-pink-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.guestamenitymaintenance.facility_equipment_maintenance_2", "Facility & Equipment Maintenance")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">99.8%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.guestamenitymaintenance.elevator_uptime_3", "Elevator Uptime")}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><ArrowDownUp size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Critical Outage (Spa)</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><AlertCircle size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.guestamenitymaintenance.12m_4", "12m")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.guestamenitymaintenance.avg_wo_response_5", "Avg WO Response")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Clock size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.guestamenitymaintenance.amenity_diagnostics_6", "Amenity Diagnostics")}</h3>
                <div className="space-y-4">
                    {amenities.map((amenity, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-pink-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${amenity.status === 'optimal' ? 'bg-blue-50 text-blue-600' : amenity.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {amenity.type.includes('Pool') || amenity.type.includes('Tub') ? <Droplets size={20} /> : <ArrowDownUp size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{amenity.type}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{amenity.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.guestamenitymaintenance.telemetry_7", "Telemetry")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{amenity.metric}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.guestamenitymaintenance.status_8", "Status")}</p>
                                    <p className={`font-black text-xs uppercase ${amenity.status === 'critical' ? 'text-rose-600 animate-pulse' : amenity.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>{amenity.issue}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuestAmenityMaintenance;
