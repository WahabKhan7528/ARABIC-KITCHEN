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
    <section className="border border-gold/15 bg-gradient-to-b from-[#1F1108]/85 to-[#0F0500]/95 backdrop-blur-md overflow-hidden rounded-xl relative">
      <div className="overflow-x-auto w-full relative z-10">
        {filteredReservations.length === 0 ? (
          <div className="py-20 text-center text-cream/40 text-body-sm font-body">No reservations found.</div>
        ) : (
          <table className="w-full text-left border-collapse text-body-md">
            <thead>
              <tr className="border-b border-gold/15 text-gold uppercase tracking-[0.15em] text-label-sm bg-[#120500]/80 font-body">
                <th className="py-4 px-6">Guest Details</th>
                <th className="py-4 px-4">Schedule</th>
                <th className="py-4 px-4 text-center">Seats</th>
                <th className="py-4 px-4">Table</th>
                <th className="py-4 px-6">Special Requests</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {filteredReservations.map((res) => {
                let badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                if (res.status === 'confirmed') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                else if (res.status === 'seated') badgeClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse';
                else if (res.status === 'completed') badgeClass = 'bg-zinc-500/10 text-zinc-400 border-zinc-700/20';
                else if (res.status === 'cancelled') badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                return (
                  <tr key={res._id} className={`hover:bg-gold/[0.03] transition-colors duration-300 ${res.status === 'completed' || res.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="text-ivory font-display text-body-lg font-bold tracking-wide">{res.guestName}</span>
                        <span className="text-label-sm text-cream/50 font-mono mt-0.5">{res.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-cream/90">{res.reservationDate === todayStr ? 'Today' : res.reservationDate === tomorrowStr ? 'Tomorrow' : res.reservationDate}</span>
                        <span className="text-label-sm text-gold-light/90 font-bold mt-0.5">{res.reservationTime}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono px-2.5 py-1 bg-[#1A0A00]/50 border border-gold/15 text-gold-light rounded font-bold">{res.partySize}</span>
                    </td>
                    <td className="py-4 px-4">
                      <input 
                        type="text" 
                        value={res.tableNumber || ''} 
                        onChange={(e) => onTableChange(res._id, e.target.value)}
                        placeholder="Assign Table"
                        className="w-24 bg-[#1A0A00]/50 border border-gold/15 rounded-md px-2.5 py-1.5 text-label-sm text-ivory focus:outline-none focus:border-gold-light focus:ring-2 focus:ring-gold-light/25"
                      />
                    </td>
                    <td className="py-4 px-6 text-cream/70 max-w-xs truncate text-left italic font-body text-body-sm">
                      {res.specialRequests ? `"${res.specialRequests}"` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full border text-label-xs uppercase tracking-wider font-bold ${badgeClass}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 font-body">
                        {res.status === 'pending' && (
                          <button onClick={() => onStatusChange(res._id, 'confirmed')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-ivory rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Confirm</button>
                        )}
                        {res.status === 'confirmed' && (
                          <button onClick={() => onStatusChange(res._id, 'seated')} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-ivory rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Seat</button>
                        )}
                        {res.status === 'seated' && (
                          <button onClick={() => onStatusChange(res._id, 'completed')} className="px-3 py-1.5 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-[#1A0A00] rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Complete</button>
                        )}
                        {res.status !== 'completed' && res.status !== 'cancelled' && (
                          <button onClick={() => onStatusChange(res._id, 'cancelled')} className="px-3 py-1.5 border border-accent-red/40 hover:bg-accent-red/20 text-accent-red/90 rounded-full text-label-sm uppercase font-bold tracking-wider transition-colors duration-200 cursor-pointer">Cancel</button>
                        )}
                        <span className="w-[1px] h-4 bg-gold/10 mx-0.5" />
                        <button onClick={() => onEdit(res)} className="p-1.5 border border-gold/15 hover:border-gold/40 bg-[#1A0A00]/50 text-cream/60 hover:text-gold rounded-full transition-colors duration-200 cursor-pointer" title="Edit Reservation">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDelete(res._id, res.guestName)} className="p-1.5 border border-accent-red/25 hover:border-accent-red/60 bg-[#1A0A00]/50 text-accent-red/60 hover:text-ivory rounded-full transition-colors duration-200 cursor-pointer" title="Delete Reservation">
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
