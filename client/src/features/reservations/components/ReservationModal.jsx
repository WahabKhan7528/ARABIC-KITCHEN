import React from 'react';
import { User, Phone, Calendar, Clock, Users, Check, MessageSquare, X } from 'lucide-react';
import { MuqarnasArch } from '../../../shared/ui/ArabicPattern';

export default function ReservationModal({
  isOpen,
  onClose,
  selectedRes,
  modalData,
  modalErrors,
  handleModalInputChange,
  handleModalSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[995] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-[#0F0500]/85 backdrop-blur-sm transition-opacity" />
      <div className="relative w-full max-w-lg bg-[#1F1108] border-2 border-gold/30 p-8 shadow-2xl rounded-[2px] overflow-hidden animate-scale-up z-10 text-left">
        <div className="absolute inset-2 border border-gold/10 pointer-events-none" />
        <button onClick={onClose} className="absolute top-4 right-4 text-cream/40 hover:text-gold transition-colors p-1 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <header className="mb-6 text-center">
          <span className="font-arabic text-label-xs tracking-[0.25em] text-gold block">
            {selectedRes ? 'تعديل الحجز' : 'حجز يدوي جديد'}
          </span>
          <h3 className="font-display text-title-sm text-gold-light mt-1">
            {selectedRes ? 'Edit Reservation' : 'Create Walk-In / Manual Booking'}
          </h3>
          <MuqarnasArch color="#C9952A" size={30} className="mt-2 mx-auto" />
        </header>
        <form onSubmit={handleModalSave} className="space-y-4 font-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-gold" /> Full Name
              </label>
              <input 
                type="text" 
                name="name" 
                value={modalData.name} 
                onChange={handleModalInputChange} 
                placeholder="e.g. Asim Raza" 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body" 
              />
              {modalErrors.name && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.name}</span>}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <Phone className="w-2.5 h-2.5 text-gold" /> Phone
              </label>
              <input 
                type="tel" 
                name="phone" 
                value={modalData.phone} 
                onChange={handleModalInputChange} 
                placeholder="e.g. 03001234567" 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body" 
              />
              {modalErrors.phone && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.phone}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-gold" /> Date
              </label>
              <input 
                type="date" 
                name="date" 
                value={modalData.date} 
                onChange={handleModalInputChange} 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]" 
              />
              {modalErrors.date && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.date}</span>}
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-gold" /> Time
              </label>
              <input 
                type="time" 
                name="time" 
                value={modalData.time} 
                onChange={handleModalInputChange} 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body [color-scheme:dark]" 
              />
              {modalErrors.time && <span className="text-label-xs text-accent-red font-semibold">{modalErrors.time}</span>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <Users className="w-2.5 h-2.5 text-gold" /> Guests count
              </label>
              <select 
                name="guests" 
                value={modalData.guests} 
                onChange={handleModalInputChange} 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-2.5 py-2.5 text-body-sm text-ivory focus:outline-none focus:border-gold font-body"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num} className="bg-[#1A0A00] text-ivory">{num} Guests</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start gap-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-gold" /> Table
              </label>
              <input 
                type="text" 
                name="table" 
                value={modalData.table} 
                onChange={handleModalInputChange} 
                placeholder="e.g. Table 4" 
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body" 
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="text-label-xs uppercase tracking-widest text-cream/60 flex items-center gap-1">
              <MessageSquare className="w-2.5 h-2.5 text-gold" /> Special Requests
            </label>
            <textarea 
              name="requests" 
              value={modalData.requests} 
              onChange={handleModalInputChange} 
              rows="2" 
              placeholder="Requests..." 
              className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3.5 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body resize-none" 
            />
          </div>
          <div className="pt-4 flex gap-3.5">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border border-gold/30 text-gold hover:bg-gold/5 font-body text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-body text-label-xs font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer"
            >
              {selectedRes ? 'Save' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
