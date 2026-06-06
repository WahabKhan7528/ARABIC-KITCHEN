import React from 'react';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';

export default function InventoryModule() {
  const inventory = [
    { id: 1, item: 'Saffron (Premium)', quantity: '500g', status: 'Low Stock', lastRestocked: '2026-06-01' },
    { id: 2, item: 'Basmati Rice', quantity: '150kg', status: 'In Stock', lastRestocked: '2026-06-05' },
    { id: 3, item: 'Lamb Meat', quantity: '45kg', status: 'In Stock', lastRestocked: '2026-06-06' },
    { id: 4, item: 'Olive Oil', quantity: '5L', status: 'Low Stock', lastRestocked: '2026-05-28' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Total Items Tracked</span>
          <span className="font-display text-title-md text-gold block mt-2 font-bold">{inventory.length}</span>
        </div>
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Low Stock Alerts</span>
          <span className="font-display text-title-md text-accent-red block mt-2 font-bold">2</span>
        </div>
      </section>

      <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
        <div className="overflow-x-auto w-full relative z-10">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                <th className="py-4 px-5">Item Name</th>
                <th className="py-4 px-4">Current Quantity</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Restocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-gold/[0.02] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-ivory font-display text-body-md font-bold">{inv.item}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-ivory font-bold">{inv.quantity}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-1.5 text-label-xs uppercase tracking-wider font-semibold ${inv.status === 'In Stock' ? 'text-emerald-400' : 'text-accent-red'}`}>
                      {inv.status === 'In Stock' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-cream/60 font-mono text-label-sm">{inv.lastRestocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
