import React from 'react';
import { Calendar, Users, AlertCircle, Utensils } from 'lucide-react';
import StatsCard from '../../dashboard/components/StatsCard';

export default function ReservationStats({ stats }) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left animate-fade-in">
      <StatsCard label="Today's Bookings" value={stats.totalToday} icon={Calendar} valueColorClass="text-gold" />
      <StatsCard label="Expected Guests" value={stats.guestsToday} icon={Users} valueColorClass="text-gold-light" />
      <StatsCard label="Pending Approvals" value={stats.pendingActions} icon={AlertCircle} valueColorClass="text-amber-400" />
      <StatsCard label="Active Seated Tables" value={stats.activeSeated} icon={Utensils} valueColorClass="text-cyan-400" />
    </section>
  );
}
