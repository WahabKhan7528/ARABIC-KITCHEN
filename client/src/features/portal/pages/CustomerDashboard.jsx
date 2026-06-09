import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Package, CalendarClock } from 'lucide-react';
import { logoutUser } from '../../../store/slices/authSlice';
import api from '../../../utils/api';
import Navbar from '../../../shared/layout/Navbar';
import Footer from '../../../shared/layout/Footer';

export default function CustomerDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, resRes] = await Promise.all([
          api.get('/orders/my-orders'),
          api.get('/reservations/my-reservations')
        ]);
        setOrders(ordersRes.data);
        setReservations(resRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const handleCancelReservation = async (resId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.patch(`/reservations/${resId}/cancel`);
      setReservations(reservations.map(r => r._id === resId ? { ...r, status: 'cancelled' } : r));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation.');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    window.location.hash = '#home';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-gold';
      case 'preparing': return 'text-blue-400';
      case 'served': return 'text-green-400';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-accent-red';
      case 'confirmed': return 'text-green-400';
      case 'seated': return 'text-blue-400';
      case 'no-show': return 'text-accent-red';
      default: return 'text-cream';
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0A00] flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 border-b border-gold/20 pb-6">
          <div>
            <h1 className="font-display italic text-title-lg text-ivory mb-2">
              My Profile
            </h1>
            <p className="text-body-md text-cream/70 font-body">
              Welcome back, {user?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-6 py-2 border border-accent-red/50 text-accent-red hover:bg-accent-red/10 rounded-full text-label-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="flex gap-6 mb-8 border-b border-gold/10">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 text-label-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-gold border-b-2 border-gold' : 'text-cream/50 hover:text-gold'
            }`}
          >
            <Package className="w-4 h-4" /> My Orders
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-4 text-label-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
              activeTab === 'reservations' ? 'text-gold border-b-2 border-gold' : 'text-cream/50 hover:text-gold'
            }`}
          >
            <CalendarClock className="w-4 h-4" /> My Reservations
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-cream/50">No orders found.</div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="bg-[#2A1205]/40 border border-gold/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="text-label-sm uppercase tracking-widest text-gold mb-1">
                          Order #{order._id.slice(-6)}
                        </div>
                        <div className="text-ivory font-body">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="text-cream/70 text-sm mt-2 font-body">
                          {order.items.length} items • {order.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`font-bold uppercase tracking-widest text-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                          <div className="text-gold mt-1 font-body font-bold">
                            Rs. {order.total.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => window.location.hash = `#confirmation?id=${order._id}`}
                            className="px-4 py-1.5 bg-gold/10 text-gold hover:bg-gold/20 rounded-full text-xs uppercase tracking-widest font-bold transition-colors border border-gold/30"
                          >
                            Tracker
                          </button>
                          <button 
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="px-4 py-1.5 bg-transparent text-cream/70 hover:text-gold rounded-full text-xs uppercase tracking-widest transition-colors border border-gold/10"
                          >
                            {expandedOrder === order._id ? 'Hide Items' : 'View Items'}
                          </button>
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-4 py-1.5 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 rounded-full text-xs uppercase tracking-widest font-bold transition-colors border border-accent-red/30"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {expandedOrder === order._id && (
                        <div className="w-full mt-4 pt-4 border-t border-gold/10 font-body text-sm text-cream/80">
                          <ul className="space-y-2">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="text-center py-12 text-cream/50">No reservations found.</div>
                ) : (
                  reservations.map(res => (
                    <div key={res._id} className="bg-[#2A1205]/40 border border-gold/10 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="text-label-sm uppercase tracking-widest text-gold mb-1">
                          Reservation #{res._id.slice(-6)}
                        </div>
                        <div className="text-ivory font-body font-bold text-lg mb-1">
                          {new Date(res.reservationDate).toLocaleDateString()} at {res.reservationTime}
                        </div>
                        <div className="text-cream/70 text-sm font-body">
                          Party of {res.partySize} • {res.occasion !== 'none' ? res.occasion : 'Standard Dining'}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className={`font-bold uppercase tracking-widest text-sm ${getStatusColor(res.status)}`}>
                            {res.status}
                          </div>
                          {res.tableNumber && (
                            <div className="text-gold/80 mt-1 font-body text-sm">
                              Table {res.tableNumber}
                            </div>
                          )}
                        </div>
                        {(res.status === 'pending' || res.status === 'confirmed') && (
                          <button 
                            onClick={() => handleCancelReservation(res._id)}
                            className="px-4 py-2 bg-accent-red/10 text-accent-red hover:bg-accent-red/20 rounded-full text-xs uppercase tracking-widest font-bold transition-colors border border-accent-red/30"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
