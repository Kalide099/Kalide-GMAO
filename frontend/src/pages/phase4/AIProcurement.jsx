import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, TrendingDown, DollarSign, Package, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
const AIProcurement = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [logs] = useState([
        { id: 1, time: '10:42 AM', action: 'Low stock detected for [SKU-992: HVAC Filters]', agent: 'Predictive Engine' },
        { id: 2, time: '10:43 AM', action: 'Initiated negotiation with 3 pre-approved vendors.', agent: 'Procurement AI' },
        { id: 3, time: '10:45 AM', action: 'Vendor B offered 12% bulk discount with guaranteed 24hr delivery.', agent: 'Supplier API' },
        { id: 4, time: '10:46 AM', action: 'Counter-offered 15% discount for 6-month contract.', agent: 'Procurement AI' },
        { id: 5, time: '10:48 AM', action: 'Vendor B accepted. Auto-generated PO #99412.', agent: 'Supplier API' },
    ]);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                    <Bot className="w-5 h-5 animate-bounce" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t("generated.pages.phase4.aiprocurement.phase_4_autonomy_1", "Phase 4 Autonomy")}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{t("generated.pages.phase4.aiprocurement.autonomous_supplier_negotiation_2", "Autonomous Supplier Negotiation")}</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">{t("generated.pages.phase4.aiprocurement.ai_driven_procurement_engine_the_system_automati_3", "AI-driven procurement engine. The system automatically detects predicted stockouts, connects to vendor APIs, negotiates pricing based on SLAs, and issues purchase orders.")}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-xl shadow-indigo-500/20">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">AI Savings (MTD)</p>
                            <h3 className="text-4xl font-black tracking-tighter mt-2">$24,500</h3>
                        </div>
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("generated.pages.phase4.aiprocurement.auto_negotiated_pos_4", "Auto-Negotiated POs")}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">142</h3>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl">
                            <Package className="w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("generated.pages.phase4.aiprocurement.sla_compliance_5", "SLA Compliance")}</p>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">99.8%</h3>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t("generated.pages.phase4.aiprocurement.live_negotiation_board_6", "Live Negotiation Board")}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-green-400">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>{t("generated.pages.phase4.aiprocurement.ai_engine_online_7", "AI Engine Online")}</div>
                </div>

                <div className="space-y-4">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex-shrink-0 mt-1">
                                {log.agent === 'Procurement AI' ? (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Bot size={14} />
                                    </div>
                                ) : log.agent === 'Predictive Engine' ? (
                                    <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400">
                                        <Zap size={14} />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                        <DollarSign size={14} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.agent}</span>
                                    <span className="text-[10px] font-bold text-slate-500">{log.time}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-300">{log.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                    <button onClick={() => navigate('/app/procurement')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-indigo-600/20">{t("generated.pages.phase4.aiprocurement.view_pending_approvals_8", "View Pending Approvals")}<ArrowRight size={14} />
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AIProcurement;
