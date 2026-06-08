import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api/axiosConfig';
import { 
    PackageSearch, Plus, Package, X, Hash, Layers, 
    DollarSign, Globe, AlertCircle, Edit, Trash2, Search 
} from 'lucide-react';

const Inventory = () => {
    const { t, i18n } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: 0,
        minimumQuantity: 0,
        price: 0
    });
    const [formLoading, setFormLoading] = useState(false);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/inventory');
            if (response.data.success) {
                setItems(response.data.data);
            }
        } catch (error) {
            console.error(t('inventory.fetchError'), error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpenCreateModal = () => {
        setIsEditMode(false);
        setFormData({ name: '', sku: '', quantity: 0, minimumQuantity: 0, price: 0 });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setIsEditMode(true);
        setSelectedItemId(item.id);
        setFormData({
            name: i18n.language === 'fr' ? (item.name_fr || item.name_en || item.name) : (item.name_en || item.name_fr || item.name),
            sku: item.sku,
            quantity: item.quantity,
            minimumQuantity: item.minimum_quantity,
            price: item.price
        });
        setIsModalOpen(true);
    };

    const handleCreateOrUpdateItem = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        const payload = {
            sku: formData.sku,
            quantity: Number(formData.quantity),
            minimumQuantity: Number(formData.minimumQuantity),
            price: Number(formData.price),
            name_en: formData.name,
            name_fr: formData.name
        };

        try {
            const response = isEditMode 
                ? await api.put(`/inventory/${selectedItemId}`, payload)
                : await api.post('/inventory', payload);

            if (response.data.success) {
                setIsModalOpen(false);
                fetchItems();
            }
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || t('common.error')}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.confirmDelete'))) return;
        try {
            const response = await api.delete(`/inventory/${id}`);
            if (response.data.success) fetchItems();
        } catch (error) {
            alert(t('inventory.deletionFailed'));
        }
    };

    const filteredItems = items.filter(i => 
        (i.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 animate-fade-in-up">
            {/* Header Terminal */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-600/20 group cursor-pointer hover:rotate-12 transition-transform">
                        <PackageSearch className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                            {t('inventory.title')}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-3">
                            {t('inventory.ledgerSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder={t('inventory.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all shadow-sm font-black text-slate-800 uppercase text-xs tracking-wider"
                        />
                    </div>
                    
                    <button 
                        onClick={handleOpenCreateModal}
                        className="bg-slate-950 hover:bg-slate-900 text-yellow-400 px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl transition-all hover:-translate-y-1 active:scale-95 border border-white/5"
                    >
                        <Plus className="w-6 h-6 border-2 border-yellow-400 rounded-full" />
                        {t('inventory.addItem')}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] tracking-widest">{t('common.loading')}...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-white rounded-[4rem] p-32 border border-slate-100 flex flex-col items-center justify-center text-center shadow-inner">
                    <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10 shadow-sm border border-slate-100">
                        <Package className="w-16 h-16 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{t('inventory.fluxZero')}</h3>
                    <p className="text-slate-400 mt-4 text-xs font-bold uppercase tracking-widest max-w-sm leading-relaxed">{t('inventory.fluxZeroSub')}</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('inventory.itemName')}</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('inventory.skuCode')}</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">{t('inventory.stockLevel')}</th>
                                    <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-xl font-black text-slate-900 uppercase tracking-tighter italic group-hover:text-emerald-600 transition-colors">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 mt-2 font-mono tracking-widest uppercase">{t('common.refPrefix')} {item.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10 text-center">
                                            <span className="bg-slate-100 px-4 py-1.5 rounded-lg text-[10px] font-black text-slate-500 tracking-widest uppercase shadow-sm">
                                                {item.sku}
                                            </span>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                                        Number(item.quantity) <= Number(item.minimum_quantity) 
                                                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                        {item.quantity} {t('inventory.units')}
                                                    </span>
                                                    {Number(item.quantity) <= Number(item.minimum_quantity) && (
                                                        <AlertCircle size={18} className="text-rose-500 animate-pulse" />
                                                    )}
                                                </div>
                                                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${Number(item.quantity) <= Number(item.minimum_quantity) ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (item.quantity / (item.minimum_quantity * 2)) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex justify-end gap-4 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="p-4 bg-white border border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                                    title={t('common.edit')}
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-4 bg-rose-50 text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title={t('common.delete')}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal - Inventory Initializer */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl border border-white/20 overflow-hidden animate-scale-in">
                        <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                                    {isEditMode ? t('common.edit') : t('inventory.add_title')}
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">{t('inventory.syncTerminal')}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                                <X size={32} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateOrUpdateItem} className="p-12 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Globe size={14} className="text-emerald-600" /> {t('inventory.field_name')}
                                </label>
                                <input 
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Hash size={16} className="text-slate-400" /> {t('inventory.field_sku')}
                                </label>
                                <input 
                                    type="text" required
                                    value={formData.sku}
                                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-emerald-600 transition-all font-black text-slate-800 uppercase text-xs"
                                    placeholder={t('inventory.skuPlaceholder')}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <Layers size={16} className="text-emerald-500" /> {t('inventory.field_quantity')}
                                    </label>
                                    <input 
                                        type="number" required min="0" step="0.01"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                        className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-emerald-600 transition-all font-black text-slate-800 uppercase text-xs"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                        <AlertCircle size={16} className="text-rose-500" /> {t('inventory.field_min_quantity')}
                                    </label>
                                    <input 
                                        type="number" required min="0" step="0.01"
                                        value={formData.minimumQuantity}
                                        onChange={(e) => setFormData({...formData, minimumQuantity: e.target.value})}
                                        className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-emerald-600 transition-all font-black text-slate-800 uppercase text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <DollarSign size={16} className="text-amber-500" /> {t('inventory.field_price')}
                                </label>
                                <input 
                                    type="number" step="0.01" min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 focus:border-emerald-600 transition-all font-black text-slate-800 uppercase text-xs"
                                />
                            </div>

                            <div className="flex gap-6 pt-10">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-10 py-6 border border-slate-200 text-slate-500 font-black rounded-[2rem] hover:bg-slate-50 transition-all uppercase tracking-[0.2em] text-[10px]"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button type="submit"
                                    disabled={formLoading}
                                    className="flex-1 px-10 py-6 bg-slate-950 text-yellow-400 font-black rounded-[2rem] shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-[0.2em] text-[10px] border border-white/5"
                                >
                                    {formLoading ? '...' : t('common.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
