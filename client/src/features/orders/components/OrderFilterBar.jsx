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
    <section className="border border-gold/15 bg-gradient-to-br from-[#1F1108]/70 to-[#120500]/80 backdrop-blur-md p-5 rounded-lg flex flex-col lg:flex-row gap-5 items-center justify-between">
      <div className="flex flex-wrap items-center gap-4 flex-1 w-full">
        <div className="relative min-w-[260px] flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input 
            type="text" 
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            placeholder="Search customer, phone, items or table/address..."
            className="w-full bg-[#1A0A00]/70 border border-gold/15 rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 transition-all duration-300 font-body text-ivory placeholder:text-cream/30"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-bold">Status:</span>
          <select 
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3.5 py-2.5 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 transition-all duration-300 font-body text-ivory cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="preparing">🔥 Preparing</option>
            <option value="served">📦 Dispatched / Served</option>
            <option value="completed">🏆 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-label-xs uppercase tracking-widest text-cream/40 font-bold">Type:</span>
          <select 
            value={orderTypeFilter}
            onChange={(e) => setOrderTypeFilter(e.target.value)}
            className="bg-[#1A0A00]/70 border border-gold/15 rounded-lg text-body-sm px-3.5 py-2.5 focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold/25 transition-all duration-300 font-body text-ivory cursor-pointer"
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
