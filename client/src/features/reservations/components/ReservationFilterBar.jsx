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
    <section className="border border-gold/15 bg-gradient-to-br from-[#1F1108]/70 to-[#120500]/80 backdrop-blur-md p-5 rounded-lg flex flex-col lg:flex-row gap-5 items-center justify-between">
      <div className="flex flex-wrap items-center gap-4 flex-1 w-full">
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, table or request..."
            className="w-full bg-[#1A0A00]/70 border border-gold/15 rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 font-body text-ivory placeholder:text-cream/30"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-bold">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3.5 py-2.5 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 font-body text-ivory cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="confirmed">✅ Confirmed</option>
            <option value="seated">🍽️ Seated</option>
            <option value="completed">🏆 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-bold">Date:</span>
          <select 
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              if (e.target.value !== 'custom') setCustomDate('');
            }}
            className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3.5 py-2.5 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 font-body text-ivory cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>

        {dateFilter === 'custom' && (
          <input 
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3 py-2 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 [color-scheme:dark] text-ivory cursor-pointer"
          />
        )}
      </div>

      <div className="w-full lg:w-auto">
        <button
          onClick={onOpenModal}
          className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#1A0A00] text-label-xs font-bold uppercase tracking-widest rounded-full flex items-center justify-center gap-2 font-body cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Walk-In
        </button>
      </div>
    </section>
  );
}
