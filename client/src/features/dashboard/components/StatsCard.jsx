import React from 'react';

export default function StatsCard({ label, value, icon: Icon, valueColorClass = "text-gold" }) {
  return (
    <div className="border border-gold/15 bg-gradient-to-br from-[#1F1108]/85 to-[#120500]/95 backdrop-blur-md p-5 rounded-lg relative overflow-hidden flex justify-between items-center">
      <div className="space-y-1 text-left">
        <span className="text-label-xs uppercase tracking-widest text-cream/50 block font-body font-semibold">{label}</span>
        <span className={`font-display text-title-md block font-bold ${valueColorClass} tracking-wide`}>
          {value}
        </span>
      </div>
      {Icon && (
        <div className="w-10 h-10 bg-gold/[0.03] border border-gold/15 rounded-lg flex items-center justify-center text-gold/50">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
