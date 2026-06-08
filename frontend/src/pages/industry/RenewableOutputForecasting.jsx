import { Sun, Wind, Battery, Zap, CloudRain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RenewableOutputForecasting = () => {
    const { t } = useTranslation();

    const assets = [
        { id: 'SOLAR-TX1', type: 'Solar Array', output: '45 MW', forecast: '+12%', battery: '85%' },
        { id: 'WIND-OFF01', type: 'Offshore Wind', output: '120 MW', forecast: '-5%', battery: '92%' },
        { id: 'SOLAR-NV4', type: 'Solar Array', output: '12 MW', forecast: '-40%', battery: '30%' }
    ];

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            <div className="bg-yellow-950 p-10 rounded-[3rem] text-yellow-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border border-yellow-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                        <Sun size={32} className="text-yellow-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t("generated.pages.industry.renewableoutputforecasting.renewable_output_1", "Renewable Output")}</h1>
                        <p className="text-yellow-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t("generated.pages.industry.renewableoutputforecasting.grid_forecasting_storage_matrix_2", "Grid Forecasting & Storage Matrix")}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t("generated.pages.industry.renewableoutputforecasting.177_mw_3", "177 MW")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.renewableoutputforecasting.live_generation_4", "Live Generation")}</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Zap size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">72%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t("generated.pages.industry.renewableoutputforecasting.grid_battery_buffer_5", "Grid Battery Buffer")}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Battery size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-rose-600 tracking-tighter">{t("generated.pages.industry.renewableoutputforecasting.cloudy_6", "Cloudy")}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">24Hr Weather Risk (NV)</p>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><CloudRain size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-8">{t("generated.pages.industry.renewableoutputforecasting.asset_forecasting_7", "Asset Forecasting")}</h3>
                <div className="space-y-4">
                    {assets.map((asset, i) => (
                        <div key={i} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-yellow-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                                    {asset.type.includes('Solar') ? <Sun size={20} /> : <Wind size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 text-sm uppercase">{asset.id}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{asset.type}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.renewableoutputforecasting.live_output_8", "Live Output")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{asset.output}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.renewableoutputforecasting.4hr_forecast_9", "4hr Forecast")}</p>
                                    <p className={`font-black text-xs uppercase ${asset.forecast.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{asset.forecast}</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("generated.pages.industry.renewableoutputforecasting.storage_10", "Storage")}</p>
                                    <p className="font-black text-xs uppercase text-slate-900">{asset.battery}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RenewableOutputForecasting;
