import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function ReservationFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  customDate,
  setCustomDate,
  onOpenModal
}) {
  return (
    <section className="border border-gold/15 bg-[#1F1108]/50 p-4 rounded-[2px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
      <div className="flex flex-wrap items-center gap-3.5 flex-1 w-full">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, table or request..."
            className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-gold font-body text-ivory"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body text-ivory"
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
            className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body text-ivory"
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
            className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2 py-1 focus:outline-none focus:border-gold [color-scheme:dark] text-ivory"
          />
        )}
      </div>

      <div>
        <button
          onClick={onOpenModal}
          className="w-full lg:w-auto px-5 py-2.5 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 font-body cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Walk-In
        </button>
      </div>
    </section>
  );
}
