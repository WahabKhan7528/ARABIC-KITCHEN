import React from 'react';
import { Truck, Store, Coffee, Trash2 } from 'lucide-react';

export default function OrdersTable({ filteredOrders, todayStr, onStatusChange, onDelete }) {
  return (
    <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
      <div className="overflow-x-auto w-full relative z-10">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-cream/40 text-body-sm font-body">No orders found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                <th className="py-4 px-5">Order ID & Time</th>
                <th className="py-4 px-5">Customer details</th>
                <th className="py-4 px-4">Items Ordered</th>
                <th className="py-4 px-4">Dest. / Table</th>
                <th className="py-4 px-4">Total bill</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredOrders.map((ord) => {
                let statusBadgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/25';
                if (ord.status === 'preparing') statusBadgeClass = 'bg-orange-950/40 text-orange-400 border-orange-500/25 animate-pulse';
                else if (ord.status === 'served') statusBadgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25';
                else if (ord.status === 'completed') statusBadgeClass = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';
                else if (ord.status === 'cancelled') statusBadgeClass = 'bg-rose-950/40 text-rose-400 border-rose-500/20';

                const timeStr = new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = ord.createdAt.split('T')[0] === todayStr ? 'Today' : ord.createdAt.split('T')[0];

                return (
                  <tr key={ord._id} className={`hover:bg-gold/[0.02] transition-colors ${ord.status === 'completed' || ord.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <td className="py-4 px-5 font-mono text-label-xs text-gold-light text-left">
                      <div className="flex flex-col">
                        <span className="font-bold">{ord._id.substring(18, 24).toUpperCase()}</span>
                        <span className="text-label-xs text-cream/40 mt-0.5">{dateStr} {timeStr}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="font-display text-body-sm text-ivory font-bold">{ord.name}</span>
                        <span className="text-label-xs text-cream/50 font-mono mt-0.5">{ord.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-body leading-relaxed max-w-[200px] text-left">
                      <div className="space-y-0.5">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="text-cream/80 flex justify-between gap-1 text-label-xs font-body">
                            <span className="truncate pr-1">&#8226; {item.name}</span>
                            <span className="font-bold text-gold shrink-0">&times;{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs text-left">
                      <div className="flex items-center gap-1.5">
                        {ord.type === 'delivery' ? (
                          <div className="flex items-start gap-1 text-label-xs text-cream/75 leading-tight">
                            <Truck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={ord.address}>{ord.address}</span>
                          </div>
                        ) : ord.type === 'takeaway' ? (
                          <div className="flex items-center gap-1 text-label-xs text-cream/60">
                            <Store className="w-3.5 h-3.5 text-gold" /> Takeaway Pickup
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-label-xs text-cream/80 font-bold">
                            <Coffee className="w-3.5 h-3.5 text-gold" /> {ord.table || 'Table TBD'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-ivory text-left">
                      <div className="flex flex-col">
                        <span>PKR {ord.total.toLocaleString()}</span>
                        <span className={`text-label-xs uppercase font-body mt-0.5 ${(ord.paymentStatus || '').toLowerCase() === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {ord.paymentMethod} ({ord.paymentStatus})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${statusBadgeClass}`}>
                        {ord.status === 'served' 
                          ? (ord.type === 'delivery' ? 'Dispatched' : ord.type === 'takeaway' ? 'Ready for Pickup' : 'Served')
                          : ord.status
                        }
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 font-body">
                        {ord.status === 'pending' && (
                          <button onClick={() => onStatusChange(ord._id, 'preparing')} className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Prepare</button>
                        )}
                        {ord.status === 'preparing' && (
                          <button onClick={() => onStatusChange(ord._id, 'served')} className="px-2.5 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">
                            {ord.type === 'delivery' ? 'Dispatch' : ord.type === 'takeaway' ? 'Ready' : 'Serve'}
                          </button>
                        )}
                        {ord.status === 'served' && (
                          <button onClick={() => onStatusChange(ord._id, 'completed')} className="px-2.5 py-1 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Complete</button>
                        )}
                        {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                          <button onClick={() => onStatusChange(ord._id, 'cancelled')} className="px-2.5 py-1 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Cancel</button>
                        )}
                        <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                        <button onClick={() => onDelete(ord._id)} className="p-1 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] cursor-pointer" title="Delete order">
                          <Trash2 className="w-3 h-3" />
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
