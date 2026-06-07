import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#080200]/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-[#1F1108] border border-accent-red/30 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-1 border border-accent-red/10 pointer-events-none" />
        <div className="p-6 border-b border-gold/15 flex items-center gap-3 text-accent-red">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-display text-title-sm text-ivory">Confirm Action</h3>
          <button 
            onClick={onCancel}
            className="ml-auto p-1.5 border border-transparent hover:border-gold/20 text-cream/50 hover:text-gold transition-colors rounded-[2px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-cream/90 text-body-md font-body leading-relaxed">
          {message}
        </div>
        <div className="p-4 border-t border-gold/15 flex justify-end gap-3 bg-[#1A0A00]/50">
          <button 
            onClick={onCancel}
            className="px-5 py-2 text-label-xs font-bold uppercase tracking-widest text-cream/60 hover:text-ivory border border-transparent hover:border-gold/30 rounded-[2px] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-5 py-2 text-label-xs font-bold uppercase tracking-widest bg-accent-red hover:bg-red-600 text-ivory rounded-[2px] transition-colors shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
