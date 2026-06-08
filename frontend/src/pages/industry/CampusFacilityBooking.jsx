import { GraduationCap, MapPin, Calendar, CheckCircle2, Wrench, Users, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CampusFacilityBooking = () => {
    const { t } = useTranslation();

    const facilities = [
        { id: 'LH-101', name: 'Lecture Hall 101', type: 'Classroom', status: 'maintenance', issue: 'Projector Bulb Dead', nextClass: '14:00' },
        { id: 'LB-Main', name: 'Main Library HVAC', type: 'Infrastructure', status: 'optimal', issue: 'None', nextClass: 'N/A' },
        { id: 'DORM-A', name: 'Alpha Dormitory', type: 'Housing', status: 'warning', issue: 'Hot Water Fluctuation', nextClass: 'N/A' },
        { id: 'LAB-CHEM', name: 'Chemistry Lab B', type: 'Laboratory', status: 'optimal', issue: 'None', nextClass: '10:00' }
    ];

    const renderFacilityIcon = (type) => {
        if (type === 'Classroom') {
            return <Monitor size={20} />;
        }

        if (type === 'Housing') {
            return <Users size={20} />;
        }

        return <Wrench size={20} />;
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="bg-indigo-950 p-10 rounded-[3rem] text-indigo-50 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                        <GraduationCap size={32} className="text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter">{t('industry.campus.title')}</h1>
                        <p className="text-indigo-300 font-bold uppercase tracking-[0.2em] text-xs mt-2">{t('industry.campus.subtitle')}</p>
                    </div>
                </div>
                <button onClick={() => window.location.assign('/app/work-orders')} className="relative z-10 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    {t('industry.campus.scheduleMaintenance')}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">98.5%</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t('industry.campus.classroomUptime')}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><CheckCircle2 size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">14</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t('industry.campus.openWorkOrders')}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><Wrench size={24} /></div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group">
                    <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t('industry.campus.squareFeetMetric')}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{t('industry.campus.squareFeetManaged')}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform"><MapPin size={24} /></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Facility List */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{t('industry.campus.activeDisruptions')}</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{t('industry.campus.priorityView')}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {facilities.map(fac => (
                            <div key={fac.id} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fac.status === 'optimal' ? 'bg-emerald-50 text-emerald-600' : fac.status === 'maintenance' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {renderFacilityIcon(fac.type)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-sm uppercase">{fac.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{fac.id} • {fac.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t('common.status')}</p>
                                    <p className={`font-black text-xs uppercase ${fac.status === 'optimal' ? 'text-emerald-600' : 'text-rose-600'}`}>{fac.issue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scheduling Widget */}
                <div className="bg-slate-50 rounded-[3rem] border border-slate-200 p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <Calendar className="text-indigo-500" />
                        <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{t('industry.campus.breakSchedule')}</h3>
                    </div>
                    <div className="flex-1 space-y-4">
                        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                            {t('industry.campus.breakScheduleDescription')}
                        </p>
                        
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase">{t('industry.campus.springBreak')}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('industry.campus.springBreakDates')}</p>
                            </div>
                            <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase">{t('industry.campus.fourWorkOrders')}</span>
                        </div>
                        
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase">{t('industry.campus.summerTerm')}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('industry.campus.summerTermDates')}</p>
                            </div>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase">{t('industry.campus.twelveWorkOrders')}</span>
                        </div>
                    </div>
                    <button onClick={() => window.location.assign('/app/work-orders')} className="w-full mt-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                        {t('industry.campus.viewAcademicCalendar')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampusFacilityBooking;
