import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const NotificationBell = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const handleMarkAllRead = () => {
        toast.success(t('notificationBell.markedAllRead'));
        setIsOpen(false);
    };

    const handleViewAllActivity = () => {
        setIsOpen(false);
        navigate('/app/audit');
    };

    const notifications = [
        { id: 1, type: 'critical', title: 'Negative Pressure Breach', desc: 'Room ISO-E4 dropped below -2.5 Pa.', time: '2 mins ago', icon: <AlertTriangle size={16} /> },
        { id: 2, type: 'warning', title: 'Asset Maintenance Due', desc: 'HVAC Unit 4 requires filter change.', time: '1 hr ago', icon: <Info size={16} /> },
        { id: 3, type: 'success', title: 'Audit Passed', desc: 'Monthly ISO 13485 compliance passed.', time: '4 hrs ago', icon: <CheckCircle2 size={16} /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative font-sans" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-all relative group"
            >
                <Bell size={20} className="group-hover:animate-wiggle" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-100 group-hover:border-indigo-50"></span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in">
                    <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                        <div>
                            <h4 className="font-black tracking-tight">{t('notificationBell.title')}</h4>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">{t('notificationBell.unreadAlerts')}</p>
                        </div>
                        <button onClick={handleMarkAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">{t('notificationBell.markAllRead')}</button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map(n => (
                            <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'critical' ? 'bg-rose-50 text-rose-600' : n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    {n.icon}
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-slate-900">{n.title}</h5>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.desc}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{n.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-3 bg-slate-50 text-center">
                        <button onClick={handleViewAllActivity} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">{t('notificationBell.viewAllActivity')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
