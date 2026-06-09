import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import api from '../../../utils/api';
import StatsCard from './StatsCard';

export default function AnalyticsTab() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeReservations: 0,
    topItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ordersRes, resRes] = await Promise.all([
          api.get('/orders'),
          api.get('/reservations')
        ]);
        
        const orders = ordersRes.data.orders || ordersRes.data;
        const reservations = resRes.data.reservations || resRes.data;

        // Calculate Revenue
        const completedOrders = orders.filter(o => o.status === 'completed' || o.paymentStatus === 'Paid');
        const revenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        // Top Items
        const itemCounts = {};
        orders.forEach(o => {
          (o.items || []).forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
          });
        });
        const topItems = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Active Reservations
        const activeRes = reservations.filter(r => r.status === 'pending' || r.status === 'confirmed').length;

        setStats({
          totalRevenue: revenue,
          totalOrders: orders.length,
          activeReservations: activeRes,
          topItems
        });
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="py-20 text-center text-cream/40">Loading analytics...</div>;

  return (
    <div className="animate-fade-in space-y-6 text-left">
      <div className="border-b border-gold/10 pb-5 text-left">
        <h2 className="text-title-md md:text-title-lg font-display bg-gradient-to-r from-gold-light via-gold to-cream bg-clip-text text-transparent font-bold drop-shadow-md tracking-wider uppercase">Business Analytics</h2>
        <p className="text-body-sm text-cream/60 mt-1.5">
          Overview of revenue, order volumes, and top-selling dishes.
        </p>
        <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Total Revenue (Paid)" value={`PKR ${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} valueColorClass="text-emerald-400" />
        <StatsCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
        <StatsCard label="Active Reservations" value={stats.activeReservations} icon={Users} />
      </div>

      <div className="border border-gold/20 bg-[#1F1108]/90 rounded-[2px] p-6 shadow-md mt-8">
        <h3 className="text-label-sm uppercase tracking-widest text-gold mb-6 border-b border-gold/10 pb-3 font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Top Selling Items
        </h3>
        {stats.topItems.length > 0 ? (
          <ul className="space-y-3">
            {stats.topItems.map((item, idx) => (
              <li key={idx} className="flex justify-between text-body-sm text-cream/80 border-b border-gold/5 pb-2 last:border-0">
                <span>{item.name}</span>
                <span className="font-bold text-ivory font-mono">{item.count} orders</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-cream/40">No order data available yet.</p>
        )}
      </div>
    </div>
  );
}
