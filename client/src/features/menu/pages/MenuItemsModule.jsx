import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, createItem, updateItem, deleteItem } from '../../../store/slices/itemSlice';
import { Search, Plus, Trash2, Edit, CheckCircle, X, UtensilsCrossed } from 'lucide-react';
import { MENU_CATEGORIES, CATEGORY_SLUGS } from '../../../constants';
import StatsCard from '../../dashboard/components/StatsCard';

export default function MenuItemsModule({ showToast, requestConfirm }) {
  const dispatch = useDispatch();
  const { items: menuItems, status } = useSelector((state) => state.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [modalData, setModalData] = useState({
    name: '',
    arabicName: '',
    price: '',
    category: 'grills',
    description: '',
    inStock: true
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [modalErrors, setModalErrors] = useState({});

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const categories = Object.keys(MENU_CATEGORIES);

  const filteredItems = menuItems.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.name?.toLowerCase().includes(q) || item.nameArabic?.includes(q) || item.arabicName?.includes(q) || item.description?.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setModalData({
        name: item.name,
        arabicName: item.nameArabic || item.arabicName || '',
        price: item.price,
        category: item.category || 'grills',
        description: item.description || '',
        inStock: item.inStock !== undefined ? item.inStock : true
      });
    } else {
      setSelectedItem(null);
      setModalData({
        name: '',
        arabicName: '',
        price: '',
        category: 'grills',
        description: '',
        inStock: true
      });
    }
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!modalData.name.trim()) tempErrors.name = 'Name is required';
    if (!String(modalData.price).trim()) tempErrors.price = 'Price is required';

    if (Object.keys(tempErrors).length > 0) {
      setModalErrors(tempErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', modalData.name);
    formData.append('nameArabic', modalData.arabicName);
    formData.append('price', modalData.price);
    formData.append('category', modalData.category);
    formData.append('description', modalData.description);
    formData.append('inStock', modalData.inStock);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (selectedItem) {
        await dispatch(updateItem({ id: selectedItem._id, formData })).unwrap();
        if (showToast) showToast(`Updated menu item: ${modalData.name}`);
      } else {
        await dispatch(createItem(formData)).unwrap();
        if (showToast) showToast(`Created new menu item: ${modalData.name}`);
      }
      setIsModalOpen(false);
    } catch (err) {
      setModalErrors({ submit: typeof err === 'string' ? err : 'Failed to save item.' });
    }
  };

  const handleDelete = (id, name) => {
    requestConfirm(`Are you sure you want to delete ${name}?`, () => {
      dispatch(deleteItem(id));
      if (showToast) showToast(`Menu item ${name} deleted.`);
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header / Intro */}
      <div className="border-b border-gold/10 pb-5 text-left">
        <h2 className="text-title-md md:text-title-lg font-display bg-gradient-to-r from-gold-light via-gold to-cream bg-clip-text text-transparent font-bold drop-shadow-md tracking-wider uppercase">Menu Items Management</h2>
        <p className="text-body-sm text-cream/60 mt-1.5">
          Browse, add, edit, or delete items from the restaurant's active menu, including prices, categories, descriptions, and images.
        </p>
        <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent mt-4 rounded-full" />
      </div>

      {/* Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        <StatsCard label="Total Items" value={menuItems.length} icon={UtensilsCrossed} valueColorClass="text-gold" />
      </section>

      {/* Control Bar */}
      <section className="border border-gold/15 bg-gradient-to-br from-[#1F1108]/70 to-[#120500]/80 backdrop-blur-md p-5 rounded-lg flex flex-col lg:flex-row gap-5 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 flex-1 w-full">
          <div className="relative min-w-[260px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-[#1A0A00]/70 border border-gold/15 rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 font-body text-ivory placeholder:text-cream/30"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-label-xs uppercase tracking-widest text-cream/40 font-bold">Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3.5 py-2.5 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 font-body text-ivory cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{MENU_CATEGORIES[cat]}</option>)}
            </select>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <button
            onClick={() => openModal(null)}
            className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 font-body cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="border border-gold/15 bg-gradient-to-b from-[#1F1108]/85 to-[#0F0500]/95 backdrop-blur-md overflow-hidden rounded-xl relative">
        <div className="overflow-x-auto w-full relative z-10">
          {status === 'loading' ? (
            <div className="py-20 text-center text-cream/40 text-body-sm font-body">Loading menu items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-cream/40 text-body-sm font-body">No menu items found.</div>
          ) : (
            <table className="w-full text-left border-collapse text-body-md">
              <thead>
                <tr className="border-b border-gold/15 text-gold uppercase tracking-[0.15em] text-label-sm bg-[#120500]/80 font-body">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Dish Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price (PKR)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gold/[0.03] transition-colors duration-300">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1A0A00]/60 border border-gold/10 hover:border-gold/20">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="text-ivory font-display text-body-lg font-bold tracking-wide">{item.name}</span>
                        <span className="text-body-sm text-gold/85 font-arabic mt-0.5">{item.nameArabic || item.arabicName}</span>
                        <span className="text-label-sm text-cream/50 max-w-xs truncate mt-1.5">{item.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-cream/75 font-semibold font-body text-body-md">{MENU_CATEGORIES[item.category] || item.category}</span>
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">
                      <span className="bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-1 rounded text-body-sm block w-max mb-1">
                        {item.price.toLocaleString()}
                      </span>
                      {!item.inStock && (
                        <span className="bg-red-950/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider block w-max">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 font-body">
                        <button onClick={() => openModal(item)} className="p-2 border border-gold/15 hover:border-gold/45 bg-[#1A0A00]/50 text-cream/60 hover:text-gold rounded-full transition-colors duration-200 cursor-pointer" title="Edit Item"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item._id, item.name)} className="p-2 border border-accent-red/20 hover:border-accent-red/60 bg-[#1A0A00]/50 text-accent-red/60 hover:text-ivory rounded-full transition-colors duration-200 cursor-pointer" title="Delete Item"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#080200]/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-b from-[#1A0A00]/95 via-[#1E0E05]/98 to-[#0C0400]/98 border border-gold/25 rounded-xl w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col animate-scale-up">
            <div className="flex justify-between items-center p-5 border-b border-gold/15 bg-gradient-to-r from-[#1F1108] to-[#120500]">
              <h3 className="font-display text-title-sm text-gold font-bold tracking-wide">
                {selectedItem ? '🔑 Edit Menu Item' : '✨ New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/40 hover:text-gold transition-colors duration-300 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
              {modalErrors.submit && (
                <div className="p-3.5 bg-red-950/50 border border-red-500/50 rounded-lg text-red-400 text-sm text-center font-body">
                  {modalErrors.submit}
                </div>
              )}
              <form id="menuForm" onSubmit={handleModalSave} className="space-y-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">English Name</label>
                    <input 
                      type="text" 
                      value={modalData.name}
                      onChange={(e) => {
                        setModalData(prev => ({...prev, name: e.target.value}));
                        setModalErrors(prev => ({...prev, name: ''}));
                      }}
                      className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none"
                    />
                    {modalErrors.name && <span className="text-accent-red text-xs mt-1 block font-bold">{modalErrors.name}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Arabic Name</label>
                    <input 
                      type="text" 
                      value={modalData.arabicName}
                      onChange={(e) => setModalData(prev => ({...prev, arabicName: e.target.value}))}
                      className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none font-arabic text-right dir-rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Price (PKR)</label>
                    <input 
                      type="number" 
                      value={modalData.price}
                      onChange={(e) => setModalData(prev => ({...prev, price: e.target.value}))}
                      className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none font-mono"
                    />
                    {modalErrors.price && <span className="text-accent-red text-xs mt-1 block font-bold">{modalErrors.price}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Category</label>
                    <select 
                      value={modalData.category}
                      onChange={(e) => setModalData(prev => ({...prev, category: e.target.value}))}
                      className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none cursor-pointer"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{MENU_CATEGORIES[cat]}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Available / In Stock</label>
                  <input 
                    type="checkbox"
                    checked={modalData.inStock}
                    onChange={(e) => setModalData(prev => ({...prev, inStock: e.target.checked}))}
                    className="w-5 h-5 accent-gold cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Image Attachment</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-gold file:text-[#1A0A00] file:font-bold hover:file:bg-[#E8BA5A] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-label-xs uppercase tracking-widest text-cream/50 block font-semibold">Description</label>
                  <textarea 
                    value={modalData.description}
                    onChange={(e) => setModalData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                    className="w-full bg-[#120500]/75 border border-gold/15 rounded-lg px-3.5 py-2.5 text-body-sm text-ivory focus:border-gold focus:ring-2 focus:ring-gold/25 transition-all duration-300 focus:outline-none resize-none"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gold/15 bg-gradient-to-r from-[#1F1108] to-[#120500] flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-gold/20 text-cream/80 hover:bg-gold/10 rounded-full text-label-xs uppercase tracking-widest font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="menuForm"
                className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#1A0A00] rounded-full text-label-xs uppercase tracking-widest font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(201,149,42,0.15)]"
              >
                <CheckCircle className="w-4 h-4" />
                {selectedItem ? 'Save Changes' : 'Create Dish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
