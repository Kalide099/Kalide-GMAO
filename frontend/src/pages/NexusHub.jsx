import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
    Search, 
    ShieldAlert, 
    Zap, 
    FileText, 
    Settings, 
    Thermometer, 
    Box, 
    Layers, 
    WifiOff 
} from 'lucide-react';

const NexusHub = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const plan = user?.plan || 'basic';
    let enabledModules = user?.enabled_modules;
    if (typeof enabledModules === 'string') {
        try { enabledModules = JSON.parse(enabledModules); } catch (e) { enabledModules = []; }
    }
    if (!Array.isArray(enabledModules)) enabledModules = [];

    const planAccess = {
        basic: ['offline'],
        pro: ['rca', 'fmea', 'calibration', 'tpm', 'inventory', 'offline'],
        enterprise: ['rca', 'fmea', 'loto', 'calibration', 'dms', 'tpm', 'inventory', 'bim', 'offline']
    };

    const modules = [
        { id: 'rca', icon: <Search size={32} />, color: 'bg-indigo-600', shadow: 'shadow-indigo-200', path: '/app/nexus/rca' },
        { id: 'fmea', icon: <Layers size={32} />, color: 'bg-slate-900', shadow: 'shadow-slate-200', path: '/app/nexus/fmea' },
        { id: 'loto', icon: <ShieldAlert size={32} />, color: 'bg-rose-600', shadow: 'shadow-rose-200', path: '/app/nexus/loto' },
        { id: 'calibration', icon: <Thermometer size={32} />, color: 'bg-emerald-600', shadow: 'shadow-emerald-200', path: '/app/nexus/calibration' },
        { id: 'dms', icon: <FileText size={32} />, color: 'bg-blue-600', shadow: 'shadow-blue-200', path: '/app/nexus/dms' },
        { id: 'tpm', icon: <Settings size={32} />, color: 'bg-orange-600', shadow: 'shadow-orange-200', path: '/app/nexus/tpm' },
        { id: 'inventory', icon: <Box size={32} />, color: 'bg-purple-600', shadow: 'shadow-purple-200', path: '/app/nexus/inventory' },
        { id: 'bim', icon: <Zap size={32} />, color: 'bg-yellow-500', shadow: 'shadow-yellow-200', path: '/app/nexus/bim' },
        { id: 'offline', icon: <WifiOff size={32} />, color: 'bg-slate-500', shadow: 'shadow-slate-200', path: '/app/nexus/offline' }
    ].filter(m => planAccess[plan].includes(m.id) || enabledModules.includes(m.id) || user?.role === 'super_admin');

    return (
        <div className="space-y-12 animate-fade-in-up pb-28">
            <div className="flex items-center gap-8 mb-16">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3 group hover:rotate-0 transition-transform">
                    <Layers className="text-yellow-400 w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic italic leading-none">
                        {t('nexus.title')}
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                        {t('nexus.subtitle')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((mod) => (
                    <div 
                        key={mod.id} 
                        onClick={() => navigate(mod.path)}
                        className="group bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl group-hover:bg-indigo-50 transition-colors"></div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className={`${mod.color} text-white w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${mod.shadow} group-hover:rotate-6 transition-transform`}>
                                {mod.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight italic">
                                    {t(`nexus.${mod.id}.title`)}
                                </h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest leading-loose">
                                    {t(`nexus.${mod.id}.subtitle`)}
                                </p>
                            </div>
                            <div className="pt-4 flex items-center gap-2">
                                <span className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                    {t('nexus.version')}
                                </span>
                                <span className="px-4 py-2 bg-rose-50 text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-100">
                                    {t('nexus.encrypted')}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NexusHub;
