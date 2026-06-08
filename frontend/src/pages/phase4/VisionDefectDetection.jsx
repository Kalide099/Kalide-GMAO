import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, ShieldAlert, Zap, Camera } from 'lucide-react';
import { Card } from '../../components/ui/Card';
const VisionDefectDetection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [feeds] = useState([
        { id: 'CAM-A4', location: 'Assembly Line 1', status: 'Anomaly Detected', confidence: 98, type: 'Fluid Leak', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=800&q=80' },
        { id: 'CAM-B2', location: 'Storage Sector C', status: 'Clear', confidence: 100, type: 'None', image: 'https://images.unsplash.com/photo-1565439387431-7e8c3395bcfc?auto=format&fit=crop&w=800&q=80' },
        { id: 'CAM-C9', location: 'HVAC Roof Deck', status: 'Warning', confidence: 84, type: 'Thermal Signature', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' }
    ]);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 text-rose-500 mb-2">
                    <Eye className="w-5 h-5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t("generated.pages.phase4.visiondefectdetection.phase_4_autonomy_1", "Phase 4 Autonomy")}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{t("generated.pages.phase4.visiondefectdetection.computer_vision_defect_detection_2", "Computer Vision Defect Detection")}</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">{t("generated.pages.phase4.visiondefectdetection.integrate_cctv_and_drone_camera_feeds_with_our_d_3", "Integrate CCTV and drone camera feeds with our deep learning vision models. Automatically detect spills, structural defects, and safety hazards, instantly generating high-priority work orders.")}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {feeds.map((feed) => (
                    <Card key={feed.id} className={`p-0 overflow-hidden relative group border-2 ${feed.status === 'Anomaly Detected' ? 'border-rose-500' : feed.status === 'Warning' ? 'border-yellow-400' : 'border-transparent'}`}>
                        <div className="h-48 relative">
                            <img src={feed.image} alt={feed.location} className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                            
                            {/* Bounding Box Simulation for anomalies */}
                            {feed.status === 'Anomaly Detected' && (
                                <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 border-2 border-rose-500 bg-rose-500/20 animate-pulse">
                                    <div className="absolute -top-6 left-0 bg-rose-500 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest whitespace-nowrap">
                                        {feed.type} ({feed.confidence}%)
                                    </div>
                                </div>
                            )}

                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2">
                                <Camera className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{feed.id}</span>
                            </div>
                        </div>
                        <div className="p-5 bg-white">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-900">{feed.location}</h3>
                                <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                    feed.status === 'Anomaly Detected' ? 'bg-rose-100 text-rose-600' :
                                    feed.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                                }`}>
                                    {feed.status}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span>AI Confidence: {feed.confidence}%</span>
                                </div>
                            </div>
                            
                            {feed.status !== 'Clear' && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <button onClick={() => navigate('/app/work-orders')} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Zap size={14} />{t("generated.pages.phase4.visiondefectdetection.review_auto_wo_4", "Review Auto-WO")}</button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default VisionDefectDetection;
