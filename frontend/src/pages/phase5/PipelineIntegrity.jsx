import { useTranslation } from 'react-i18next';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

const PipelineIntegrity = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-slate-50 min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
            <Activity className="text-yellow-400 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t("generated.pages.phase5.pipelineintegrity.drone_pipeline_integrity_1", "Drone Pipeline Integrity")}</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">{t("generated.pages.phase5.pipelineintegrity.emerging_markets_core_engine_2", "Emerging Markets Core Engine")}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.location.assign('/app/iot')} className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-xs shadow-sm hover:shadow-md transition-all border border-slate-200 flex items-center gap-2">
            <Activity size={16} />{t("generated.pages.phase5.pipelineintegrity.live_sync_3", "Live Sync")}</button>
          <button onClick={() => window.location.assign('/app/iot')} className="px-6 py-3 bg-slate-900 text-yellow-400 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:shadow-2xl transition-all border border-slate-800 flex items-center gap-2">
            <Cpu size={16} />{t("generated.pages.phase5.pipelineintegrity.deploy_agents_4", "Deploy Agents")}</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">{t("generated.pages.phase5.pipelineintegrity.system_overview_5", "System Overview")}</h3>
          </div>
          <p className="text-slate-600 leading-relaxed mb-8">{t("generated.pages.phase5.pipelineintegrity.satellite_and_drone_correlation_to_detect_sub_su_6", "Satellite and drone correlation to detect sub-surface leaks via adjacent vegetation die-off. This module provides automated bridging over infrastructural gaps to guarantee absolute operational continuity.")}</p>
          <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center border-dashed relative overflow-hidden">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm relative z-10 flex flex-col items-center gap-3">
               <ShieldAlert size={24} className="text-slate-300" />{t("generated.pages.phase5.pipelineintegrity.awaiting_field_telemetry_7", "Awaiting Field Telemetry")}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-6">{t("generated.pages.phase5.pipelineintegrity.active_diagnostics_8", "Active Diagnostics")}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-sm text-slate-300">{t("generated.pages.phase5.pipelineintegrity.resilience_score_9", "Resilience Score")}</span>
                <span className="font-black text-yellow-400">98.2%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-sm text-slate-300">{t("generated.pages.phase5.pipelineintegrity.offline_fallback_10", "Offline Fallback")}</span>
                <span className="font-black text-emerald-400">{t("generated.pages.phase5.pipelineintegrity.enabled_11", "Enabled")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">{t("generated.pages.phase5.pipelineintegrity.latency_variance_12", "Latency Variance")}</span>
                <span className="font-black text-slate-100">{t("generated.pages.phase5.pipelineintegrity.14ms_13", "14ms")}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center gap-4 h-48">
            <Activity className="text-slate-300 w-10 h-10" />
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{t("generated.pages.phase5.pipelineintegrity.awaiting_calibration_array_14", "Awaiting Calibration Array")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineIntegrity;
