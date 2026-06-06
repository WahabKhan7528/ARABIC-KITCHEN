import React from 'react';
import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';

export default function AnalyticsModule() {
  const metrics = [
    { id: 1, title: 'Total Revenue', value: 'PKR 145,500', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-400', border: 'border-emerald-500/20' },
    { id: 2, title: 'Total Guests Served', value: '1,248', trend: '+5.2%', icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { id: 3, title: 'Top Selling Item', value: 'Al-Mandi Royal', trend: '450 units', icon: Award, color: 'text-gold', border: 'border-gold/20' },
    { id: 4, title: 'Customer Satisfaction', value: '4.8/5.0', trend: '+0.1', icon: TrendingUp, color: 'text-orange-400', border: 'border-orange-500/20' }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="font-display text-title-md text-ivory">Performance Overview</h2>
        <p className="text-body-sm text-cream/60">High-level insights and key metrics for the current month.</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-left">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className={`border ${metric.border} bg-[#1F1108]/60 p-5 rounded-[2px] relative overflow-hidden group hover:bg-[#1A0A00]/80 transition-colors`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-label-xs uppercase tracking-widest text-cream/50 block w-2/3">{metric.title}</span>
                <div className={`p-2 rounded-full bg-[#1A0A00] border ${metric.border}`}>
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                </div>
              </div>
              <span className={`font-display text-title-md block font-bold ${metric.color}`}>{metric.value}</span>
              <span className="text-label-xs text-cream/40 block mt-2 font-mono">{metric.trend} this month</span>
            </div>
          );
        })}
      </section>

      <section className="border border-gold/25 bg-[#1F1108]/75 shadow-lg overflow-hidden rounded-[2px] p-8 text-center min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 opacity-50">
          <TrendingUp className="w-12 h-12 text-gold/40" />
          <p className="text-body-sm text-cream/60">Detailed graphical charts will be integrated here in future updates.</p>
        </div>
      </section>
    </div>
  );
}
