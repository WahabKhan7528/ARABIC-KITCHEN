import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function ReservationsTable({
  filteredReservations,
  todayStr,
  tomorrowStr,
  onTableChange,
  onStatusChange,
  onEdit,
  onDelete
}) {
  return (
    <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
      <div className="overflow-x-auto w-full relative z-10">
        {filteredReservations.length === 0 ? (
          <div className="py-16 text-center text-cream/40 text-body-sm font-body">No reservations found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                <th className="py-4 px-5">Guest details</th>
                <th className="py-4 px-4">Schedule</th>
                <th className="py-4 px-4 text-center">Seats</th>
                <th className="py-4 px-4">Table</th>
                <th className="py-4 px-5">Requests</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredReservations.map((res) => {
                let badgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/25';
                if (res.status === 'confirmed') badgeClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25';
                else if (res.status === 'seated') badgeClass = 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25 animate-pulse';
                else if (res.status === 'completed') badgeClass = 'bg-zinc-800/40 text-zinc-400 border-zinc-700/20';
                else if (res.status === 'cancelled') badgeClass = 'bg-rose-950/40 text-rose-400 border-rose-500/20';

                return (
                  <tr key={res._id} className={`hover:bg-gold/[0.02] transition-colors ${res.status === 'completed' || res.status === 'cancelled' ? 'opacity-60' : ''}`}>
                    <td className="py-4 px-5">
                      <div className="flex flex-col text-left">
                        <span className="text-ivory font-display text-body-md font-bold">{res.guestName}</span>
                        <span className="text-label-xs text-cream/50 font-mono mt-0.5">{res.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold">{res.reservationDate === todayStr ? 'Today' : res.reservationDate === tomorrowStr ? 'Tomorrow' : res.reservationDate}</span>
                        <span className="text-label-xs text-gold-light/85 font-semibold mt-0.5">{res.reservationTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono px-2 py-1 bg-[#1A0A00]/40 border border-gold/10 text-ivory font-bold">{res.partySize}</span>
                    </td>
                    <td className="py-4 px-4">
                      <input 
                        type="text" 
                        value={res.tableNumber || ''} 
                        onChange={(e) => onTableChange(res._id, e.target.value)}
                        placeholder="Assign..."
                        className="w-20 bg-[#1A0A00]/40 border border-gold/15 rounded-[2px] px-2 py-1 text-label-xs text-ivory focus:outline-none focus:border-gold/50"
                      />
                    </td>
                    <td className="py-4 px-5 text-cream/70 max-w-xs truncate text-left">
                      {res.specialRequests ? `"${res.specialRequests}"` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${badgeClass}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 font-body">
                        {res.status === 'pending' && (
                          <button onClick={() => onStatusChange(res._id, 'confirmed')} className="px-2 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Confirm</button>
                        )}
                        {res.status === 'confirmed' && (
                          <button onClick={() => onStatusChange(res._id, 'seated')} className="px-2 py-1 bg-cyan-700/80 hover:bg-cyan-600 text-ivory rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Seat</button>
                        )}
                        {res.status === 'seated' && (
                          <button onClick={() => onStatusChange(res._id, 'completed')} className="px-2 py-1 bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Complete</button>
                        )}
                        {res.status !== 'completed' && res.status !== 'cancelled' && (
                          <button onClick={() => onStatusChange(res._id, 'cancelled')} className="px-2 py-1 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-[2px] text-label-xs uppercase font-bold tracking-wider cursor-pointer">Cancel</button>
                        )}
                        <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                        <button onClick={() => onEdit(res)} className="p-1 border border-gold/10 hover:border-gold/30 bg-[#1A0A00]/40 text-cream/60 hover:text-gold rounded-[2px] cursor-pointer">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button onClick={() => onDelete(res._id, res.guestName)} className="p-1 border border-accent-red/20 hover:border-accent-red bg-[#1A0A00]/40 text-accent-red/60 hover:text-ivory rounded-[2px] cursor-pointer">
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
