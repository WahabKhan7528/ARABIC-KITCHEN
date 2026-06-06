import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Trash2, Edit, Check, Clock, User, Phone, 
  Calendar, Users, MessageSquare, X, RefreshCw, Play, LogOut, 
  ChevronRight, Filter, AlertCircle, Coffee, CheckCircle, Flame,
  Truck, Store, DollarSign, ShoppingBag, ShoppingCart
} from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../../components/ui/ArabicPattern';
import { 
  getReservations, updateReservation, deleteReservation, 
  addReservation, resetToMockData 
} from '../../utils/reservationStorage';
import {
  getOrders, updateOrderStatus, deleteOrder,
  addOrder, resetOrdersToMockData, parsePrice
} from '../../utils/orderStorage';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MenuItemsModule from './MenuItemsModule';
import StaffModule from './StaffModule';

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('reservations'); // reservations, orders
  
  // Data lists
  const [reservations, setReservations] = useState(() => getReservations());
  const [orders, setOrders] = useState(() => getOrders());

  // Filter States - Reservations
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');

  // Filter States - Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');

  const [currentTime, setCurrentTime] = useState(() => new Date());
  
  // Pure dynamic date states (runs once on mount to comply with purity rules)
  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [tomorrowStr] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Modal states (Reservations only)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null); // null for new, reservation object for edit
  const [modalData, setModalData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2',
    table: '',
    requests: ''
  });
  const [modalErrors, setModalErrors] = useState({});

  // Simulation Alert state
  const [alertToast, setAlertToast] = useState(null);

  // Sync data
  useEffect(() => {
    const handleResUpdate = () => {
      setReservations(getReservations());
    };
    const handleOrderUpdate = () => {
      setOrders(getOrders());
    };

    window.addEventListener('reservationsUpdated', handleResUpdate);
    window.addEventListener('ordersUpdated', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('reservationsUpdated', handleResUpdate);
      window.removeEventListener('ordersUpdated', handleOrderUpdate);
    };
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast utility
  const showToast = (message, title = 'System Update') => {
    setAlertToast({ title, message });
    setTimeout(() => setAlertToast(null), 4000);
  };

  // ----------------------------------------------------
  // CALCULATIONS
  // ----------------------------------------------------
  
  // Reservation Stats
  const resStats = React.useMemo(() => {
    const todayBookings = reservations.filter(res => res.date === todayStr);
    const totalToday = todayBookings.length;
    const guestsToday = todayBookings.reduce((sum, res) => sum + parseInt(res.guests || 0, 10), 0);
    const pendingActions = reservations.filter(res => res.status === 'pending').length;
    const activeSeated = todayBookings.filter(res => res.status === 'seated').length;
    return { totalToday, guestsToday, pendingActions, activeSeated };
  }, [reservations, todayStr]);

  // Orders Stats
  const orderStats = React.useMemo(() => {
    const todayOrders = orders.filter(ord => {
      const ordDate = ord.createdAt.split('T')[0];
      return ordDate === todayStr;
    });

    const totalOrdersToday = todayOrders.length;
    const activeCooking = orders.filter(ord => ord.status === 'preparing').length;
    
    // Revenue from completed orders today
    const totalRevenueToday = todayOrders
      .filter(ord => ord.status === 'completed')
      .reduce((sum, ord) => sum + (ord.total || 0), 0);

    const pendingOrders = orders.filter(ord => ord.status === 'pending').length;

    return { totalOrdersToday, activeCooking, totalRevenueToday, pendingOrders };
  }, [orders, todayStr]);

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  
  // Filtered Reservations
  const filteredReservations = React.useMemo(() => {
    return reservations.filter(res => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        res.name.toLowerCase().includes(q) ||
        res.phone.includes(q) ||
        (res.table && res.table.toLowerCase().includes(q)) ||
        (res.requests && res.requests.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === 'today') {
        matchesDate = res.date === todayStr;
      } else if (dateFilter === 'tomorrow') {
        matchesDate = res.date === tomorrowStr;
      } else if (dateFilter === 'custom') {
        matchesDate = customDate ? res.date === customDate : true;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reservations, searchQuery, statusFilter, dateFilter, customDate, todayStr, tomorrowStr]);

  // Filtered Orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter(ord => {
      const q = orderSearchQuery.toLowerCase();
      
      // Matches customer name, phone, table, address, or items list
      const itemsMatch = ord.items.some(item => item.name.toLowerCase().includes(q));
      const matchesSearch = 
        ord.name.toLowerCase().includes(q) ||
        ord.phone.includes(q) ||
        (ord.table && ord.table.toLowerCase().includes(q)) ||
        (ord.address && ord.address.toLowerCase().includes(q)) ||
        itemsMatch;

      const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'all' || ord.type === orderTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, orderSearchQuery, orderStatusFilter, orderTypeFilter]);

  // ----------------------------------------------------
  // RESERVATION ACTIONS
  // ----------------------------------------------------
  const handleStatusChange = (id, newStatus) => {
    updateReservation(id, { status: newStatus });
    
    // Auto assign a table indicator if they are confirmed and don't have one
    const foundRes = reservations.find(r => r.id === id);
    if (newStatus === 'confirmed' && foundRes && !foundRes.table) {
      const takenTables = reservations
        .filter(r => r.date === foundRes.date && r.table)
        .map(r => r.table);
      let assignedTable = '';
      for (let i = 1; i <= 20; i++) {
        const checkTable = `Table ${i}`;
        if (!takenTables.includes(checkTable)) {
          assignedTable = checkTable;
          break;
        }
      }
      if (assignedTable) {
        updateReservation(id, { table: assignedTable });
      }
    }
    showToast(`Reservation status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleTableChange = (id, newTable) => {
    updateReservation(id, { table: newTable });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to cancel and delete the reservation for ${name}?`)) {
      deleteReservation(id);
      showToast(`Reservation for ${name} has been removed.`);
    }
  };

  // ----------------------------------------------------
  // ORDER ACTIONS
  // ----------------------------------------------------
  const handleOrderStatusUpdate = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
    showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleOrderDeleteAction = (id) => {
    if (window.confirm('Are you sure you want to delete this order record?')) {
      deleteOrder(id);
      showToast('Order record removed from database.');
    }
  };

  // ----------------------------------------------------
  // SIMULATION ENGINES
  // ----------------------------------------------------
  
  // Simulate a Booking
  const handleSimulateClientBooking = () => {
    const guestNames = ['Farhan Saeed', 'Fatima Zahra', 'Osman Khalid', 'Mariam Khan', 'Sohail Warraich'];
    const phoneNumbers = ['03017654321', '03225554433', '03348889900', '03009876543', '03134567891'];
    const requestsList = ['Window table if possible.', 'Bespoke Majlis floor seating preferred.', 'Anniversary surprise.', 'None.'];

    const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    const randomRequest = requestsList[Math.floor(Math.random() * requestsList.length)];
    const randomGuests = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const randomHour = Math.floor(Math.random() * 5) + 18; // 6 PM to 10 PM
    const randomMin = Math.random() > 0.5 ? '00' : '30';

    const newBooking = {
      name: randomName,
      phone: randomPhone,
      date: todayStr,
      time: `${randomHour}:${randomMin}`,
      guests: String(randomGuests),
      requests: randomRequest
    };

    addReservation(newBooking);
    showToast(`${newBooking.name} booked a table for ${newBooking.guests} guests today.`, 'New Table Booking');
  };

  // Simulate an Order
  const handleSimulateClientOrder = () => {
    const clientNames = ['Bilal Dar', 'Saba Qamar', 'Haris Rauf', 'Maya Ali', 'Fawad Khan'];
    const phoneNumbers = ['03009876543', '03212345678', '03456789012', '03331112223', '03125556677'];
    const itemsPool = [
      { name: 'Mixed Royal Grill', price: '2,450', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
      { name: 'Al-Mandi Royal (Lamb)', price: '2,850', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hummus Beiruti Platter', price: '680', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kunafa Al-Sultani', price: '1,100', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80' },
      { name: 'Royal Mint Margarita', price: '420', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' }
    ];

    const types = ['delivery', 'takeaway', 'dine-in'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomName = clientNames[Math.floor(Math.random() * clientNames.length)];
    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

    // Select 1 to 3 random items
    const countItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    let subtotal = 0;

    for (let i = 0; i < countItems; i++) {
      const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
      if (!selectedItems.find(item => item.name === randomItem.name)) {
        const qty = Math.floor(Math.random() * 2) + 1;
        selectedItems.push({ ...randomItem, quantity: qty });
        subtotal += parsePrice(randomItem.price) * qty;
      }
    }

    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = randomType === 'delivery' ? 200 : 0;
    const total = subtotal + tax + deliveryFee;

    const newOrder = {
      name: randomName,
      phone: randomPhone,
      type: randomType,
      table: randomType === 'dine-in' ? `Table ${Math.floor(Math.random() * 15) + 1}` : '',
      address: randomType === 'delivery' ? 'House 4-B, Cavalry Grounds, Bahawalpur' : '',
      requests: Math.random() > 0.6 ? 'Make it mild spice.' : '',
      items: selectedItems,
      paymentMethod: Math.random() > 0.5 ? 'card' : 'cash',
      paymentStatus: randomType === 'dine-in' || Math.random() > 0.6 ? 'Pending' : 'Paid',
      subtotal,
      deliveryFee,
      total
    };

    addOrder(newOrder);
    showToast(`New ${randomType.toUpperCase()} order placed by ${randomName} for PKR ${total.toLocaleString()}`, 'New Culinary Order');
  };

  // Reset database
  const handleResetData = () => {
    if (window.confirm('Reset both reservations and orders databases to mock defaults for demonstration?')) {
      resetToMockData();
      resetOrdersToMockData();
      showToast('All database tables reset to factory defaults.', 'Database Reset');
    }
  };

  // ----------------------------------------------------
  // MODAL HANDLERS (Reservations)
  // ----------------------------------------------------
  const openModal = (res = null) => {
    if (res) {
      setSelectedRes(res);
      setModalData({
        name: res.name,
        phone: res.phone,
        date: res.date,
        time: res.time,
        guests: res.guests,
        table: res.table || '',
        requests: res.requests || ''
      });
    } else {
      setSelectedRes(null);
      setModalData({
        name: '',
        phone: '',
        date: todayStr,
        time: '19:00',
        guests: '2',
        table: '',
        requests: ''
      });
    }
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!modalData.name.trim()) tempErrors.name = 'Full name is required';
    const phoneRegex = /^((\+92)?(92)?(0)?3[0-9]{9})$/;
    if (!modalData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(modalData.phone.replace(/[\s-]/g, ''))) {
      tempErrors.phone = 'Invalid Pakistan phone number';
    }
    if (!modalData.date) tempErrors.date = 'Date is required';
    if (!modalData.time) tempErrors.time = 'Time is required';

    if (Object.keys(tempErrors).length > 0) {
      setModalErrors(tempErrors);
      return;
    }

    if (selectedRes) {
      updateReservation(selectedRes.id, modalData);
      showToast(`Updated reservation for ${modalData.name}`);
    } else {
      addReservation({
        ...modalData,
        status: 'confirmed'
      });
      showToast(`Manual reservation created for ${modalData.name}`, 'Walk-In Added');
    }
    setIsModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({ ...prev, [name]: value }));
    if (modalErrors[name]) {
      setModalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <DashboardLayout activeModule={activeTab} setActiveModule={setActiveTab} currentTime={currentTime}>
      {/* Floating System Update Toast Alert */}
      {alertToast && (
        <div className="fixed top-6 right-6 z-[999] max-w-sm w-full bg-[#1F1108]/95 border-2 border-gold/60 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-[2px] animate-scale-up flex gap-3.5 items-start text-left">
          <div className="bg-gold/10 p-2 rounded-full border border-gold/30 text-gold mt-0.5">
            <CheckCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-gold font-display  text-body-md font-semibold">{alertToast.title}</h4>
            <p className="text-label-xs text-cream/80 mt-1 leading-relaxed">{alertToast.message}</p>
          </div>
          <button 
            onClick={() => setAlertToast(null)} 
            className="text-cream/40 hover:text-gold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}


        {/* ----------------------------------------------------
            TAB 1: RESERVATIONS SECTION
            ---------------------------------------------------- */}
        {activeTab === 'reservations' && (
          <div className="animate-fade-in space-y-6">
            {/* Header / Intro */}
            <div className="border-b border-gold/10 pb-4 text-left">
              <h2 className="text-title-sm font-display text-gold-light">Table Reservations</h2>
              <p className="text-body-sm text-cream/60 mt-1">
                Monitor and manage table reservations, seat active walk-in guests, update guest statuses, and assign tables in real-time.
              </p>
            </div>

            {/* Stats row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Today's Bookings</span>
                <span className="font-display  text-title-md text-gold block mt-2 font-bold">{resStats.totalToday}</span>
              </div>
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Expected Guests</span>
                <span className="font-display  text-title-md text-gold-light block mt-2 font-bold">{resStats.guestsToday}</span>
              </div>
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Pending Approvals</span>
                <span className="font-display  text-title-md text-amber-400 block mt-2 font-bold">{resStats.pendingActions}</span>
              </div>
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Active Seated Tables</span>
                <span className="font-display  text-title-md text-cyan-400 block mt-2 font-bold">{resStats.activeSeated}</span>
              </div>
            </section>

            {/* Filter control bar */}
            <section className="border border-gold/15 bg-[#1F1108]/50 p-4 rounded-[2px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="flex flex-wrap items-center gap-3.5 flex-1 w-full">
                <div className="relative min-w-[240px] flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, table or request..."
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-gold font-body"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Status:</span>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body"
                  >
                    <option value="all">All</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="confirmed">✅ Confirmed</option>
                    <option value="seated">🍽️ Seated</option>
                    <option value="completed">🏆 Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Date:</span>
                  <select 
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      if (e.target.value !== 'custom') setCustomDate('');
                    }}
                    className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                {dateFilter === 'custom' && (
                  <input 
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2 py-1 focus:outline-none focus:border-gold [color-scheme:dark]"
                  />
                )}
              </div>

              <div>
                <button
                  onClick={() => openModal(null)}
                  className="w-full lg:w-auto px-5 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 font-body cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Walk-In
                </button>
              </div>
            </section>

            {/* Table */}
            <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
              <div className="overflow-x-auto w-full relative z-10">
                {filteredReservations.length === 0 ? (
                  <div className="py-16 text-center text-cream/40 text-body-sm font-body">No reservations found.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-body-sm">
                    <thead>
                      <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                        <th className="py-4 px-5">Guest details</th>
                        <th className="py-4 px-4">Schedule</th>
                        <th className="py-4 px-4 text-center">Seats</th>
                        <th className="py-4 px-4">Table</th>
                        <th className="py-4 px-5">Requests</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {filteredReservations.map((res) => {
                        let badgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/25';
                        if (res.status === 'confirmed') badgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25';
                        else if (res.status === 'seated') badgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25 animate-pulse';
                        else if (res.status === 'completed') badgeClass = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';
                        else if (res.status === 'cancelled') badgeClass = 'bg-rose-950/40 text-rose-400 border-rose-500/20';

                        return (
                          <tr key={res.id} className={`hover:bg-gold/[0.02] transition-colors ${res.status === 'completed' || res.status === 'cancelled' ? 'opacity-60' : ''}`}>
                            <td className="py-4 px-5">
                              <div className="flex flex-col text-left">
                                <span className="text-ivory font-display  text-body-md font-bold">{res.name}</span>
                                <span className="text-label-xs text-cream/50 font-mono mt-0.5">{res.phone}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col text-left">
                                <span className="font-semibold">{res.date === todayStr ? 'Today' : res.date === tomorrowStr ? 'Tomorrow' : res.date}</span>
                                <span className="text-label-xs text-gold-light/85 font-semibold mt-0.5">{res.time}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-mono px-2 py-1 bg-[#1A0A00]/40 border border-gold/10 text-ivory font-bold">{res.guests}</span>
                            </td>
                            <td className="py-4 px-4">
                              <input 
                                type="text" 
                                value={res.table || ''} 
                                onChange={(e) => handleTableChange(res.id, e.target.value)}
                                placeholder="Assign..."
                                className="w-20 bg-[#1A0A00]/40 border border-gold/15 rounded-[2px] px-2 py-1 text-label-xs text-ivory focus:outline-none focus:border-gold/50"
                              />
                            </td>
                            <td className="py-4 px-5 text-cream/70  max-w-xs truncate text-left">
                              {res.requests ? `"${res.requests}"` : '-'}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${badgeClass}`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5 font-body">
                                {res.status === 'pending' && (
                                  <button onClick={() => handleStatusChange(res.id, 'confirmed')} className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Confirm</button>
                                )}
                                {res.status === 'confirmed' && (
                                  <button onClick={() => handleStatusChange(res.id, 'seated')} className="px-2 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Seat</button>
                                )}
                                {res.status === 'seated' && (
                                  <button onClick={() => handleStatusChange(res.id, 'completed')} className="px-2 py-1 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Complete</button>
                                )}
                                {res.status !== 'completed' && res.status !== 'cancelled' && (
                                  <button onClick={() => handleStatusChange(res.id, 'cancelled')} className="px-2 py-1 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Cancel</button>
                                )}
                                <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                                <button onClick={() => openModal(res)} className="p-1 border border-gold/10 hover:border-gold/30 bg-[#1A0A00]/40 text-cream/60 hover:text-gold rounded-[2px] cursor-pointer"><Edit className="w-3 h-3" /></button>
                                <button onClick={() => handleDelete(res.id, res.name)} className="p-1 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: ORDERS SECTION
            ---------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in space-y-6">
            {/* Header / Intro */}
            <div className="border-b border-gold/10 pb-4 text-left">
              <h2 className="text-title-sm font-display text-gold-light">Orders Management</h2>
              <p className="text-body-sm text-cream/60 mt-1">
                Track and process customer orders, update kitchen preparation stages, dispatch delivery or takeaway packages, and manage billing.
              </p>
            </div>

            {/* Stats row */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Today's Orders</span>
                <span className="font-display  text-title-md text-gold block mt-2 font-bold">{orderStats.totalOrdersToday}</span>
              </div>
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Active Cooking</span>
                <span className="font-display  text-title-md text-orange-400 block mt-2 font-bold">{orderStats.activeCooking}</span>
              </div>
              <div className="border border-[#C9952A]/35 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Today's Order Revenue</span>
                <span className="font-display  text-title-md text-emerald-400 block mt-2 font-bold">PKR {orderStats.totalRevenueToday.toLocaleString()}</span>
              </div>
              <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Pending Order Alerts</span>
                <span className="font-display  text-title-md text-amber-400 block mt-2 font-bold">{orderStats.pendingOrders}</span>
              </div>
            </section>

            {/* Filter control bar */}
            <section className="border border-gold/15 bg-[#1F1108]/50 p-4 rounded-[2px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
              <div className="flex flex-wrap items-center gap-3.5 flex-1 w-full">
                
                {/* Search */}
                <div className="relative min-w-[240px] flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                  <input 
                    type="text" 
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search customer, phone, items or table/address..."
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-gold font-body"
                  />
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2">
                  <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Status:</span>
                  <select 
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body"
                  >
                    <option value="all">All</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="preparing">🔥 Preparing</option>
                    <option value="served">📦 Dispatched / Served</option>
                    <option value="completed">🏆 Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>

                {/* Service Type */}
                <div className="flex items-center gap-2">
                  <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Type:</span>
                  <select 
                    value={orderTypeFilter}
                    onChange={(e) => setOrderTypeFilter(e.target.value)}
                    className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body"
                  >
                    <option value="all">All Modes</option>
                    <option value="delivery">🚚 Delivery</option>
                    <option value="takeaway">🛍️ Takeaway</option>
                    <option value="dine-in">🍽️ Dine-In</option>
                  </select>
                </div>

              </div>
            </section>

            {/* Table */}
            <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
              <div className="overflow-x-auto w-full relative z-10">
                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center text-cream/40 text-body-sm font-body">No orders found.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-body-sm">
                    <thead>
                      <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                        <th className="py-4 px-5">Order ID & Time</th>
                        <th className="py-4 px-5">Customer details</th>
                        <th className="py-4 px-4">Items Ordered</th>
                        <th className="py-4 px-4">Dest. / Table</th>
                        <th className="py-4 px-4">Total bill</th>
                        <th className="py-4 px-4">Fulfillment Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/10">
                      {filteredOrders.map((ord) => {
                        let statusBadgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/25';
                        if (ord.status === 'preparing') statusBadgeClass = 'bg-orange-950/40 text-orange-400 border-orange-500/25 animate-pulse';
                        else if (ord.status === 'served') statusBadgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25';
                        else if (ord.status === 'completed') statusBadgeClass = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';
                        else if (ord.status === 'cancelled') statusBadgeClass = 'bg-rose-950/40 text-rose-400 border-rose-500/20';

                        // Format timestamp
                        const timeStr = new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const dateStr = ord.createdAt.split('T')[0] === todayStr ? 'Today' : ord.createdAt.split('T')[0];

                        return (
                          <tr key={ord.id} className={`hover:bg-gold/[0.02] transition-colors ${ord.status === 'completed' || ord.status === 'cancelled' ? 'opacity-60' : ''}`}>
                            
                            {/* Order ID & Time */}
                            <td className="py-4 px-5 font-mono text-label-xs text-gold-light text-left">
                              <div className="flex flex-col">
                                <span className="font-bold">{ord.id.substring(4, 9).toUpperCase()}</span>
                                <span className="text-label-xs text-cream/40 mt-0.5">{dateStr} {timeStr}</span>
                              </div>
                            </td>

                            {/* Customer details details */}
                            <td className="py-4 px-5">
                              <div className="flex flex-col text-left">
                                <span className="font-display  text-body-sm text-ivory font-bold">{ord.name}</span>
                                <span className="text-label-xs text-cream/50 font-mono mt-0.5">{ord.phone}</span>
                              </div>
                            </td>

                            {/* Items Ordered */}
                            <td className="py-4 px-4 font-body leading-relaxed max-w-[200px] text-left">
                              <div className="space-y-0.5">
                                {ord.items.map((item, idx) => (
                                  <div key={idx} className="text-cream/80 flex justify-between gap-1 text-label-xs font-body">
                                    <span className="truncate pr-1">&#8226; {item.name}</span>
                                    <span className="font-bold text-gold shrink-0">&times;{item.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Destination Table or Address */}
                            <td className="py-4 px-4 max-w-xs text-left">
                              <div className="flex items-center gap-1.5">
                                {ord.type === 'delivery' ? (
                                  <div className="flex items-start gap-1 text-label-xs text-cream/75 leading-tight">
                                    <Truck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                                    <span className="line-clamp-2" title={ord.address}>{ord.address}</span>
                                  </div>
                                ) : ord.type === 'takeaway' ? (
                                  <div className="flex items-center gap-1 text-label-xs text-cream/60">
                                    <Store className="w-3.5 h-3.5 text-gold" /> Takeaway Pickup
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-label-xs text-cream/80 font-bold">
                                    <Coffee className="w-3.5 h-3.5 text-gold" /> {ord.table || 'Table TBD'}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Total price & payment status */}
                            <td className="py-4 px-4 font-mono font-bold text-ivory text-left">
                              <div className="flex flex-col">
                                <span>PKR {ord.total.toLocaleString()}</span>
                                <span className={`text-label-xs uppercase font-body mt-0.5 ${ord.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                  {ord.paymentMethod} ({ord.paymentStatus})
                                </span>
                              </div>
                            </td>

                            {/* Status badge */}
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${statusBadgeClass}`}>
                                {ord.status === 'served' 
                                  ? (ord.type === 'delivery' ? 'Dispatched' : ord.type === 'takeaway' ? 'Ready for Pickup' : 'Served')
                                  : ord.status
                                }
                              </span>
                            </td>

                            {/* Action options */}
                            <td className="py-4 px-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5 font-body">
                                
                                {/* Pending state -> prepare */}
                                {ord.status === 'pending' && (
                                  <button 
                                    onClick={() => handleOrderStatusUpdate(ord.id, 'preparing')}
                                    className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer"
                                  >
                                    Prepare
                                  </button>
                                )}

                                {/* Preparing state -> Dispatch / Ready / Serve */}
                                {ord.status === 'preparing' && (
                                  <button 
                                    onClick={() => handleOrderStatusUpdate(ord.id, 'served')}
                                    className="px-2.5 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer"
                                  >
                                    {ord.type === 'delivery' ? 'Dispatch' : ord.type === 'takeaway' ? 'Ready' : 'Serve'}
                                  </button>
                                )}

                                {/* Served / Ready state -> Complete */}
                                {ord.status === 'served' && (
                                  <button 
                                    onClick={() => handleOrderStatusUpdate(ord.id, 'completed')}
                                    className="px-2.5 py-1 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer"
                                  >
                                    Complete
                                  </button>
                                )}

                                {/* Cancel */}
                                {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                                  <button 
                                    onClick={() => handleOrderStatusUpdate(ord.id, 'cancelled')}
                                    className="px-2.5 py-1 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}

                                <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                                
                                {/* Delete */}
                                <button 
                                  onClick={() => handleOrderDeleteAction(ord.id)}
                                  className="p-1 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] cursor-pointer"
                                  title="Delete order"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>

                              </div>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: MENU ITEMS SECTION
            ---------------------------------------------------- */}
        {activeTab === 'menu-items' && (
          <MenuItemsModule showToast={showToast} />
        )}

        {activeTab === 'staff' && <StaffModule />}

        {/* Manual / Edit Booking Overlay Modal (Reservations) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[995] flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#0F0500]/85 backdrop-blur-sm transition-opacity" />
            <div className="relative w-full max-w-lg bg-[#1F1108] border-2 border-gold/30 p-8 shadow-2xl rounded-[2px] overflow-hidden animate-scale-up z-10 text-left">
              <div className="absolute inset-2 border border-gold/10 pointer-events-none" />
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-cream/40 hover:text-gold transition-colors p-1 cursor-pointer"><X className="w-5 h-5" /></button>
              <header className="mb-6 text-center">
                <span className="font-arabic text-label-xs tracking-[0.25em] text-gold block">{selectedRes ? 'تعديل الحجز' : 'حجز يدوي جديد'}</span>
                <h3 className="font-display  text-title-sm text-gold-light mt-1">{selectedRes ? 'Edit Reservation' : 'Create Walk-In / Manual Booking'}</h3>
                <MuqarnasArch color="#C9952A" size={30} className="mt-2 mx-auto" />
              </header>
              <form onSubmit={handleModalSave} className="space-y-4 font-body">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><User className="w-2.5 h-2.5 text-gold" /> Full Name</label>
                    <input type="text" name="name" value={modalData.name} onChange={handleModalInputChange} placeholder="e.g. Asim Raza" className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body" />
                    {modalErrors.name && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.name}</span>}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><Phone className="w-2.5 h-2.5 text-gold" /> Phone</label>
                    <input type="tel" name="phone" value={modalData.phone} onChange={handleModalInputChange} placeholder="e.g. 03001234567" className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body" />
                    {modalErrors.phone && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.phone}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><Calendar className="w-2.5 h-2.5 text-gold" /> Date</label>
                    <input type="date" name="date" value={modalData.date} onChange={handleModalInputChange} className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]" />
                    {modalErrors.date && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.date}</span>}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><Clock className="w-2.5 h-2.5 text-gold" /> Time</label>
                    <input type="time" name="time" value={modalData.time} onChange={handleModalInputChange} className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]" />
                    {modalErrors.time && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.time}</span>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><Users className="w-2.5 h-2.5 text-gold" /> Guests count</label>
                    <select name="guests" value={modalData.guests} onChange={handleModalInputChange} className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-2.5 py-2.5 text-body-sm text-ivory focus:outline-none focus:border-gold font-body">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => <option key={num} value={num} className="bg-charcoal text-ivory">{num} Guests</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><Check className="w-2.5 h-2.5 text-gold" /> Table</label>
                    <input type="text" name="table" value={modalData.table} onChange={handleModalInputChange} placeholder="e.g. Table 4" className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body" />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5 text-gold" /> Special Requests</label>
                  <textarea name="requests" value={modalData.requests} onChange={handleModalInputChange} rows="2" placeholder="Requests..." className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body resize-none" />
                </div>
                <div className="pt-4 flex gap-3.5">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gold/30 text-gold hover:bg-gold/5 font-body text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer">{selectedRes ? 'Save' : 'Confirm'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
}
