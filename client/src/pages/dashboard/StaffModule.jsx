import React from 'react';
import { User, Phone, CheckCircle, Clock } from 'lucide-react';

export default function StaffModule() {
  const staffMembers = [
    { id: 1, name: 'Ali Hasan', role: 'Head Chef', shift: 'Morning', status: 'Active' },
    { id: 2, name: 'Sara Khan', role: 'Waitress', shift: 'Evening', status: 'On Break' },
    { id: 3, name: 'Omar Farooq', role: 'Sous Chef', shift: 'Morning', status: 'Active' },
    { id: 4, name: 'Layla Ahmed', role: 'Manager', shift: 'Full Day', status: 'Active' }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header / Intro */}
      <div className="border-b border-gold/10 pb-4 text-left">
        <h2 className="text-title-sm font-display text-gold-light">Staff Directory</h2>
        <p className="text-body-sm text-cream/60 mt-1">
          View all restaurant staff members, check active shift assignments, roles, and current statuses.
        </p>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Total Staff</span>
          <span className="font-display text-title-md text-gold block mt-2 font-bold">{staffMembers.length}</span>
        </div>
        <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
          <span className="text-label-xs uppercase tracking-widest text-cream/50 block">Active Now</span>
          <span className="font-display text-title-md text-emerald-400 block mt-2 font-bold">3</span>
        </div>
      </section>

      <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] relative">
        <div className="overflow-x-auto w-full relative z-10">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-gold/20 text-gold uppercase tracking-widest text-label-xs bg-[#1A0A00]/40 font-body">
                <th className="py-4 px-5">Name</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Shift</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gold/[0.02] transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-ivory font-display text-body-md font-bold">{staff.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-cream/80">{staff.role}</td>
                  <td className="py-4 px-4 text-cream/80">{staff.shift}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-[2px] border text-label-xs uppercase tracking-wider font-semibold ${staff.status === 'Active' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25' : 'bg-amber-950/40 text-amber-400 border-amber-500/25'}`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
