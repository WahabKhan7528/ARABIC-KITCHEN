import React from 'react';
import { 
  CalendarCheck, 
  ShoppingBag, 
  UtensilsCrossed, 
  LogOut,
  Settings
} from 'lucide-react';
import { KhatamPattern } from '../ui/ArabicPattern';

export default function DashboardLayout({ activeModule, setActiveModule, children, currentTime }) {
  const modules = [
    { id: 'reservations', label: 'Table Reservations', icon: CalendarCheck },
    { id: 'orders', label: 'Culinary Orders', icon: ShoppingBag },
    { id: 'menu-items', label: 'Menu Items', icon: UtensilsCrossed },
  ];

  return (
    <div 
      className="min-h-screen text-ivory select-none font-body flex overflow-hidden bg-[#1A0A00]"
      style={{ background: 'radial-gradient(ellipse at center, #230C01 0%, #080200 100%)' }}
    >
      <KhatamPattern opacity={0.04} />

      {/* Sidebar */}
      <aside className="w-64 border-r border-gold/15 bg-[#1F1108]/90 backdrop-blur-md flex flex-col relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-gold/15 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gold/10 rounded-full border border-gold/30 flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6 text-gold" />
          </div>
          <span className="font-arabic text-label-xs tracking-[0.25em] text-gold/80 block uppercase mb-1">
            بوابة الموظفين
          </span>
          <h1 className="font-display  text-body-lg text-ivory tracking-wide leading-tight">
            Staff Portal
          </h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] transition-all duration-300 font-display  text-body-md tracking-wider cursor-pointer ${
                  isActive
                    ? 'bg-gold/[0.08] text-gold border-l-2 border-gold shadow-[inset_2px_0_0_#C9952A]'
                    : 'text-cream/50 hover:text-cream/90 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-cream/40'}`} />
                {mod.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gold/15 space-y-3">
          <div className="px-4 py-2 border border-gold/15 bg-[#1A0A00]/50 rounded-[2px] flex flex-col gap-1 text-center">
            <span className="text-label-xs tracking-widest font-mono text-gold-light/90">
              {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
            </span>
            <span className="text-[10px] uppercase text-cream/40 tracking-widest">
              {currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
            </span>
          </div>
          <a 
            href="#" 
            className="w-full px-4 py-2 border border-accent-red/40 hover:bg-accent-red hover:text-ivory text-accent-red text-label-xs font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Exit Portal
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* We use h-screen and overflow-y-auto so the content scrolls but sidebar is fixed */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
