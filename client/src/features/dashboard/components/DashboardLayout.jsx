import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../store/slices/authSlice';
import { 
  CalendarCheck, 
  ShoppingBag, 
  UtensilsCrossed, 
  LogOut,
  Users,
  Menu,
  X
} from 'lucide-react';
import { KhatamPattern } from '../../../shared/ui/ArabicPattern';

export default function DashboardLayout({ activeModule, setActiveModule, children, currentTime }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const modules = [
    { id: 'reservations', label: 'Table Reservations', icon: CalendarCheck },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'menu-items', label: 'Menu Items', icon: UtensilsCrossed },
    ...(user?.role === 'admin' ? [{ id: 'staff', label: 'Staff Management', icon: Users }] : []),
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    window.location.hash = ''; // Return to guest view
  };

  return (
    <div 
      className="h-screen text-ivory select-none font-body flex flex-col md:flex-row overflow-hidden bg-[#1A0A00]"
      style={{ background: 'radial-gradient(ellipse at center, #230C01 0%, #080200 100%)' }}
    >
      <KhatamPattern opacity={0.04} />

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gold/15 bg-[#1F1108]/90 backdrop-blur-md relative z-30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold/10 rounded-full border border-gold/30 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-gold" />
          </div>
          <span className="font-display text-body-md text-ivory tracking-wide font-semibold">
            {modules.find(m => m.id === activeModule)?.label || 'Dashboard'}
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 border border-gold/20 bg-gold/5 text-gold hover:bg-gold/10 rounded-[2px] transition-all duration-300 cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay (Mobile Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#080200]/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-full md:w-64 border-r border-gold/15 bg-[#1F1108]/95 backdrop-blur-md flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 transform md:transform-none md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gold/15 flex flex-col items-center text-center relative">
          {/* Close button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 md:hidden border border-gold/20 bg-gold/5 text-gold hover:bg-gold/10 rounded-[2px] cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-gold/10 rounded-full border border-gold/30 flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-6 h-6 text-gold" />
          </div>
          <span className="font-arabic text-label-xs tracking-[0.25em] text-gold/80 block uppercase mb-1">
            لوحة التحكم
          </span>
          <h1 className="font-display text-body-lg text-ivory tracking-wide leading-tight">
            Dashboard
          </h1>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[2px] transition-all duration-300 font-display text-body-md tracking-wider cursor-pointer ${
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
            <span className="text-body-md tracking-widest font-mono font-bold text-gold-light/90 drop-shadow-md">
              {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
            </span>
            <span className="text-[10px] font-bold uppercase text-cream/40 tracking-widest">
              {currentTime ? currentTime.toLocaleDateString() : '--/--/----'}
            </span>
          </div>
          <a 
            href="#" 
            onClick={handleLogout}
            className="w-full px-4 py-2 border border-accent-red/40 hover:bg-accent-red hover:text-ivory text-accent-red text-label-xs font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Exit Portal
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col md:h-screen overflow-hidden">
        {/* We use md:h-screen and overflow-y-auto so the content scrolls but sidebar is fixed */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 sm:p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
