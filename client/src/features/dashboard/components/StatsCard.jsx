import React from 'react';

export default function StatsCard({ label, value, valueColorClass = "text-gold" }) {
  return (
    <div className="border border-gold/20 bg-[#1F1108]/60 p-4 rounded-[2px] relative overflow-hidden group">
      <span className="text-label-xs uppercase tracking-widest text-cream/50 block">{label}</span>
      <span className={`font-display text-title-md block mt-2 font-bold ${valueColorClass}`}>
        {value}
      </span>
    </div>
  );
}
