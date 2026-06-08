import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
    LayoutDashboard, 
    Building2, 
    Users, 
    CreditCard,
    ShieldAlert,
    LogOut,
    Languages,
    UserPlus,
    Bot,
    Settings,
    Layers,
    FileText,
    Navigation,
    Camera
} from 'lucide-react';

const SuperAdminLayout = () => {
    const { t, i18n } = useTranslation();
    const { logout } = useAuth();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: t('admin.dashboard') },
        { path: '/admin/companies', icon: <Building2 size={20} />, label: t('admin.companies') },
        { path: '/admin/users', icon: <Users size={20} />, label: t('admin.users') },
        { path: '/admin/payments', icon: <CreditCard size={20} />, label: t('admin.payments') },
        { path: '/admin/logs', icon: <ShieldAlert size={20} />, label: t('admin.logs') },
        { path: '/admin/registrations', icon: <UserPlus size={20} />, label: t('admin.onboarding') },
        { path: '/admin/mfa-security', icon: <ShieldAlert size={20} />, label: 'MFA Security' },
        { path: '/admin/ai-copilot', icon: <Bot size={20} />, label: 'AI Copilot' },
        { path: '/admin/settings', icon: <Settings size={20} />, label: t('nav.settings') || 'Settings' },
        { path: '/admin/workflows', icon: <Layers size={20} />, label: t('nav.workflows') || 'Workflows' },
        { path: '/admin/reports', icon: <FileText size={20} />, label: t('nav.reports') || 'Reports' },
        { path: '/admin/drone-fleet', icon: <Navigation size={20} />, label: 'Drone Fleet (Phase 4)' },
        { path: '/admin/ai-procurement', icon: <Bot size={20} />, label: 'AI Procurement (Phase 4)' },
        { path: '/admin/vision-defect', icon: <Camera size={20} />, label: 'Vision Detection (Phase 4)' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            {/* Crimson Sidebar for Master UI distinction */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <img src="/logo.png" alt="KGMAO Admin" className="h-8 w-auto drop-shadow-md" />
                </div>
                
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                        >
                            <span className="text-rose-500">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full p-2"
                    >
                        <LogOut size={20} className="text-rose-500" />
                        {t('common.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Admin Content Area */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium">
                        {t('admin.securityClearance')}: <span className="text-rose-600 font-bold">{t('admin.level_omega')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleLanguage}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <Languages size={20} />
                        </button>
                    </div>
                </header>
                
                <div className="p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SuperAdminLayout;
