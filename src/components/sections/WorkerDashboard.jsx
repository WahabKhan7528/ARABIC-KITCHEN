import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Trash2, Edit, Check, Clock, User, Phone, 
  Calendar, Users, MessageSquare, X, RefreshCw, Play, LogOut, 
  ChevronRight, Filter, AlertCircle, Coffee, CheckCircle, Flame
} from 'lucide-react';
import { KhatamPattern, MuqarnasArch } from '../ui/ArabicPattern';
import { 
  getReservations, updateReservation, deleteReservation, 
  addReservation, resetToMockData 
} from '../../utils/reservationStorage';

export default function WorkerDashboard() {
  const [reservations, setReservations] = useState(() => getReservations());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [currentTime, setCurrentTime] = useState(() => new Date());
  
  // Pure dynamic date states (runs once on mount to comply with purity rules)
  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [tomorrowStr] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Modal states
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

  // Initialize and Sync data
  useEffect(() => {
    const handleUpdate = () => {
      setReservations(getReservations());
    };
    window.addEventListener('reservationsUpdated', handleUpdate);
    return () => window.removeEventListener('reservationsUpdated', handleUpdate);
  }, []);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stats Calculations
  const stats = React.useMemo(() => {
    const todayBookings = reservations.filter(res => res.date === todayStr);
    
    const totalToday = todayBookings.length;
    const guestsToday = todayBookings.reduce((sum, res) => sum + parseInt(res.guests || 0, 10), 0);
    const pendingActions = reservations.filter(res => res.status === 'pending').length;
    const activeSeated = todayBookings.filter(res => res.status === 'seated').length;

    return { totalToday, guestsToday, pendingActions, activeSeated };
  }, [reservations, todayStr]);

  // Filtering Logic
  const filteredReservations = React.useMemo(() => {
    return reservations.filter(res => {
      // 1. Search Query filter (matches name, phone, table, requests)
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        res.name.toLowerCase().includes(q) ||
        res.phone.includes(q) ||
        (res.table && res.table.toLowerCase().includes(q)) ||
        (res.requests && res.requests.toLowerCase().includes(q));

      // 2. Status filter
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      // 3. Date filter
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

  // Quick Action: Status Change
  const handleStatusChange = (id, newStatus) => {
    updateReservation(id, { status: newStatus });
    
    // Auto assign a table indicator if they are confirmed and don't have one
    const foundRes = reservations.find(r => r.id === id);
    if (newStatus === 'confirmed' && foundRes && !foundRes.table) {
      // Find first available virtual table number
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

  // Quick Action: Assign Table
  const handleTableChange = (id, newTable) => {
    updateReservation(id, { table: newTable });
  };

  // Quick Action: Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to cancel and delete the reservation for ${name}?`)) {
      deleteReservation(id);
      showToast(`Reservation for ${name} has been removed.`);
    }
  };

  // Toast utility
  const showToast = (message, title = 'System Update') => {
    setAlertToast({ title, message });
    setTimeout(() => setAlertToast(null), 4000);
  };

  // Simulation Engine: Client Books on Website
  const handleSimulateClientBooking = () => {
    const guestNames = [
      'Farhan Saeed', 'Fatima Zahra', 'Osman Khalid', 'Mariam Khan', 
      'Sohail Warraich', 'Rabia Butt', 'Adnan Malik', 'Mahnoor Baloch'
    ];
    const phoneNumbers = [
      '03017654321', '03225554433', '03348889900', '03009876543',
      '03134567891', '03461234567', '03212345678', '03029998877'
    ];
    const requestsList = [
      'Window table if possible.',
      'Bespoke Majlis floor seating preferred.',
      'Anniversary dessert surprise.',
      'Needs a high chair for toddler.',
      'No special requests.',
      'Celebrating family promotion dinner.'
    ];

    const randomName = guestNames[Math.floor(Math.random() * guestNames.length)];
    const randomPhone = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    const randomRequest = requestsList[Math.floor(Math.random() * requestsList.length)];
    const randomGuests = Math.floor(Math.random() * 6) + 1; // 1 to 6
    const randomHour = Math.floor(Math.random() * 5) + 18; // 18 to 22 (6 PM to 10 PM)
    const randomMin = Math.random() > 0.5 ? '00' : '30';

    const newBooking = {
      name: randomName,
      phone: randomPhone,
      date: todayStr, // Today
      time: `${randomHour}:${randomMin}`,
      guests: String(randomGuests),
      requests: randomRequest
    };

    const added = addReservation(newBooking);
    showToast(
      `${added.name} reserved a table for ${added.guests} guests at ${added.time} today.`,
      'New Client Booking'
    );
  };

  // Reset to Mock data
  const handleResetData = () => {
    if (window.confirm('Reset local storage to original mock reservations for demonstration?')) {
      resetToMockData();
      showToast('Dashboard database reset to original mock reservations.', 'Database Reset');
    }
  };

  // Open Add/Edit Modal
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

  // Handle Modal Save
  const handleModalSave = (e) => {
    e.preventDefault();
    
    // Validation
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
      // Edit mode
      updateReservation(selectedRes.id, modalData);
      showToast(`Updated reservation for ${modalData.name}`);
    } else {
      // Add Walk-in mode
      // Manual walkins are confirmed directly
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
    <div 
      className="min-h-screen text-ivory select-none font-body relative overflow-x-hidden pt-28 pb-16 px-4 md:px-8 bg-[#1A0A00]"
      style={{
        background: 'radial-gradient(ellipse at center, #230C01 0%, #080200 100%)',
      }}
    >
      {/* Arabic Geometric Pattern Overlay */}
      <KhatamPattern opacity={0.04} />

      {/* Floating System Update Toast Alert */}
      {alertToast && (
        <div className="fixed top-6 right-6 z-[999] max-w-sm w-full bg-[#1F1108]/95 border-2 border-gold/60 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-[2px] animate-scale-up flex gap-3.5 items-start">
          <div className="bg-gold/10 p-2 rounded-full border border-gold/30 text-gold mt-0.5">
            <CheckCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-gold font-display italic text-title-sm font-semibold">{alertToast.title}</h4>
            <p className="text-label-sm text-cream/80 mt-1 leading-relaxed">{alertToast.message}</p>
          </div>
          <button 
            onClick={() => setAlertToast(null)} 
            className="text-cream/40 hover:text-gold transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Control Header Panel */}
        <header className="border border-gold/20 bg-[#1F1108]/75 backdrop-blur-md p-6 mb-8 rounded-[2px] flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="border border-gold/30 p-2 rounded-[2px] bg-[#1A0A00]/60">
              <Coffee className="w-6 h-6 text-gold" />
            </div>
            <div>
              <span className="font-arabic text-label-xs tracking-[0.25em] text-gold/80 block uppercase">
                بوابة الموظفين
              </span>
              <h1 className="font-display italic text-title-lg text-ivory tracking-wide leading-tight">
                Staff Booking Dashboard
              </h1>
            </div>
          </div>

          {/* Time Clock, Reset Button and Exit Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Live Clock display */}
            <div className="px-4 py-2 border border-gold/15 bg-[#1A0A00]/50 rounded-[2px] flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span className="text-label-sm tracking-widest font-mono text-gold-light/90">
                {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
              </span>
            </div>

            {/* Simulated trigger for testing */}
            <button 
              onClick={handleSimulateClientBooking}
              className="px-4 py-2 bg-[#C9952A]/10 border border-[#C9952A]/40 text-[#C9952A] hover:bg-[#C9952A] hover:text-[#1A0A00] text-label-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(201,149,42,0.25)]"
              title="Simulate a new booking submission on the client website"
            >
              <Play className="w-3 h-3 fill-current" />
              Simulate Booking
            </button>

            {/* DB reset utility */}
            <button
              onClick={handleResetData}
              className="p-2 border border-gold/10 hover:border-gold/30 bg-[#1A0A00]/40 text-cream/60 hover:text-gold rounded-[2px] transition-colors cursor-pointer"
              title="Reset dashboard database to mock defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Exit Dashboard */}
            <a 
              href="#" 
              className="px-4 py-2 border border-accent-red/40 hover:bg-accent-red hover:text-ivory text-accent-red text-label-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Portal
            </a>
          </div>
        </header>

        {/* Dynamic Statistics counters row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 select-none">
          {/* Card 1: Today's Reservation */}
          <div className="border border-gold/20 bg-[#1F1108]/60 backdrop-blur-sm p-4 md:p-5 relative overflow-hidden rounded-[2px] shadow-md hover:border-gold/45 transition-colors group">
            <div className="absolute top-0 right-0 p-3 text-gold/10 group-hover:text-gold/20 transition-colors pointer-events-none">
              <Calendar className="w-14 h-14" />
            </div>
            <span className="text-label-xs uppercase tracking-widest text-cream/50 font-body block">Today's Bookings</span>
            <span className="font-display italic text-title-lg text-gold block mt-2 font-bold">{stats.totalToday}</span>
            <span className="text-label-xs text-cream/40 mt-1 block">Scheduled for today</span>
          </div>

          {/* Card 2: Expected guests today */}
          <div className="border border-gold/20 bg-[#1F1108]/60 backdrop-blur-sm p-4 md:p-5 relative overflow-hidden rounded-[2px] shadow-md hover:border-gold/45 transition-colors group">
            <div className="absolute top-0 right-0 p-3 text-gold/10 group-hover:text-gold/20 transition-colors pointer-events-none">
              <Users className="w-14 h-14" />
            </div>
            <span className="text-label-xs uppercase tracking-widest text-cream/50 font-body block">Expected Guests</span>
            <span className="font-display italic text-title-lg text-gold-light block mt-2 font-bold">{stats.guestsToday}</span>
            <span className="text-label-xs text-cream/40 mt-1 block">Total seats covers reserved</span>
          </div>

          {/* Card 3: Pending Confirms */}
          <div className="border border-gold/20 bg-[#1F1108]/60 backdrop-blur-sm p-4 md:p-5 relative overflow-hidden rounded-[2px] shadow-md hover:border-gold/45 transition-colors group">
            <div className="absolute top-0 right-0 p-3 text-gold/10 group-hover:text-gold/20 transition-colors pointer-events-none">
              <Clock className="w-14 h-14 animate-pulse" />
            </div>
            <span className="text-label-xs uppercase tracking-widest text-cream/50 font-body block">Pending Actions</span>
            <span className="font-display italic text-title-lg text-amber-400 block mt-2 font-bold">{stats.pendingActions}</span>
            <span className="text-label-xs text-cream/40 mt-1 block">Need staff confirmation</span>
          </div>

          {/* Card 4: Tables Occupied */}
          <div className="border border-gold/20 bg-[#1F1108]/60 backdrop-blur-sm p-4 md:p-5 relative overflow-hidden rounded-[2px] shadow-md hover:border-gold/45 transition-colors group">
            <div className="absolute top-0 right-0 p-3 text-gold/10 group-hover:text-gold/20 transition-colors pointer-events-none">
              <Flame className="w-14 h-14" />
            </div>
            <span className="text-label-xs uppercase tracking-widest text-cream/50 font-body block">Active Seated Tables</span>
            <span className="font-display italic text-title-lg text-cyan-400 block mt-2 font-bold">{stats.activeSeated}</span>
            <span className="text-label-xs text-cream/40 mt-1 block">Seated guests currently in hall</span>
          </div>
        </section>

        {/* Table Filters Control Bar */}
        <section className="border border-gold/15 bg-[#1F1108]/50 p-5 mb-6 rounded-[2px] flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between shadow-sm">
          
          {/* Filters Form controls */}
          <div className="flex flex-wrap items-center gap-3.5 flex-1">
            
            {/* Search Input */}
            <div className="relative min-w-[240px] flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, table or request..."
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-10 pr-4 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold transition-colors font-body focus:ring-1 focus:ring-gold/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-gold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-label-xs uppercase tracking-widest text-cream/40">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-2 text-ivory focus:outline-none focus:border-gold font-body"
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="seated">🍽️ Seated</option>
                <option value="completed">🏆 Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* Date Filter Selection */}
            <div className="flex items-center gap-2">
              <span className="text-label-xs uppercase tracking-widest text-cream/40">Date:</span>
              <select 
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  if (e.target.value !== 'custom') setCustomDate('');
                }}
                className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-2 text-ivory focus:outline-none focus:border-gold font-body"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            {/* Custom Date Input (conditional) */}
            {dateFilter === 'custom' && (
              <input 
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-2 text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]"
              />
            )}
          </div>

          {/* Actions group: Add Walkin */}
          <div>
            <button
              onClick={() => openModal(null)}
              className="w-full lg:w-auto px-5 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-sm font-bold uppercase tracking-[0.15em] rounded-full transition-colors cursor-pointer select-none flex items-center justify-center gap-2 shadow-sm font-body"
            >
              <Plus className="w-4 h-4 text-[#1A0A00]" />
              Create Walk-In
            </button>
          </div>
        </section>

        {/* Master Reservations Table / Grid container */}
        <section className="border border-gold/25 bg-[#1F1108]/75 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden rounded-[2px] relative">
          <div className="absolute inset-2 pointer-events-none border border-gold/5" />
          
          <div className="overflow-x-auto w-full relative z-10">
            {filteredReservations.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-10 h-10 text-gold/45" />
                <h3 className="font-display italic text-title-md text-cream/70">No Reservations Found</h3>
                <p className="text-body-sm text-cream/40 max-w-sm">No reservations match your search query or active filter settings. Try adjusting the filters or simulate a booking.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                    <th className="py-4 px-5">Guest details</th>
                    <th className="py-4 px-4">Schedule</th>
                    <th className="py-4 px-4 text-center">Seats</th>
                    <th className="py-4 px-4">Assigned Table</th>
                    <th className="py-4 px-5 max-w-xs">Requests / Notes</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10 font-body">
                  {filteredReservations.map((res) => {
                    // Status Badge Styling
                    let statusBadgeClass = '';
                    let statusDotClass = '';
                    if (res.status === 'pending') {
                      statusBadgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/25';
                      statusDotClass = 'bg-amber-400 animate-pulse';
                    } else if (res.status === 'confirmed') {
                      statusBadgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25';
                      statusDotClass = 'bg-emerald-400';
                    } else if (res.status === 'seated') {
                      statusBadgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25';
                      statusDotClass = 'bg-cyan-400 animate-pulse';
                    } else if (res.status === 'completed') {
                      statusBadgeClass = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';
                      statusDotClass = 'bg-zinc-400';
                    } else if (res.status === 'cancelled') {
                      statusBadgeClass = 'bg-rose-950/40 text-rose-400 border-rose-500/20';
                      statusDotClass = 'bg-rose-500';
                    }

                    // Dynamic row opacity for Completed/Cancelled
                    const isMutedRow = res.status === 'completed' || res.status === 'cancelled';

                    return (
                      <tr 
                        key={res.id} 
                        className={`hover:bg-gold/[0.02] transition-colors ${isMutedRow ? 'opacity-60 hover:opacity-100' : ''}`}
                      >
                        {/* Guest details column */}
                        <td className="py-4 px-5 font-semibold">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-ivory text-body-md font-display italic tracking-wide">{res.name}</span>
                            <span className="text-label-sm text-cream/50 font-mono flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-gold/60" /> {res.phone}
                            </span>
                          </div>
                        </td>

                        {/* Date/Time column */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-cream/90 font-semibold">{res.date === todayStr ? 'Today' : res.date === tomorrowStr ? 'Tomorrow' : res.date}</span>
                            <span className="text-label-sm text-gold-light/80 font-semibold flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-gold/60" /> {res.time}
                            </span>
                          </div>
                        </td>

                        {/* Seats column */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A0A00]/40 rounded-[2px] border border-gold/10">
                            <Users className="w-3 h-3 text-gold/60" />
                            <span className="font-mono text-ivory font-bold">{res.guests}</span>
                          </div>
                        </td>

                        {/* Table Assignment column */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="text" 
                              value={res.table || ''} 
                              onChange={(e) => handleTableChange(res.id, e.target.value)}
                              placeholder="e.g. Table 14"
                              className="w-24 bg-[#1A0A00]/40 border border-gold/15 rounded-[2px] px-2 py-1 text-label-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors"
                            />
                          </div>
                        </td>

                        {/* Requests column */}
                        <td className="py-4 px-5 max-w-xs">
                          {res.requests ? (
                            <div className="flex gap-1.5 items-start text-cream/70 italic text-label-sm leading-relaxed">
                              <MessageSquare className="w-3 h-3 text-gold/50 shrink-0 mt-0.5" />
                              <span>"{res.requests}"</span>
                            </div>
                          ) : (
                            <span className="text-cream/30 italic text-label-xs">No special requests</span>
                          )}
                        </td>

                        {/* Status badge column */}
                        <td className="py-4 px-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-widest font-semibold ${statusBadgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
                            {res.status}
                          </div>
                        </td>

                        {/* Quick action buttons column */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Pending State Options */}
                            {res.status === 'pending' && (
                              <button 
                                onClick={() => handleStatusChange(res.id, 'confirmed')}
                                className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-ivory rounded-[2px] text-label-sm uppercase font-bold tracking-wider transition-colors cursor-pointer"
                                title="Confirm Booking"
                              >
                                Confirm
                              </button>
                            )}

                            {/* Confirmed State Options */}
                            {res.status === 'confirmed' && (
                              <button 
                                onClick={() => handleStatusChange(res.id, 'seated')}
                                className="px-2.5 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-ivory rounded-[2px] text-label-sm uppercase font-bold tracking-wider transition-colors cursor-pointer"
                                title="Mark Guest as Seated"
                              >
                                Seat
                              </button>
                            )}

                            {/* Seated State Options */}
                            {res.status === 'seated' && (
                              <button 
                                onClick={() => handleStatusChange(res.id, 'completed')}
                                className="px-2.5 py-1 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-sm uppercase font-bold tracking-wider transition-colors cursor-pointer"
                                title="Mark Booking as Completed"
                              >
                                Complete
                              </button>
                            )}

                            {/* Cancel Options */}
                            {res.status !== 'completed' && res.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleStatusChange(res.id, 'cancelled')}
                                className="px-2.5 py-1 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-[2px] text-label-sm uppercase font-bold tracking-wider transition-colors cursor-pointer"
                                title="Cancel Booking"
                              >
                                Cancel
                              </button>
                            )}

                            <span className="w-[1px] h-4 bg-gold/15 mx-1" />

                            {/* Standard edit button */}
                            <button
                              onClick={() => openModal(res)}
                              className="p-1 border border-gold/10 hover:border-gold/30 bg-[#1A0A00]/40 text-cream/60 hover:text-gold rounded-[2px] transition-colors cursor-pointer"
                              title="Edit Reservation Details"
                            >
                              <Edit className="w-3 h-3" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(res.id, res.name)}
                              className="p-1 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] transition-colors cursor-pointer"
                              title="Delete / Remove Booking"
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

      {/* Manual / Edit Booking Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[995] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-[#0F0500]/85 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-[#1F1108] border-2 border-gold/30 p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-[2px] overflow-hidden animate-scale-up z-10">
            <div className="absolute inset-2 border border-gold/10 pointer-events-none" />
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-cream/40 hover:text-gold transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <header className="mb-6 text-center">
              <span className="font-arabic text-label-xs tracking-[0.25em] text-gold block">
                {selectedRes ? 'تعديل الحجز' : 'حجز يدوي جديد'}
              </span>
              <h3 className="font-display italic text-title-md text-gold-light mt-1">
                {selectedRes ? 'Edit Reservation' : 'Create Walk-In / Manual Booking'}
              </h3>
              <MuqarnasArch color="#C9952A" size={30} className="mt-2 mx-auto" />
            </header>

            <form onSubmit={handleModalSave} className="space-y-4">
              
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <User className="w-2.5 h-2.5 text-gold" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={modalData.name}
                    onChange={handleModalInputChange}
                    placeholder="e.g. Asim Raza"
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
                  />
                  {modalErrors.name && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.name}</span>}
                </div>

                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5 text-gold" /> Phone (Pakistan)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={modalData.phone}
                    onChange={handleModalInputChange}
                    placeholder="e.g. 03001234567"
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
                  />
                  {modalErrors.phone && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.phone}</span>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5 text-gold" /> Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={modalData.date}
                    onChange={handleModalInputChange}
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]"
                  />
                  {modalErrors.date && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.date}</span>}
                </div>

                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-gold" /> Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={modalData.time}
                    onChange={handleModalInputChange}
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]"
                  />
                  {modalErrors.time && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.time}</span>}
                </div>
              </div>

              {/* Guests & Table Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 text-gold" /> Guests count
                  </label>
                  <select
                    name="guests"
                    value={modalData.guests}
                    onChange={handleModalInputChange}
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-2.5 py-2.5 text-body-sm text-ivory focus:outline-none focus:border-gold font-body"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} className="bg-charcoal text-ivory">{num} Guests</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-start gap-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                    <Check className="w-2.5 h-2.5 text-gold" /> Table Assignment
                  </label>
                  <input
                    type="text"
                    name="table"
                    value={modalData.table}
                    onChange={handleModalInputChange}
                    placeholder="e.g. Table 4 / Majlis A"
                    className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="flex flex-col items-start gap-1">
                <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5 text-gold" /> Special Requests
                </label>
                <textarea
                  name="requests"
                  value={modalData.requests}
                  onChange={handleModalInputChange}
                  rows="2"
                  placeholder="Anniversary candles, quiet zone, floor seating preference..."
                  className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gold/30 text-gold hover:bg-gold/5 font-body text-label-sm font-bold uppercase tracking-[0.15em] rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.15em] rounded-full transition-colors cursor-pointer"
                >
                  {selectedRes ? 'Save Changes' : 'Confirm Walk-In'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
