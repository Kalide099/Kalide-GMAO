import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { BrainCircuit, Activity, Clock, ShieldAlert, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

const Predictive = () => {
    const { t } = useTranslation();
    const [fleetData, setFleetData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFleetData = async () => {
        try {
            const response = await api.get('/predictive');
            if (response.data.success) {
                setFleetData(response.data.data);
            }
        } catch (error) {
            console.error("Predictive Intelligence Fetch Failure.", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleetData();
    }, []);

    if (loading) return <div className="p-12 text-center text-slate-500 font-bold">{t('common.loading')}...</div>;

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                        <BrainCircuit className="text-indigo-600 w-12 h-12" />
                        {t('predictive.title')}
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg lg:text-xl font-medium max-w-2xl">{t('predictive.subtitle')}</p>
                </div>
                <div className="bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100 flex items-center gap-3">
                    <TrendingUp className="text-indigo-600" />
                    <span className="text-indigo-700 font-black tracking-tight">{t('marketing.v2Live')}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {fleetData.map((asset) => (
                    <div key={asset.assetId} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tighter">{asset.name}</h3>
                            <div className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${
                                asset.healthScore > 80 ? 'bg-emerald-50 text-emerald-600' :
                                asset.healthScore > 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                                {asset.healthScore}%
                            </div>
                        </div>

                        {/* Custom CSS Health Gauge */}
                        <div className="w-full h-3 bg-slate-100 rounded-full mb-8 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                                    asset.healthScore > 80 ? 'bg-emerald-500' :
                                    asset.healthScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${asset.healthScore}%` }}
                            ></div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('predictive.mtbf')}</span>
                                </div>
                                <span className="text-lg font-black text-slate-800">{asset.mtbf} {t('predictive.hours')}</span>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t('predictive.mttr')}</span>
                                </div>
                                <span className="text-lg font-black text-slate-800">{asset.mttr} {t('predictive.hours')}</span>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldAlert className="w-5 h-5 text-indigo-400" />
                                    <span className="text-xs font-black text-indigo-200 uppercase tracking-widest">{t('predictive.nextFailure')}</span>
                                </div>
                                <p className="text-xl font-black leading-tight">
                                    {asset.predictedFailureDate 
                                        ? new Date(asset.predictedFailureDate).toLocaleDateString(undefined, { dateStyle: 'long' })
                                        : t('predictive.modelInit')}
                                </p>
                            </div>

                            <div className={`p-6 rounded-2xl border-2 flex items-start gap-4 ${
                                asset.healthScore > 70 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'
                            }`}>
                                {asset.healthScore > 70 ? (
                                    <CheckCircle size={24} className="text-emerald-500 shrink-0" />
                                ) : (
                                    <AlertTriangle size={24} className="text-amber-500 shrink-0" />
                                )}
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t('predictive.recommendation')}</p>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed font-mono">{asset.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {fleetData.length === 0 && (
                    <div className="col-span-full bg-white p-24 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <BrainCircuit className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">{t('predictive.noDataTitle')}</h3>
                        <p className="text-slate-500 mt-3 text-lg max-w-md">{t('predictive.noDataDesc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictive;
