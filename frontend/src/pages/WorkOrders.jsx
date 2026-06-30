import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    ClipboardList, Plus, X, Wrench, AlertTriangle, Clock, ShieldCheck, 
    Globe, List, CheckCircle2, MoreHorizontal, Hammer, 
    Trash2, Search, Kanban as KanbanIcon, MessageSquare, History, Send, User, CalendarCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const WorkOrders = () => {
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('kanban');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({
        assetId: '',
        type: 'corrective',
        priority: 'medium',
        title: '',
        description: '',
        scheduledDate: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    // Detail modal state
    const [detailOrder, setDetailOrder] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [statusChanging, setStatusChanging] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [completedDate, setCompletedDate] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [woRes, assetRes] = await Promise.all([
                api.get('/work-orders'),
                api.get('/assets')
            ]);
            
            if (woRes.data.success) setOrders(woRes.data.data);
            if (assetRes.data.success) setAssets(assetRes.data.data);
        } catch (err) {
            console.error(t('workOrders.fetchError'), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const payload = {
            assetId: formData.assetId,
            type: formData.type,
            priority: formData.priority,
            scheduledDate: formData.scheduledDate || null,
            title_en: formData.title,
            title_fr: formData.title,
            description_en: formData.description,
            description_fr: formData.description
        };

        try {
            const response = await api.post('/work-orders', payload);
            if (response.data.success) {
                setIsModalOpen(false);
                setFormData({
                    assetId: '', type: 'corrective', priority: 'medium',
                    title: '', description: '',
                    scheduledDate: ''
                });
                toast.success(t('workOrders.submit'));
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || t('workOrders.schemaViolation'));
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            const res = await api.delete(`/work-orders/${id}`);
            if (res.data.success) fetchData();
        } catch (err) {
            toast.error(t('workOrders.deletionFailed'));
        }
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const orderId = e.dataTransfer.getData('orderId');
        
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        setOrders(updatedOrders);

        try {
            const payload = { status: newStatus };
            if (newStatus === 'completed') payload.completedDate = new Date().toISOString();
            const res = await api.put(`/work-orders/${orderId}/status`, payload);
            if (!res.data.success) fetchData();
        } catch (err) {
            fetchData();
        }
    };

    const handleOpenDetail = async (order) => {
        setIsDetailOpen(true);
        setDetailLoading(true);
        setDetailOrder(order);
        setCommentText('');
        setCompletedDate('');
        try {
            const res = await api.get(`/work-orders/${order.id}`);
            if (res.data.success) setDetailOrder(res.data.data);
        } catch (err) {
            toast.error(t('workOrders.fetchError'));
        } finally {
            setDetailLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!detailOrder || statusChanging) return;
        if (newStatus === 'completed' && !completedDate) {
            toast.error(t('workOrders.completedDateRequired'));
            return;
        }
        setPendingStatus(newStatus);
        setStatusChanging(true);
        try {
            const payload = { status: newStatus };
            if (newStatus === 'completed') payload.completedDate = completedDate;
            const res = await api.put(`/work-orders/${detailOrder.id}/status`, payload);
            if (res.data.success) {
                setDetailOrder(res.data.data);
                fetchData();
                toast.success(t('workOrders.statusUpdated'));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || t('workOrders.schemaViolation'));
        } finally {
            setStatusChanging(false);
            setPendingStatus(null);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || commentLoading) return;
        setCommentLoading(true);
        try {
            const res = await api.post(`/work-orders/${detailOrder.id}/comments`, { comment: commentText.trim() });
            if (res.data.success) {
                setDetailOrder(prev => ({ ...prev, comments: [res.data.data, ...(prev.comments || [])] }));
                setCommentText('');
                toast.success(t('workOrders.commentAdded'));
            }
        } catch (err) {
            toast.error(t('workOrders.schemaViolation'));
        } finally {
            setCommentLoading(false);
        }
    };

    const filteredOrders = orders.filter(o => 
        o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.asset_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const statuses = [
        { id: 'pending', color: 'bg-amber-500', icon: <Clock size={16} /> },
        { id: 'in_progress', color: 'bg-indigo-600', icon: <Hammer size={16} /> },
        { id: 'completed', color: 'bg-emerald-500', icon: <CheckCircle2 size={16} /> }
    ];

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header Terminal */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <ClipboardList className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('workOrders.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('workOrders.dispatchMatrix')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('workOrders.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    
                    <div className="flex items-center bg-slate-100/50 p-2 rounded-[2rem] border border-slate-100">
                        <button 
                            onClick={() => setViewMode('kanban')}
                            className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-800'}`}
                        >
                            <KanbanIcon size={16} /> {t('common.viewKanban')}
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-white shadow-xl text-indigo-600' : 'text-slate-400 hover:text-slate-800'}`}
                        >
                            <List size={16} /> {t('common.viewTable')}
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-950 hover:bg-slate-900 text-yellow-400 px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 border border-white/5"
                    >
                        <Plus className="w-6 h-6 border-2 border-yellow-400 rounded-full" />
                        {t('workOrders.createOrder')}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">{t('common.loading')}...</p>
                </div>
            ) : viewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 min-h-[70vh]">
                    {statuses.map((status) => (
                        <div 
                            key={status.id} 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, status.id)}
                            className="flex flex-col h-full bg-slate-50/50 p-8 rounded-[4rem] border border-slate-100 group transition-all hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-600/5"
                        >
                            <div className="flex justify-between items-center mb-10 px-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${status.color} text-white shadow-lg`}>
                                        {status.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                                        {t(`common.${status.id}`)}
                                    </h3>
                                </div>
                                <span className="bg-white px-5 py-2 rounded-2xl text-[10px] font-black text-slate-400 shadow-sm border border-slate-100">
                                    {filteredOrders.filter(o => o.status === status.id).length}
                                </span>
                            </div>
                            
                            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2 min-h-[500px]">
                                {filteredOrders.filter(o => o.status === status.id).map((order) => (
                                    <div 
                                        key={order.id} 
                                        draggable="true"
                                        onDragStart={(e) => e.dataTransfer.setData('orderId', order.id)}
                                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all group/card relative cursor-grab active:cursor-grabbing hover:-translate-y-1"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                order.priority === 'urgent' || order.priority === 'critical' ? 'bg-rose-50 text-rose-600' :
                                                order.priority === 'high' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {t(`workOrders.priorities.${order.priority}`)}
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
                                                className="p-2 text-slate-300 hover:text-rose-600 transition-all opacity-0 group-hover/card:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase italic group-hover/card:text-indigo-600 transition-colors">
                                            {order.title}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-4 text-slate-500">
                                            <Wrench size={14} className="text-slate-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest truncate">
                                                {i18n.language === 'fr' ? (order.asset_name_fr || order.asset_name_en || order.asset_name) : (order.asset_name_en || order.asset_name_fr || order.asset_name) || t('workOrders.genericAsset')}
                                            </span>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center text-slate-400">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg overflow-hidden">
                                                    {(order.assignee_email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <span className="text-[9px] font-black uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <button onClick={() => handleOpenDetail(order)} className="p-2 hover:bg-slate-100 rounded-xl transition-all opacity-40 hover:opacity-100">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('workOrders.tableTitle')}</th>
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('workOrders.tableAsset')}</th>
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('workOrders.tablePriority')}</th>
                                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('workOrders.tableStatus')}</th>
                                    <th className="px-12 py-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.length === 0 ? (
                                    <tr><td colSpan="5" className="px-12 py-32 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">{t('workOrders.emptyState')}</td></tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-12 py-10">
                                                <div className="text-xl font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-indigo-600 transition-colors">
                                                    {order.title}
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-2 font-mono tracking-widest uppercase">{t('workOrders.dispatchIdPrefix')} {order.id.slice(0, 8)}</div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center gap-4 text-slate-700">
                                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                                        <Wrench size={16} />
                                                    </div>
                                                    <span className="text-xs font-black uppercase tracking-tight">{i18n.language === 'fr' ? (order.asset_name_fr || order.asset_name_en || order.asset_name) : (order.asset_name_en || order.asset_name_fr || order.asset_name) || t('workOrders.unknownAsset')}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                                                    order.priority === 'urgent' || order.priority === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                    order.priority === 'high' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                }`}>
                                                    {t(`workOrders.priorities.${order.priority}`)}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                                                        order.status === 'completed' ? 'bg-emerald-500 shadow-emerald-500/20' : 
                                                        order.status === 'in_progress' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-amber-500 shadow-amber-500/20'
                                                    } mb-2`}></div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t(`common.${order.status}`)}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex justify-end gap-4 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <button onClick={() => handleOpenDetail(order)} className="p-4 bg-white border border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(order.id)}
                                                        className="p-4 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal - Work Order Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-2xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] shadow-2xl border border-white/20 overflow-hidden animate-scale-in flex flex-col">
                        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50 shrink-0">
                            <div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">{t('workOrders.add_title')}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.08em] sm:tracking-[0.3em] mt-2">{t('workOrders.initProtocol')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X size={32} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateOrder} className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Globe size={14} className="text-indigo-600" /> {t('workOrders.field_title')}
                                </label>
                                <input 
                                    type="text" required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Wrench size={16} className="text-indigo-600" /> {t('workOrders.field_asset')}
                                </label>
                                <select 
                                    required
                                    value={formData.assetId}
                                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs appearance-none cursor-pointer"
                                >
                                    <option value="">{t('workOrders.scanAssetMatrix')}</option>
                                    {assets.map(asset => (
                                        <option key={asset.id} value={asset.id}>{i18n.language === 'fr' ? (asset.name_fr || asset.name_en || asset.name) : (asset.name_en || asset.name_fr || asset.name)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <ShieldCheck size={16} className="text-emerald-500" /> {t('workOrders.field_type')}
                                    </label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs cursor-pointer"
                                    >
                                        <option value="preventive">{t('workOrders.type_preventive') || 'Preventive'}</option>
                                        <option value="corrective">{t('workOrders.type_corrective') || 'Corrective'}</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <AlertTriangle size={16} className="text-rose-500" /> {t('workOrders.field_priority')}
                                    </label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs cursor-pointer"
                                    >
                                        <option value="low">{t('workOrders.priorities.low')}</option>
                                        <option value="medium">{t('workOrders.priorities.medium')}</option>
                                        <option value="high">{t('workOrders.priorities.high')}</option>
                                        <option value="critical">{t('workOrders.priorities.critical')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Clock size={16} className="text-amber-500" /> {t('workOrders.scheduledDate')}
                                </label>
                                <input 
                                    type="datetime-local"
                                    value={formData.scheduledDate}
                                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {t('workOrders.field_description')}
                                </label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 h-32 focus:border-indigo-600 transition-all font-bold text-slate-800 text-xs"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-10">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 sm:px-10 py-4 sm:py-6 border border-slate-200 text-slate-500 font-black rounded-2xl sm:rounded-[2rem] hover:bg-slate-50 transition-all uppercase tracking-[0.08em] sm:tracking-[0.2em] text-[10px]"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit"
                                    disabled={formLoading || assets.length === 0}
                                    className="flex-1 px-6 sm:px-10 py-4 sm:py-6 bg-slate-950 text-yellow-400 font-black rounded-2xl sm:rounded-[2rem] shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-[0.08em] sm:tracking-[0.2em] text-[10px] border border-white/5"
                                >
                                    {formLoading ? '...' : t('workOrders.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail / Edit Modal */}
            {isDetailOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-3xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] shadow-2xl border border-white/20 overflow-hidden animate-scale-in flex flex-col">

                        {/* Header */}
                        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50 shrink-0">
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                                    {t('workOrders.dispatchIdPrefix')} {detailOrder?.id?.slice(0, 8).toUpperCase()}
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none truncate">
                                    {detailOrder?.title || '...'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        detailOrder?.priority === 'critical' ? 'bg-rose-50 text-rose-600' :
                                        detailOrder?.priority === 'high' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                                    }`}>{detailOrder?.priority ? t(`workOrders.priorities.${detailOrder.priority}`) : ''}</span>
                                    <span className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                                        {detailOrder?.type}
                                    </span>
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        detailOrder?.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                        detailOrder?.status === 'in_progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                    }`}>{detailOrder?.status ? t(`common.${detailOrder.status}`) : ''}</span>
                                </div>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="p-4 hover:bg-slate-200 rounded-full transition-colors text-slate-400 shrink-0">
                                <X size={28} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="flex-1 flex items-center justify-center py-24">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-8 md:p-10 space-y-10">

                                {/* Info grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-[1.5rem] p-6 space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Wrench size={12} className="text-indigo-600" />{t('workOrders.field_asset')}</p>
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                            {i18n.language === 'fr'
                                                ? (detailOrder?.asset_name_fr || detailOrder?.asset_name_en || detailOrder?.asset_name)
                                                : (detailOrder?.asset_name_en || detailOrder?.asset_name_fr || detailOrder?.asset_name)
                                                || t('workOrders.genericAsset')}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-[1.5rem] p-6 space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={12} className="text-amber-500" />{t('workOrders.scheduledDate')}</p>
                                        <p className="text-sm font-black text-slate-900">
                                            {detailOrder?.scheduled_date ? new Date(detailOrder.scheduled_date).toLocaleString() : '—'}
                                        </p>
                                    </div>
                                    {detailOrder?.description && (
                                        <div className="sm:col-span-2 bg-slate-50 rounded-[1.5rem] p-6 space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('workOrders.field_description')}</p>
                                            <p className="text-xs font-medium text-slate-700 leading-relaxed">{detailOrder.description}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Status change */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <CalendarCheck size={14} className="text-emerald-500" />{t('workOrders.changeStatus')}
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['pending', 'in_progress', 'completed'].map(s => (
                                            <button
                                                key={s}
                                                disabled={statusChanging || detailOrder?.status === s}
                                                onClick={() => handleStatusChange(s)}
                                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                    detailOrder?.status === s
                                                        ? s === 'completed' ? 'bg-emerald-600 text-white border-emerald-600'
                                                        : s === 'in_progress' ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-amber-500 text-white border-amber-500'
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                                                } disabled:opacity-50`}
                                            >
                                                {pendingStatus === s ? '...' : t(`common.${s}`)}
                                            </button>
                                        ))}
                                    </div>
                                    {/* completedDate required when switching to completed */}
                                    {detailOrder?.status !== 'completed' && (
                                        <div className="flex items-center gap-4 mt-3">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">{t('workOrders.completedDate')}</p>
                                            <input
                                                type="datetime-local"
                                                value={completedDate}
                                                onChange={(e) => setCompletedDate(e.target.value)}
                                                className="flex-1 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-600 transition-all font-black text-slate-800 text-xs"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Comments */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <MessageSquare size={14} className="text-indigo-600" />{t('workOrders.comments')} ({detailOrder?.comments?.length || 0})
                                    </p>
                                    <form onSubmit={handleAddComment} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder={t('workOrders.commentPlaceholder')}
                                            className="flex-1 px-6 py-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all font-bold text-slate-800 text-xs"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim() || commentLoading}
                                            className="px-6 py-4 bg-slate-950 text-yellow-400 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-40 flex items-center gap-2"
                                        >
                                            <Send size={14} />
                                            {commentLoading ? '...' : t('workOrders.submitComment')}
                                        </button>
                                    </form>
                                    <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                        {(detailOrder?.comments?.length || 0) === 0 ? (
                                            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-8 italic">{t('workOrders.noComments')}</p>
                                        ) : detailOrder.comments.map((c, idx) => (
                                            <div key={c.id || idx} className="bg-slate-50 rounded-2xl p-5 flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                                    <User size={14} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">{c.comment}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
                                                        {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* History */}
                                {(detailOrder?.history?.length || 0) > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <History size={14} className="text-slate-400" />{t('workOrders.history')}
                                        </p>
                                        <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar pr-2">
                                            {detailOrder.history.map((h, idx) => (
                                                <div key={h.id || idx} className="flex items-center gap-4 px-5 py-3 bg-slate-50 rounded-2xl">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex-1">
                                                        {h.action?.replace(/_/g, ' ')}
                                                        {h.old_value && h.new_value ? ` : ${h.old_value} → ${h.new_value}` : ''}
                                                    </p>
                                                    <p className="text-[9px] text-slate-300 font-black tracking-widest shrink-0">
                                                        {h.created_at ? new Date(h.created_at).toLocaleDateString() : ''}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkOrders;
