import { Presentation, MonitorPlay, Lightbulb, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VisualMerchandisingCompliance = () => {
    const { t } = useTranslation();

    const displays = [
        { id: 'WIN-NY-01', type: 'Window Display', location: 'Fifth Ave', status: 'optimal', issue: 'None', lastAudit: 'Today' },
        { id: 'SIG-LA-04', type: 'Digital Signage', location: 'Melrose', status: 'critical', issue: 'Screen Dead', lastAudit: '2 Hrs Ago' },
        { id: 'LIT-TX-09', type: 'Showcase Lighting', location: 'Domain', status: 'warning', issue: 'Bulb Dim', lastAudit: 'Yesterday' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-rose-950 p-10 rounded-[3rem] text-rose-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-rose-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center border border-rose-500/30">
                        <Presentation size={32} className="text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.visualmerchandisingcompliance.merchandising_compliance_1", "Merchandising Compliance")}</h1>
                        <p className="text-rose-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.visualmerchandisingcompliance.retail_aesthetics_display_maintenance_2", "Retail Aesthetics & Display Maintenance")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">94%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.visualmerchandisingcompliance.global_audit_pass_rate_3", "Global Audit Pass Rate")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Search size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">1</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.visualmerchandisingcompliance.signage_outage_4", "Signage Outage")}</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><MonitorPlay size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">12</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.visualmerchandisingcompliance.pending_lighting_repairs_5", "Pending Lighting Repairs")}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Lightbulb size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.visualmerchandisingcompliance.active_asset_deficiencies_6", "Active Asset Deficiencies")}</h3>
                <div className="space-y-4">
                    {displays.map((display, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-rose-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${display.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : display.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {display.type.includes('Lighting') ? <Lightbulb size={20} /> : display.type.includes('Signage') ? <MonitorPlay size={20} /> : <Presentation size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{display.type}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{display.id} • {display.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.visualmerchandisingcompliance.issue_7", "Issue")}</p>
                                    <p className={`font-black text-xs uppercase ${display.status === 'critical' ? 'text-rose-600 animate-pulse' : display.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>{display.issue}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.visualmerchandisingcompliance.last_audit_8", "Last Audit")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{display.lastAudit}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VisualMerchandisingCompliance;
