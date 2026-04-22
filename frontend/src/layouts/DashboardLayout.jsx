import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Wrench, Package, ArrowRightLeft, LogOut, Menu, X, 
  BrainCircuit, Activity, ShieldCheck, ShoppingCart, Zap, TrendingUp, 
  Globe, ShieldAlert, DollarSign, Map, Truck, Award, Radio, Boxes, 
  Link, Leaf, Eye, Siren, Ship, FileText, Users, Layers, Fingerprint
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api/axiosConfig';

const DashboardLayout = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) setNotifications(res.data.data);
    } catch (e) {
      console.warn("Notifications offline.");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = Array.isArray(notifications) 
    ? notifications.filter(n => n && !n.is_read).length 
    : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Structured Menu: Core Ops -> Intelligence -> Global Matrix -> Legal
  const menuItems = [
    { id: 'core', items: [
      { icon: <LayoutDashboard size={20} />, label: t('nav.dashboard'), path: '/app' },
      { icon: <Wrench size={20} />, label: t('nav.assets'), path: '/app/assets' },
      { icon: <ArrowRightLeft size={20} />, label: t('nav.workOrders'), path: '/app/work-orders' },
      { icon: <Package size={20} />, label: t('nav.inventory'), path: '/app/inventory' },
      { icon: <ShoppingCart size={20} />, label: t('nav.procurement'), path: '/app/procurement' },
    ]},
    { id: 'intelligence', items: [
      { icon: <BrainCircuit size={20} />, label: t('nav.predictive'), path: '/app/predictive', module: 'predictive' },
      { icon: <Activity size={20} />, label: t('nav.iot'), path: '/app/iot', module: 'iot' },
      { icon: <Zap size={20} />, label: t('nav.energy'), path: '/app/energy' },
      { icon: <TrendingUp size={20} />, label: t('nav.performance'), path: '/app/performance' },
      { icon: <Radio size={20} />, label: t('nav.command_center'), path: '/app/command', module: 'command' },
      { icon: <Boxes size={20} />, label: t('nav.digital_twin'), path: '/app/twin', module: 'twin' },
    ]},
    { id: 'global_matrix', items: [
      { icon: <Globe size={20} />, label: t('nav.global'), path: '/app/global', module: 'global' },
      { icon: <Map size={20} />, label: t('roadmap.gis.title'), path: '/app/map', module: 'global' },
      { icon: <Truck size={20} />, label: t('roadmap.gis.telematics'), path: '/app/fleet', module: 'global' },
      { icon: <Ship size={20} />, label: t('nav.logistics'), path: '/app/logistics-tower', module: 'logistics' },
      { icon: <Link size={20} />, label: t('nav.integration_hub'), path: '/app/hub', module: 'hub' },
    ]},
    { id: 'enterprise_roadmap', items: [
      { icon: <ShieldAlert size={20} />, label: t('roadmap.safety.title'), path: '/app/safety', module: 'safety' },
      { icon: <Siren size={20} />, label: t('nav.ehs'), path: '/app/ehs-incident', module: 'ehs' },
      { icon: <DollarSign size={20} />, label: t('roadmap.finance.title'), path: '/app/finance', module: 'finance' },
      { icon: <Award size={20} />, label: t('roadmap.skills.title'), path: '/app/skills', module: 'skills' },
      { icon: <Package size={20} />, label: t('roadmap.warehouse.title'), path: '/app/warehouse', module: 'warehouse' },
      { icon: <Eye size={20} />, label: t('nav.ar_workforce'), path: '/app/ar', module: 'ar' },
      { icon: <BrainCircuit size={20} />, label: t('nav.neural_ar'), path: '/app/neural-ar', module: 'neural_ar' },
      { icon: <Leaf size={20} />, label: t('roadmap.esg.title'), path: '/app/esg', module: 'esg' },
      { icon: <Leaf size={20} />, label: t('nav.carbon_ledger'), path: '/app/carbon-ledger', module: 'carbon_ledger' },
    ]},
    { id: 'administration', role: ['admin', 'super_admin', 'system_admin'], items: [
      { icon: <Users size={20} />, label: t('nav.subcontracting'), path: '/app/subcontracting' },
      { icon: <Layers size={20} />, label: t('nav.finance_matrix'), path: '/app/finance-matrix' },
      { icon: <FileText size={20} />, label: t('nav.custom_forms'), path: '/app/custom-forms' },
      { icon: <Fingerprint size={20} />, label: t('nav.sso') || 'SSO Identity', path: '/app/sso-config' },
      { icon: <ShieldCheck size={20} />, label: t('nav.audit'), path: '/app/audit' },
    ]}
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-auto
        border-r border-white/5 shadow-2xl
      `}>
        <div className="p-10 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] group cursor-pointer hover:rotate-12 transition-transform">
                <Zap className="text-slate-950 w-7 h-7" fill="currentColor" />
            </div>
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">KGMAO</h1>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1.5 opacity-60">{t('common.industrialOS')}</p>
            </div>
          </div>
          <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={28} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 mt-10 overflow-y-auto custom-scrollbar pb-10">
          {menuItems.map((section) => {
            const userPlan = user?.plan || 'enterprise'; // Default for existing users
            
            // Tier-based section filtering
            const tierMapping = {
              'core': ['basic', 'pro', 'enterprise'],
              'intelligence': ['pro', 'enterprise'],
              'global_matrix': ['enterprise'],
              'enterprise_roadmap': ['enterprise'],
              'administration': ['enterprise']
            };

            // If section is not allowed for this tier, skip it
            if (tierMapping[section.id] && !tierMapping[section.id].includes(userPlan)) return null;

            const visibleItems = section.items.filter(item => {
              const modules = Array.isArray(user?.enabled_modules) ? user.enabled_modules : [];
              
              // Role check for full section
              if (section.role && !section.role.includes(user?.role)) return false;
              
              if (item.module) return modules.includes(item.module) || user?.role === 'super_admin';
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.id} className="space-y-3">
                <h5 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 opacity-50">{t(`nav.sections.${section.id}`)}</h5>
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all duration-500 relative group overflow-hidden ${
                          isActive 
                            ? 'bg-white/10 text-yellow-400 shadow-xl border border-white/10 pointer-events-none' 
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {/* Active Background Glow */}
                          <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="transition-transform group-hover:scale-110 z-10 shrink-0">
                            {item.icon}
                          </div>
                          <span className="font-black uppercase tracking-widest text-[10px] z-10 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                          
                          {isActive && (
                            <div className="absolute right-6 w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)] z-10"></div>
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-6 py-5 rounded-2xl text-slate-500 hover:bg-rose-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px] border border-white/5 shadow-inner group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-24 bg-white/90 backdrop-blur-2xl border-b border-slate-100 flex items-center justify-between px-8 lg:px-16 z-30 shadow-sm">
          <div className="flex items-center gap-8">
            <button 
              className="lg:hidden p-3 bg-slate-100 rounded-2xl text-slate-800 hover:bg-slate-200 transition-all shadow-sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-4">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                <div className="text-slate-900 font-black uppercase text-[10px] tracking-[0.4em] italic opacity-80">{t('app.banner_text')}</div>
                <div className="h-4 w-px bg-slate-200 mx-2"></div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('common.protocolActive')}</div>
            </div>
          </div>

          <div className="flex items-center gap-8 lg:gap-12">
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-950 hover:text-yellow-400 transition-all relative border border-slate-100 group shadow-sm hover:shadow-xl hover:shadow-yellow-400/10"
              >
                <Activity className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 border-2 border-white rounded-full text-[9px] font-black text-white flex items-center justify-center animate-bounce shadow-2xl ring-4 ring-yellow-400/20">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-8 w-[28rem] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-fade-in-up z-50 ring-1 ring-slate-900/5">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">{t('notifications.title')}</span>
                    <span className="text-[10px] font-black bg-yellow-400 text-slate-950 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-yellow-400/20">{unreadCount} {t('notifications.new')}</span>
                  </div>
                  <div className="max-h-[35rem] overflow-y-auto custom-scrollbar">
                    {!Array.isArray(notifications) || notifications.length === 0 ? (
                      <div className="p-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest italic opacity-40">{t('notifications.empty')}</div>
                    ) : (
                      notifications.filter(n => n && typeof n === 'object').map(n => (
                        <div key={n.id} className={`p-8 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group ${!n.is_read ? 'bg-yellow-50/20' : ''}`}>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">{n.type}</span>
                            <span className="text-[10px] text-slate-400 font-bold opacity-60">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-base font-black text-slate-950 tracking-tighter uppercase italic group-hover:text-indigo-600 transition-colors">
                            {localStorage.getItem('kgmao_language') === 'fr' ? (n?.title_fr || n?.title_en) : (n?.title_en || n?.title_fr)}
                          </p>
                          <p className="text-xs text-slate-500 mt-3 line-clamp-2 font-medium leading-relaxed">
                            {localStorage.getItem('kgmao_language') === 'fr' ? (n?.message_fr || n?.message_en) : (n?.message_en || n?.message_fr)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                    <button onClick={() => setIsNotifOpen(false)} className="text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">{t('common.close')}</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-12 w-px bg-slate-100 hidden sm:block"></div>
            
            <LanguageSwitcher />

            <div className="flex items-center gap-6 group cursor-pointer bg-slate-50 p-2 pr-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border-4 border-white flex items-center justify-center shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
                <span className="text-white font-black text-2xl tracking-tighter uppercase italic">
                  {(user?.email?.[0] || 'K').toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-1.5 italic">
                  {user?.role ? t(`common.roles.${user.role}`) : t('common.roles.technician')}
                </div>
                <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest truncate max-w-[150px]">
                  {user?.email || t('nav.unidentified_node')}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-16 bg-white relative custom-scrollbar scroll-smooth">
          <div className="absolute inset-x-0 top-0 h-[40rem] bg-gradient-to-b from-slate-50/80 via-white to-transparent -z-10"></div>
          <div className="absolute inset-y-0 right-0 w-[40rem] bg-[radial-gradient(circle_at_right,_rgba(250,204,21,0.03)_0%,_transparent_70%)] -z-10"></div>
          
          <div className="max-w-[1700px] mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
