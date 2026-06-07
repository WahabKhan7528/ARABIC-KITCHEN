import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Layout & Shared UI
import DashboardLayout from '../components/DashboardLayout';
import ToastNotification from '../../../shared/ui/ToastNotification';
import ConfirmModal from '../../../shared/ui/ConfirmModal';

// Reservations Feature
import { fetchReservations, createReservation, updateReservationStatus } from '../../../store/slices/reservationSlice';
import useReservationFilters from '../../reservations/hooks/useReservationFilters';
import ReservationStats from '../../reservations/components/ReservationStats';
import ReservationFilterBar from '../../reservations/components/ReservationFilterBar';
import ReservationsTable from '../../reservations/components/ReservationsTable';
import ReservationModal from '../../reservations/components/ReservationModal';

// Orders Feature
import useOrderFilters from '../../orders/hooks/useOrderFilters';
import OrderStats from '../../orders/components/OrderStats';
import OrderFilterBar from '../../orders/components/OrderFilterBar';
import OrdersTable from '../../orders/components/OrdersTable';

// Other Modules
import MenuItemsModule from '../../menu/pages/MenuItemsModule';
import StaffModule from '../../staff/pages/StaffModule';

// Utilities
import api from '../../../utils/api';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('reservations');
  const dispatch = useDispatch();
  
  // App state
  const { user } = useSelector((state) => state.auth);
  const { reservations } = useSelector((state) => state.reservations);
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Pure dynamic date states
  const [todayStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [tomorrowStr] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Modal states for Reservations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState(null);
  const [modalData, setModalData] = useState({
    name: '', phone: '', date: '', time: '19:00', guests: '2', table: '', requests: ''
  });
  const [modalErrors, setModalErrors] = useState({});

  // Toast and Confirm state
  const [alertToast, setAlertToast] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, message: '', onConfirm: () => {} });

  const requestConfirm = (message, onConfirm) => {
    setConfirmState({ isOpen: true, message, onConfirm });
  };

  // Custom Hooks for filtering and stats
  const resFilters = useReservationFilters(reservations, todayStr, tomorrowStr);
  const orderFilters = useOrderFilters(orders, todayStr);

  // Initial load
  useEffect(() => {
    dispatch(fetchReservations());
    fetchOrders();
  }, [dispatch]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders || response.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, title = 'System Update') => {
    setAlertToast({ title, message });
    setTimeout(() => setAlertToast(null), 4000);
  };

  // ----------------------------------------------------
  // RESERVATION ACTIONS
  // ----------------------------------------------------
  const handleResStatusChange = (id, newStatus) => {
    dispatch(updateReservationStatus({ id, status: newStatus }));
    
    // Auto-assign table logic if confirmed
    const foundRes = reservations.find(r => r._id === id);
    if (newStatus === 'confirmed' && foundRes && !foundRes.tableNumber) {
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
        api.put(`/reservations/${id}`, { tableNumber: assignedTable }).then(() => dispatch(fetchReservations()));
      }
    }
    showToast(`Reservation status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleTableChange = (id, newTable) => {
    api.put(`/reservations/${id}`, { tableNumber: newTable }).then(() => dispatch(fetchReservations()));
  };

  const handleResDelete = (id, name) => {
    requestConfirm(`Are you sure you want to cancel and delete the reservation for ${name}?`, () => {
      api.delete(`/reservations/${id}`).then(() => dispatch(fetchReservations()));
      showToast(`Reservation for ${name} has been removed.`);
    });
  };

  // ----------------------------------------------------
  // RESERVATION MODAL ACTIONS
  // ----------------------------------------------------
  const openResModal = (res = null) => {
    if (res) {
      setSelectedRes(res);
      setModalData({
        name: res.name || res.guestName,
        phone: res.phone,
        date: res.date || res.reservationDate,
        time: res.time || res.reservationTime,
        guests: res.guests || res.partySize,
        table: res.table || res.tableNumber || '',
        requests: res.requests || res.specialRequests || ''
      });
    } else {
      setSelectedRes(null);
      setModalData({ name: '', phone: '', date: todayStr, time: '19:00', guests: '2', table: '', requests: '' });
    }
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    const tempErrors = {};
    if (!modalData.name.trim()) tempErrors.name = 'Full name is required';
    const phoneRegex = /^((\+92)?(92)?(0)?3[0-9]{9})$/;
    if (!modalData.phone.trim()) tempErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(modalData.phone.replace(/[\s-]/g, ''))) tempErrors.phone = 'Invalid Pakistan phone number';
    if (!modalData.date) tempErrors.date = 'Date is required';
    if (!modalData.time) tempErrors.time = 'Time is required';

    if (Object.keys(tempErrors).length > 0) {
      setModalErrors(tempErrors);
      return;
    }

    if (selectedRes) {
      api.put(`/reservations/${selectedRes._id}`, {
        guestName: modalData.name,
        phone: modalData.phone,
        reservationDate: modalData.date,
        reservationTime: modalData.time,
        partySize: modalData.guests,
        tableNumber: modalData.table,
        specialRequests: modalData.requests
      }).then(() => {
        dispatch(fetchReservations());
        showToast(`Updated reservation for ${modalData.name}`);
      });
    } else {
      dispatch(createReservation({
        guestName: modalData.name,
        phone: modalData.phone,
        reservationDate: modalData.date,
        reservationTime: modalData.time,
        partySize: modalData.guests,
        specialRequests: modalData.requests
      })).then(() => {
        dispatch(fetchReservations());
        showToast(`Manual reservation created for ${modalData.name}`, 'Walk-In Added');
      });
    }
    setIsModalOpen(false);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({ ...prev, [name]: value }));
    if (modalErrors[name]) setModalErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ----------------------------------------------------
  // ORDER ACTIONS
  // ----------------------------------------------------
  const handleOrderStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
      showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status');
    }
  };

  const handleOrderDeleteAction = async (id) => {
    requestConfirm('Are you sure you want to delete this order record?', async () => {
      try {
        await api.delete(`/orders/${id}`);
        fetchOrders();
        showToast('Order record removed from database.');
      } catch (err) {
        console.error(err);
        showToast('Failed to delete order');
      }
    });
  };

  return (
    <DashboardLayout activeModule={activeTab} setActiveModule={setActiveTab} currentTime={currentTime}>
      
      <ToastNotification toast={alertToast} onClose={() => setAlertToast(null)} />

      {/* ----------------------------------------------------
          TAB 1: RESERVATIONS SECTION
          ---------------------------------------------------- */}
      {activeTab === 'reservations' && (
        <div className="animate-fade-in space-y-6">
          <div className="border-b border-gold/10 pb-4 text-left">
            <h2 className="text-title-md md:text-title-lg font-display text-gold-light font-bold drop-shadow-md tracking-wide">Table Reservations</h2>
            <p className="text-body-sm text-cream/60 mt-1">
              Monitor and manage table reservations, seat active walk-in guests, update guest statuses, and assign tables in real-time.
            </p>
          </div>

          <ReservationStats stats={resFilters.stats} />
          
          <ReservationFilterBar 
            {...resFilters} 
            onOpenModal={() => openResModal(null)} 
          />

          <ReservationsTable 
            filteredReservations={resFilters.filteredReservations}
            todayStr={todayStr}
            tomorrowStr={tomorrowStr}
            onTableChange={handleTableChange}
            onStatusChange={handleResStatusChange}
            onEdit={openResModal}
            onDelete={handleResDelete}
          />
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: ORDERS SECTION
          ---------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="animate-fade-in space-y-6">
          <div className="border-b border-gold/10 pb-4 text-left">
            <h2 className="text-title-md md:text-title-lg font-display text-gold-light font-bold drop-shadow-md tracking-wide">Orders Management</h2>
            <p className="text-body-sm text-cream/60 mt-1">
              Track and process customer orders, update kitchen preparation stages, dispatch delivery or takeaway packages, and manage billing.
            </p>
          </div>

          <OrderStats stats={orderFilters.stats} />
          <OrderFilterBar {...orderFilters} />
          <OrdersTable 
            filteredOrders={orderFilters.filteredOrders}
            todayStr={todayStr}
            onStatusChange={handleOrderStatusUpdate}
            onDelete={handleOrderDeleteAction}
          />
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: MENU ITEMS SECTION
          ---------------------------------------------------- */}
      {activeTab === 'menu-items' && (
        <MenuItemsModule showToast={showToast} requestConfirm={requestConfirm} />
      )}

      {/* ----------------------------------------------------
          TAB 4: STAFF SECTION
          ---------------------------------------------------- */}
      {activeTab === 'staff' && user?.role === 'admin' && (
        <StaffModule showToast={showToast} requestConfirm={requestConfirm} />
      )}

      {/* Modal */}
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRes={selectedRes}
        modalData={modalData}
        modalErrors={modalErrors}
        handleModalInputChange={handleModalInputChange}
        handleModalSave={handleModalSave}
      />

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
    </DashboardLayout>
  );
}
