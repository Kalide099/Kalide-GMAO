import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { ShoppingCart, Plus, Search, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
const Procurement = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // New Order Form State
    const [newOrder, setNewOrder] = useState({
        item_id: '',
        supplier_id: '',
        quantity: '',
        total_cost: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersRes, itemsRes, suppliersRes] = await Promise.all([
                api.get('/procurement'),
                api.get('/inventory'),
                api.get('/suppliers')
            ]);
            
            if (ordersRes.data.success) setOrders(ordersRes.data.data);
            if (itemsRes.data.success) setItems(itemsRes.data.data);
            if (suppliersRes.data.success) setSuppliers(suppliersRes.data.data);
        } catch (error) {
            console.error("Procurement Data Sync Failure.", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/procurement', newOrder);
            if (res.data.success) {
                setShowModal(false);
                setNewOrder({ item_id: '', supplier_id: '', quantity: '', total_cost: '' });
                fetchData();
            }
        } catch (error) {
            alert(t('common.error'));
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.patch(`/procurement/${id}/status`, { status });
            fetchData();
        } catch (error) {
            console.error("Status Update Failed", error);
        }
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.item_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.supplier_en?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && orders.length === 0) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const lang = localStorage.getItem('kgmao_language') || 'en';

    return (
        <div className="space-y-10 animate-fade-in-up pb-20">
            {/* Procurement Header */}
            <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200">
                        <ShoppingCart className="text-white w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-800 tracking-tighter uppercase mb-2">{t('procurement.title')}</h1>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">{t('procurement.subtitle')}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
                >
                    <Plus size={24} /> {t('procurement.newOrder')}
                </button>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder={t('procurement.searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl border border-slate-100 shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all outline-none font-medium"
                    />
                </div>
            </div>

            {/* PO List */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead className="bg-slate-50 uppercase text-[10px] font-black text-slate-400 tracking-[0.2em] border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-8">{t('procurement.orderId')}</th>
                                <th className="px-10 py-8">{t('procurement.itemSupplier')}</th>
                                <th className="px-10 py-8">{t('procurement.quantity')}</th>
                                <th className="px-10 py-8">{t('procurement.totalCost')}</th>
                                <th className="px-10 py-8">{t('procurement.workflowStatus')}</th>
                                <th className="px-10 py-8 text-right">{t('procurement.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-20 text-center text-slate-400 font-bold italic">
                                        {t('procurement.noOrdersFound')}
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8">
                                            <span className="text-lg font-black text-slate-800 font-mono">{order.id.split('-')[0].toUpperCase()}</span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="font-extrabold text-slate-800 text-lg uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                                {lang === 'fr' ? order.item_fr : order.item_en}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mt-1 uppercase">
                                                <Truck size={14} /> {lang === 'fr' ? order.supplier_fr : order.supplier_en}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-slate-700">{order.quantity}</span>
                                            <span className="ml-2 text-[10px] font-black text-slate-400 uppercase">{t('procurement.units')}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">${parseFloat(order.total_cost).toLocaleString()}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                                                order.status === 'received' ? 'bg-emerald-50 text-emerald-700' : 
                                                order.status === 'sent' ? 'bg-indigo-50 text-indigo-700' :
                                                order.status === 'cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {order.status === 'received' && <CheckCircle2 size={14} />}
                                                {order.status === 'sent' && <Clock size={14} />}
                                                {order.status === 'cancelled' && <XCircle size={14} />}
                                                {order.status === 'draft' && <Plus size={14} />}
                                                {t(`common.status.${order.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {order.status === 'draft' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order.id, 'sent')}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200"
                                                    >
                                                        {t('procurement.send')}
                                                    </button>
                                                )}
                                                {order.status === 'sent' && (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(order.id, 'received')}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200"
                                                    >
                                                        {t('procurement.markReceived')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Order Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-12">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.25)] relative z-10 overflow-hidden animate-fade-in-up">
                        <div className="p-12">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase mb-2">{t('procurement.initModalTitle')}</h2>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-10">{t('procurement.initModalSubtitle')}</p>
                            
                            <form onSubmit={handleCreateOrder} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('procurement.itemToProcure')}</label>
                                        <select 
                                            required
                                            value={newOrder.item_id}
                                            onChange={e => setNewOrder({...newOrder, item_id: e.target.value})}
                                            className="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold"
                                        >
                                            <option value="">{t('procurement.selectItem')}</option>
                                            {items.map(item => (
                                                <option key={item.id} value={item.id}>{lang === 'fr' ? item.name_fr : item.name_en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('procurement.primarySupplier')}</label>
                                        <select 
                                            required
                                            value={newOrder.supplier_id}
                                            onChange={e => setNewOrder({...newOrder, supplier_id: e.target.value})}
                                            className="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold"
                                        >
                                            <option value="">{t('procurement.selectVendor')}</option>
                                            {suppliers.map(sup => (
                                                <option key={sup.id} value={sup.id}>{lang === 'fr' ? sup.name_fr : sup.name_en}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('procurement.quantity')}</label>
                                        <input 
                                            type="number" 
                                            required
                                            value={newOrder.quantity}
                                            onChange={e => setNewOrder({...newOrder, quantity: e.target.value})}
                                            className="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('procurement.totalEstimatedCost')}</label>
                                        <input 
                                            type="number" 
                                            required
                                            value={newOrder.total_cost}
                                            onChange={e => setNewOrder({...newOrder, total_cost: e.target.value})}
                                            className="w-full px-8 py-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button 
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest transition-all"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button type="submit"
                                        className="flex-[2] py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95"
                                    >
                                        {t('procurement.generateOrder')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Procurement;
