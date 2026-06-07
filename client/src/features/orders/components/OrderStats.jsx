import React from 'react';
import StatsCard from '../../dashboard/components/StatsCard';

export default function OrderStats({ stats }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
      <StatsCard label="Today's Orders" value={stats.totalOrdersToday} valueColorClass="text-gold" />
      <StatsCard label="Active Cooking" value={stats.activeCooking} valueColorClass="text-orange-400" />
      <StatsCard label="Today's Order Revenue" value={`PKR ${stats.totalRevenueToday.toLocaleString()}`} valueColorClass="text-emerald-400" />
      <StatsCard label="Pending Order Alerts" value={stats.pendingOrders} valueColorClass="text-amber-400" />
    </section>
  );
}
