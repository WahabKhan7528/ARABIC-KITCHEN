import React from 'react';
import { Truck, Store, Coffee, Trash2 } from 'lucide-react';

export default function OrdersTable({ filteredOrders, todayStr, onStatusChange, onDelete }) {
  return (
    <section className="border border-gold/15 bg-gradient-to-b from-[#1F1108]/85 to-[#0F0500]/95 backdrop-blur-md overflow-hidden rounded-xl relative">
      <div className="overflow-x-auto w-full relative z-10">
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-cream/40 text-body-sm font-body">No orders found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-body-md">
            <thead>
              <tr className="border-b border-gold/15 text-gold uppercase tracking-[0.15em] text-label-sm bg-[#120500]/80 font-body">
                <th className="py-4 px-6">Order ID & Time</th>
                <th className="py-4 px-6">Customer Details</th>
                <th className="py-4 px-4">Items Ordered</th>
                <th className="py-4 px-4">Dest. / Table</th>
                <th className="py-4 px-4">Total Bill</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredOrders.map((ord) => {
                let statusBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (ord.status === 'preparing') statusBadgeClass = 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse';
                else if (ord.status === 'served') statusBadgeClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                else if (ord.status === 'completed') statusBadgeClass = 'bg-zinc-500/10 text-zinc-400 border-zinc-700/20';
                else if (ord.status === 'cancelled') statusBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                const timeStr = new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = ord.createdAt.split('T')[0] === todayStr ? 'Today' : ord.createdAt.split('T')[0];

                return (
                  <tr key={ord._id} className={`hover:bg-gold/[0.03] transition-colors duration-300 ${ord.status === 'completed' || ord.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <td className="py-4 px-6 font-mono text-label-sm text-gold-light text-left">
                      <div className="flex flex-col">
                        <span className="font-bold tracking-wider">{ord._id.substring(18, 24).toUpperCase()}</span>
                        <span className="text-label-xs text-cream/40 mt-0.5 font-bold">{dateStr} {timeStr}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="font-display text-body-md text-ivory font-bold tracking-wide">{ord.name}</span>
                        <span className="text-label-sm text-cream/50 font-mono mt-0.5">{ord.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body leading-relaxed max-w-[220px] text-left">
                      <div className="flex flex-col gap-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="bg-gold/[0.04] border border-gold/10 px-2.5 py-0.5 rounded text-label-xs font-body flex justify-between items-center gap-2">
                            <span className="text-cream/90 truncate font-semibold">{item.name}</span>
                            <span className="text-gold font-bold shrink-0">&times;{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs text-left">
                      <div className="flex items-center gap-1.5">
                        {ord.type === 'delivery' ? (
                          <div className="flex items-start gap-1.5 text-label-sm text-cream/75 leading-tight">
                            <Truck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={ord.address}>{ord.address}</span>
                          </div>
                        ) : ord.type === 'takeaway' ? (
                          <div className="flex items-center gap-1.5 text-label-sm text-cream/65">
                            <Store className="w-3.5 h-3.5 text-gold" /> Takeaway Pickup
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-label-sm text-cream/80 font-bold">
                            <Coffee className="w-3.5 h-3.5 text-gold" /> {ord.table || 'Table TBD'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-ivory text-left">
                      <div className="flex flex-col">
                        <span className="text-cream/95">PKR {ord.total.toLocaleString()}</span>
                        <span className={`text-label-xs uppercase font-bold font-body mt-0.5 ${(ord.paymentStatus || '').toLowerCase() === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full border text-label-xs uppercase tracking-wider font-bold ${statusBadgeClass}`}>
                        {ord.status === 'served' 
                          ? (ord.type === 'delivery' ? 'Dispatched' : ord.type === 'takeaway' ? 'Ready' : 'Served')
                          : ord.status
                        }
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 font-body">
                        {ord.status === 'pending' && (
                          <button onClick={() => onStatusChange(ord._id, 'preparing')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-ivory rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Prepare</button>
                        )}
                        {ord.status === 'preparing' && (
                          <button onClick={() => onStatusChange(ord._id, 'served')} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-ivory rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">
                            {ord.type === 'delivery' ? 'Dispatch' : ord.type === 'takeaway' ? 'Ready' : 'Serve'}
                          </button>
                        )}
                        {ord.status === 'served' && (
                          <button onClick={() => onStatusChange(ord._id, 'completed')} className="px-3 py-1.5 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Complete</button>
                        )}
                        {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                          <button onClick={() => onStatusChange(ord._id, 'cancelled')} className="px-3 py-1.5 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Cancel</button>
                        )}
                        <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                        <button onClick={() => onDelete(ord._id)} className="p-1.5 border border-accent-red/25 hover:border-accent-red/60 bg-[#1A0A00]/50 text-accent-red/60 hover:text-ivory rounded-full transition-colors duration-200 cursor-pointer" title="Delete Order">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
