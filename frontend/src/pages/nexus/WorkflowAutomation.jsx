import { Layers, Plus, ArrowRight, Zap, Filter, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const WorkflowAutomation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const workflows = [
        { id: 'WF-01', name: 'Critical IoT Escalation', status: 'active', trigger: 'Sensor Value > Threshold', action: 'Create Urgent WO' },
        { id: 'WF-02', name: 'Weekly Maintenance Gen', status: 'active', trigger: 'Schedule (Every Monday)', action: 'Generate 12 WOs' },
        { id: 'WF-03', name: 'Low Inventory Alert', status: 'paused', trigger: 'Stock < Min Level', action: 'Send Email to Procurement' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-12">
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-10 rounded-[3rem] text-indigo-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-indigo-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <Zap size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.nexus.workflowautomation.workflow_builder_1", "Workflow Builder")}</h1>
                        <p className="text-indigo-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.nexus.workflowautomation.no_code_trigger_action_engine_2", "No-Code Trigger & Action Engine")}</p>
                    </div>
                </div>
                <button onClick={() => navigate('/app/custom-forms')} className="relative z-10 bg-indigo-500 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2">
                    <Plus size={16} />{t("generated.pages.nexus.workflowautomation.create_rule_3", "Create Rule")}</button>
            </div>

            {/* Visual Builder Demo Area */}
            <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">{t("generated.pages.nexus.workflowautomation.rule_editor_preview_4", "Rule Editor Preview")}</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    
                    {/* Trigger Block */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 w-full md:w-64">
                        <div className="flex items-center gap-3 text-indigo-600 mb-4">
                            <Filter size={20} />
                            <span className="font-black uppercase tracking-tight text-sm">When (Trigger)</span>
                        </div>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mb-2">
                            <option>{t("generated.pages.nexus.workflowautomation.iot_sensor_spike_5", "IoT Sensor Spike")}</option>
                            <option>{t("generated.pages.nexus.workflowautomation.work_order_status_changed_6", "Work Order Status Changed")}</option>
                            <option>{t("generated.pages.nexus.workflowautomation.inventory_level_dropped_7", "Inventory Level Dropped")}</option>
                        </select>
                    </div>

                    <ArrowRight className="text-slate-400 hidden md:block" />
                    <div className="w-px h-8 bg-slate-300 md:hidden"></div>

                    {/* Condition Block */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 w-full md:w-64">
                        <div className="flex items-center gap-3 text-amber-600 mb-4">
                            <Database size={20} />
                            <span className="font-black uppercase tracking-tight text-sm">If (Condition)</span>
                        </div>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mb-2">
                            <option>Value &gt; 80%</option>
                            <option>{t("generated.pages.nexus.workflowautomation.status_critical_8", "Status = Critical")}</option>
                        </select>
                    </div>

                    <ArrowRight className="text-slate-400 hidden md:block" />
                    <div className="w-px h-8 bg-slate-300 md:hidden"></div>

                    {/* Action Block */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 w-full md:w-64">
                        <div className="flex items-center gap-3 text-emerald-600 mb-4">
                            <Zap size={20} />
                            <span className="font-black uppercase tracking-tight text-sm">Then (Action)</span>
                        </div>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold mb-2">
                            <option>{t("generated.pages.nexus.workflowautomation.generate_work_order_9", "Generate Work Order")}</option>
                            <option>{t("generated.pages.nexus.workflowautomation.send_email_sms_10", "Send Email/SMS")}</option>
                            <option>{t("generated.pages.nexus.workflowautomation.assign_to_technician_11", "Assign to Technician")}</option>
                        </select>
                    </div>

                </div>
            </div>

            {/* Active Workflows Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">{t("generated.pages.nexus.workflowautomation.active_workflows_12", "Active Workflows")}</h3>
                <div className="space-y-4">
                    {workflows.map((wf, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4 w-full md:w-1/3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${wf.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{wf.name}</h4>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${wf.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                        {wf.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl w-full md:w-auto flex-1 justify-center">
                                <span className="text-indigo-600">{t("generated.pages.nexus.workflowautomation.if_13", "IF:")}</span> {wf.trigger} 
                                <ArrowRight size={14} className="text-slate-400 mx-2" /> 
                                <span className="text-emerald-600">{t("generated.pages.nexus.workflowautomation.then_14", "THEN:")}</span> {wf.action}
                            </div>

                            <button onClick={() => navigate('/app/custom-forms')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-widest shrink-0">{t("generated.pages.nexus.workflowautomation.edit_rule_15", "Edit Rule")}</button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default WorkflowAutomation;
