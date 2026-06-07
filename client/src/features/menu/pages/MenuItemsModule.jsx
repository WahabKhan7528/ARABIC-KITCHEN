import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, createItem, updateItem, deleteItem } from '../../../store/slices/itemSlice';
import { Search, Plus, Trash2, Edit, CheckCircle, X } from 'lucide-react';
import { MENU_CATEGORIES, CATEGORY_SLUGS } from '../../../constants';

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
    description: ''
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
        description: item.description || ''
      });
    } else {
      setSelectedItem(null);
      setModalData({
        name: '',
        arabicName: '',
        price: '',
        category: 'grills',
        description: ''
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
      <div className="border-b border-gold/10 pb-4 text-left">
        <h2 className="text-title-md md:text-title-lg font-display text-gold-light font-bold drop-shadow-md tracking-wide">Menu Items</h2>
        <p className="text-body-sm text-cream/60 mt-1">
          Browse, add, edit, or delete items from the restaurant's active menu, including prices, categories, descriptions, and images.
        </p>
      </div>

      {/* Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Total Items</span>
          <span className="font-display text-title-md text-gold block mt-2 font-bold">{menuItems.length}</span>
        </div>
      </section>

      {/* Control Bar */}
      <section className="border border-gold/15 bg-[#1F1108]/50 p-4 rounded-[2px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap items-center gap-3.5 flex-1 w-full">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-gold font-body text-ivory"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body text-ivory"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{MENU_CATEGORIES[cat]}</option>)}
            </select>
          </div>
        </div>

        <div>
          <button
            onClick={() => openModal(null)}
            className="w-full lg:w-auto px-5 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 font-body cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Menu Item
          </button>
        </div>
      </section>

      {/* Table */}
      <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
        <div className="overflow-x-auto w-full relative z-10">
          {status === 'loading' ? (
            <div className="py-16 text-center text-cream/40 text-body-sm font-body">Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-cream/40 text-body-sm font-body">No menu items found.</div>
          ) : (
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                  <th className="py-4 px-5">Image</th>
                  <th className="py-4 px-5">Dish Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price (PKR)</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gold/[0.02] transition-colors">
                    <td className="py-4 px-5">
                      <div className="w-16 h-16 rounded-[2px] overflow-hidden bg-[#1A0A00]">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="text-ivory font-display text-body-md font-bold">{item.name}</span>
                        <span className="text-label-xs text-gold/80 font-arabic mt-0.5">{item.nameArabic || item.arabicName}</span>
                        <span className="text-label-xs text-cream/50 max-w-xs truncate mt-1">{item.description}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-cream/70 font-semibold">{MENU_CATEGORIES[item.category] || item.category}</span>
                    </td>
                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">
                      {item.price}
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 font-body">
                        <button onClick={() => openModal(item)} className="p-2 border border-gold/10 hover:border-gold/30 bg-[#1A0A00]/40 text-cream/60 hover:text-gold rounded-[2px] cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item._id, item.name)} className="p-2 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] cursor-pointer"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A0A00] border border-gold/30 rounded-[2px] w-full max-w-lg shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gold/15 bg-[#1F1108]">
              <h3 className="font-display text-title-sm text-gold">
                {selectedItem ? 'Edit Menu Item' : 'New Menu Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/40 hover:text-ivory transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {modalErrors.submit && (
                <div className="mb-4 p-3 bg-red-950/50 border border-red-500/50 rounded text-red-400 text-sm text-center font-body">
                  {modalErrors.submit}
                </div>
              )}
              <form id="menuForm" onSubmit={handleModalSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 block">English Name</label>
                    <input 
                      type="text" 
                      value={modalData.name}
                      onChange={(e) => {
                        setModalData(prev => ({...prev, name: e.target.value}));
                        setModalErrors(prev => ({...prev, name: ''}));
                      }}
                      className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none"
                    />
                    {modalErrors.name && <span className="text-accent-red text-xs mt-1 block">{modalErrors.name}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 block">Arabic Name</label>
                    <input 
                      type="text" 
                      value={modalData.arabicName}
                      onChange={(e) => setModalData(prev => ({...prev, arabicName: e.target.value}))}
                      className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none font-arabic text-right dir-rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 block">Price (PKR)</label>
                    <input 
                      type="number" 
                      value={modalData.price}
                      onChange={(e) => setModalData(prev => ({...prev, price: e.target.value}))}
                      className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none"
                    />
                    {modalErrors.price && <span className="text-accent-red text-xs mt-1 block">{modalErrors.price}</span>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 block">Category</label>
                    <select 
                      value={modalData.category}
                      onChange={(e) => setModalData(prev => ({...prev, category: e.target.value}))}
                      className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{MENU_CATEGORIES[cat]}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 block">Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gold file:text-[#1A0A00] hover:file:bg-[#E8BA5A] cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 block">Description</label>
                  <textarea 
                    value={modalData.description}
                    onChange={(e) => setModalData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                    className="w-full bg-[#1A0A00] border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:border-gold focus:outline-none resize-none"
                  />
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gold/15 bg-[#1F1108] flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gold/30 text-cream hover:bg-gold/10 rounded-[2px] text-label-xs uppercase tracking-widest font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="menuForm"
                className="px-5 py-2 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 cursor-pointer"
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
