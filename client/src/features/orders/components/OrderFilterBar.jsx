import React from 'react';
import { Search } from 'lucide-react';

export default function OrderFilterBar({
  orderSearchQuery,
  setOrderSearchQuery,
  orderStatusFilter,
  setOrderStatusFilter,
  orderTypeFilter,
  setOrderTypeFilter
}) {
  return (
    <section className="border border-gold/15 bg-[#1F1108]/50 p-4 rounded-[2px] flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
      <div className="flex flex-wrap items-center gap-3.5 flex-1 w-full">
        <div className="relative min-w-[240px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input 
            type="text" 
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            placeholder="Search customer, phone, items or table/address..."
            className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] pl-9 pr-4 py-2 text-body-sm focus:outline-none focus:border-gold font-body text-ivory"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Status:</span>
          <select 
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body text-ivory"
          >
            <option value="all">All</option>
            <option value="pending">⏳ Pending</option>
            <option value="preparing">🔥 Preparing</option>
            <option value="served">📦 Dispatched / Served</option>
            <option value="completed">🏆 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-semibold">Type:</span>
          <select 
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
            className="bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] text-body-sm px-2.5 py-1.5 focus:outline-none focus:border-gold font-body text-ivory"
          >
            <option value="all">All Modes</option>
            <option value="delivery">🚚 Delivery</option>
            <option value="takeaway">🛍️ Takeaway</option>
            <option value="dine-in">🍽️ Dine-In</option>
          </select>
        </div>
      </div>
    </section>
  );
}
