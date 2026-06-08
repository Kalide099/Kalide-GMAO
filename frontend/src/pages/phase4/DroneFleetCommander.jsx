import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Crosshair, Battery, SignalHigh, Wind, Activity, CheckCircle, Navigation } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const DroneFleetCommander = () => {
    const { t } = useTranslation();
    const [drones] = useState([
        { id: 'DRN-A01', status: 'Active', battery: 84, location: 'Sector 7G', altitude: '120m', mission: 'Perimeter Sweep' },
        { id: 'DRN-X42', status: 'Charging', battery: 12, location: 'Base Station Alpha', altitude: '0m', mission: 'None' },
        { id: 'ROB-K9', status: 'Deployed', battery: 92, location: 'Warehouse 4', altitude: 'Ground', mission: 'Spill Cleanup' },
        { id: 'DRN-T11', status: 'Maintenance', battery: 0, location: 'Hangar C', altitude: '0m', mission: 'Rotor Replacement' },
    ]);

    return (
        <div className="space-y-6">
            <header className="mb-8">
                <div className="flex items-center gap-3 text-yellow-400 mb-2">
                    <Navigation className="w-5 h-5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t("generated.pages.phase4.dronefleetcommander.phase_4_autonomy_1", "Phase 4 Autonomy")}</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{t("generated.pages.phase4.dronefleetcommander.drone_robotics_fleet_commander_2", "Drone & Robotics Fleet Commander")}</h1>
                <p className="text-slate-500 font-medium mt-2 max-w-2xl">{t("generated.pages.phase4.dronefleetcommander.manage_your_autonomous_level_5_robotic_fleet_mon_3", "Manage your autonomous Level 5 robotic fleet. Monitor telemetry, real-time spatial positioning, and mission status across all facilities.")}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-[500px] relative overflow-hidden bg-slate-900 p-0">
                        {/* Simulated Map View */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>
                        
                        <div className="absolute inset-6 pointer-events-none">
                            <div className="flex items-center gap-2 text-green-400 mb-4">
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{t("generated.pages.phase4.dronefleetcommander.live_spatial_feed_4", "Live Spatial Feed")}</span>
                            </div>
                            
                            {/* Simulated Drone blips */}
                            <div className="absolute top-1/4 left-1/3">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping absolute"></div>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full relative z-10 border border-slate-900"></div>
                                <div className="mt-2 px-2 py-1 bg-slate-900/80 backdrop-blur text-[8px] text-white font-bold uppercase rounded tracking-widest">{t("generated.pages.phase4.dronefleetcommander.drn_a01_5", "DRN-A01")}</div>
                            </div>

                            <div className="absolute bottom-1/3 right-1/4">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping absolute"></div>
                                <div className="w-3 h-3 bg-indigo-400 rounded-full relative z-10 border border-slate-900"></div>
                                <div className="mt-2 px-2 py-1 bg-slate-900/80 backdrop-blur text-[8px] text-white font-bold uppercase rounded tracking-widest">{t("generated.pages.phase4.dronefleetcommander.rob_k9_6", "ROB-K9")}</div>
                            </div>
                            
                            {/* Crosshairs effect */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <Crosshair className="w-96 h-96 text-white" strokeWidth={0.5} />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-950 text-white border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{t("generated.pages.phase4.dronefleetcommander.fleet_telemetry_7", "Fleet Telemetry")}</h3>
                        <div className="space-y-4">
                            {drones.map((drone) => (
                                <div key={drone.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="font-black tracking-widest text-sm text-yellow-400">{drone.id}</div>
                                        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                            drone.status === 'Active' || drone.status === 'Deployed' ? 'bg-green-400/20 text-green-400' :
                                            drone.status === 'Charging' ? 'bg-blue-400/20 text-blue-400' : 'bg-red-400/20 text-red-400'
                                        }`}>
                                            {drone.status}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Battery className="w-3 h-3" />
                                            <span>{drone.battery}%</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <SignalHigh className="w-3 h-3" />
                                            <span>{drone.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Wind className="w-3 h-3" />
                                            <span>Alt: {drone.altitude}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <CheckCircle className="w-3 h-3" />
                                            <span className="truncate">{drone.mission}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DroneFleetCommander;
