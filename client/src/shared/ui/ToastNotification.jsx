import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed top-6 right-6 z-[999] max-w-sm w-full bg-[#1F1108]/95 border-2 border-gold/60 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rounded-[2px] animate-scale-up flex gap-3.5 items-start text-left">
      <div className="bg-gold/10 p-2 rounded-full border border-gold/30 text-gold mt-0.5 shrink-0">
        <CheckCircle className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex-1">
        <h4 className="text-gold font-display text-body-md font-semibold">{toast.title}</h4>
        <p className="text-label-xs text-cream/80 mt-1 leading-relaxed">{toast.message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-cream/40 hover:text-gold transition-colors shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
