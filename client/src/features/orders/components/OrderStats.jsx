import React from 'react';
import { ShoppingBag, Flame, DollarSign, Bell } from 'lucide-react';
import StatsCard from '../../dashboard/components/StatsCard';

export default function OrderStats({ stats }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left animate-fade-in">
      <StatsCard label="Today's Orders" value={stats.totalOrdersToday} icon={ShoppingBag} valueColorClass="text-gold" />
      <StatsCard label="Active Cooking" value={stats.activeCooking} icon={Flame} valueColorClass="text-orange-400" />
      <StatsCard label="Today's Order Revenue" value={`PKR ${stats.totalRevenueToday.toLocaleString()}`} icon={DollarSign} valueColorClass="text-emerald-400" />
      <StatsCard label="Pending Order Alerts" value={stats.pendingOrders} icon={Bell} valueColorClass="text-amber-400" />
    </section>
  );
}
