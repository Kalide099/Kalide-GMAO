import { Shield, Activity, FileCheck, AlertTriangle, Syringe, Cross, Thermometer, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MedicalEquipmentCompliance = () => {
    const { t } = useTranslation();
    const equipment = [
        { id: 'MRI-01', name: 'Siemens Magnetom', dept: 'Radiology', status: 'compliant', nextCal: '2026-08-12', risk: 'critical' },
        { id: 'XRAY-04', name: 'GE Optima', dept: 'Emergency', status: 'warning', nextCal: '2026-06-15', risk: 'high' },
        { id: 'VENT-12', name: 'Puritan Bennett', dept: 'ICU', status: 'non-compliant', nextCal: '2026-05-30', risk: 'critical' },
        { id: 'DEFIB-09', name: 'Zoll X Series', dept: 'Cardiology', status: 'compliant', nextCal: '2026-11-22', risk: 'high' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="bg-rose-950 p-10 rounded-[3rem] text-rose-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                        <Cross size={32} className="text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.medicalequipmentcompliance.medical_compliance_matrix_1", "Medical Compliance Matrix")}</h1>
                        <p className="text-rose-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.medicalequipmentcompliance.fda_iso_13485_calibration_tracking_2", "FDA & ISO 13485 Calibration Tracking")}</p>
                    </div>
                </div>
                <div className="relative z-10 bg-rose-900/50 p-4 rounded-2xl border border-rose-800 flex items-center gap-4">
                    <Shield className="text-emerald-400" size={24} />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">{t("generated.pages.industry.medicalequipmentcompliance.hospital_compliance_score_3", "Hospital Compliance Score")}</p>
                        <p className="text-2xl font-black text-white">92.4%</p>
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Activity size={24} /></div>
                    <div>
                        <h4 className="text-2xl font-black text-slate-900">1,244</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.medicalequipmentcompliance.active_assets_4", "Active Assets")}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><AlertTriangle size={24} /></div>
                    <div>
                        <h4 className="text-2xl font-black text-rose-600">3</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.medicalequipmentcompliance.critical_past_due_5", "Critical Past Due")}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                    <div>
                        <h4 className="text-2xl font-black text-amber-600">12</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.medicalequipmentcompliance.due_in_30_days_6", "Due in 30 Days")}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FileCheck size={24} /></div>
                    <div>
                        <h4 className="text-2xl font-black text-emerald-600">100%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("generated.pages.industry.medicalequipmentcompliance.sanitation_logs_7", "Sanitation Logs")}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Equipment List */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{t("generated.pages.industry.medicalequipmentcompliance.critical_calibrations_8", "Critical Calibrations")}</h3>
                        <button onClick={() => window.location.assign('/app/reports')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">{t("generated.pages.industry.medicalequipmentcompliance.export_fda_report_9", "Export FDA Report")}</button>
                    </div>
                    <div className="space-y-4">
                        {equipment.map(eq => (
                            <div key={eq.id} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${eq.status === 'compliant' ? 'bg-emerald-500' : eq.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm uppercase">{eq.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{eq.id} • {eq.dept}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.medicalequipmentcompliance.next_calibration_10", "Next Calibration")}</p>
                                    <p className={`font-black ${eq.status === 'non-compliant' ? 'text-rose-600' : 'text-slate-900'}`}>{eq.nextCal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bio-Hazard & Sanitation */}
                <div className="bg-slate-50 rounded-[3rem] border border-slate-200 p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <Syringe className="text-indigo-500" />
                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{t("generated.pages.industry.medicalequipmentcompliance.sanitation_logs_11", "Sanitation Logs")}</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-black text-slate-900 uppercase">{t("generated.pages.industry.medicalequipmentcompliance.or_1_sterilization_12", "OR-1 Sterilization")}</span>
                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md uppercase">{t("generated.pages.industry.medicalequipmentcompliance.cleared_13", "Cleared")}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{t("generated.pages.industry.medicalequipmentcompliance.last_cycle_completed_2_hours_ago_uv_c_logs_verif_14", "Last cycle completed 2 hours ago. UV-C logs verified.")}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-black text-slate-900 uppercase">{t("generated.pages.industry.medicalequipmentcompliance.bio_hazard_disposal_15", "Bio-Hazard Disposal")}</span>
                                <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase">{t("generated.pages.industry.medicalequipmentcompliance.pending_16", "Pending")}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">{t("generated.pages.industry.medicalequipmentcompliance.scheduled_pickup_for_ward_b_isolation_units_at_1_17", "Scheduled pickup for Ward B isolation units at 14:00.")}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-black text-slate-900 uppercase">{t("generated.pages.industry.medicalequipmentcompliance.vaccine_cold_chain_18", "Vaccine Cold Chain")}</span>
                                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md uppercase">{t("generated.pages.industry.medicalequipmentcompliance.stable_19", "Stable")}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                <Thermometer size={14} /> 2.4°C (Normal)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalEquipmentCompliance;
