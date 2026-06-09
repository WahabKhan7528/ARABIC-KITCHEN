import React from 'react';
import { X } from 'lucide-react';

export default function StaffModal({ isOpen, onClose, selectedStaff, modalData, modalErrors, handleModalInputChange, handleModalSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#080200]/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#1F1108] border border-gold/30 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-1 border border-gold/10 pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 border-b border-gold/15 flex items-center justify-between">
          <h3 className="font-display italic text-title-sm text-gold">
            {selectedStaff ? 'Edit User' : 'Add New User'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 border border-gold/20 bg-gold/5 text-gold hover:bg-gold/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleModalSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-label-xs uppercase tracking-widest text-cream/70">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={modalData.name}
              onChange={handleModalInputChange}
              placeholder="e.g. Ali Khan"
              className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
            />
            {modalErrors.name && <p className="text-accent-red text-xs mt-1">{modalErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modalData.role === 'customer' ? (
              <div className="space-y-1">
                <label className="text-label-xs uppercase tracking-widest text-cream/70">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={modalData.email || ''}
                  onChange={handleModalInputChange}
                  placeholder="e.g. client@email.com"
                  className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
                />
                {modalErrors.email && <p className="text-accent-red text-xs mt-1">{modalErrors.email}</p>}
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-label-xs uppercase tracking-widest text-cream/70">Employee ID</label>
                <input 
                  type="text" 
                  name="employeeId"
                  value={modalData.employeeId}
                  onChange={handleModalInputChange}
                  readOnly={!selectedStaff}
                  placeholder="e.g. EMP-102"
                  className={`w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body ${!selectedStaff ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
                {modalErrors.employeeId && <p className="text-accent-red text-xs mt-1">{modalErrors.employeeId}</p>}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/70">Phone</label>
              <input 
                type="text" 
                name="phone"
                value={modalData.phone}
                onChange={handleModalInputChange}
                placeholder="e.g. 03001234567"
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/70">Role</label>
              <select
                name="role"
                value={modalData.role}
                onChange={handleModalInputChange}
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="customer">Client</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/70">Status</label>
              <select
                name="isActive"
                value={modalData.isActive ? 'true' : 'false'}
                onChange={(e) => handleModalInputChange({ target: { name: 'isActive', value: e.target.value === 'true' } })}
                className="w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory focus:outline-none focus:border-gold font-body"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-label-xs uppercase tracking-widest text-cream/70">Password</label>
            <input 
              type={selectedStaff ? "password" : "text"} 
              name="password"
              value={modalData.password}
              onChange={handleModalInputChange}
              readOnly={!selectedStaff}
              placeholder={selectedStaff ? "Leave blank to keep unchanged" : "Auto-generated password"}
              className={`w-full bg-[#1A0A00]/80 border border-gold/20 rounded-[2px] px-3 py-2 text-body-sm text-ivory placeholder-cream/35 focus:outline-none focus:border-gold font-body ${!selectedStaff ? 'opacity-70 cursor-not-allowed font-mono' : ''}`}
            />
            {modalErrors.password && <p className="text-accent-red text-xs mt-1">{modalErrors.password}</p>}
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gold/15 flex justify-end gap-3 mt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-label-xs font-bold uppercase tracking-widest text-cream/60 hover:text-ivory border border-transparent hover:border-gold/30 rounded-[2px] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 text-label-xs font-bold uppercase tracking-widest bg-gold hover:bg-gold-light text-[#1A0A00] rounded-[2px] transition-colors shadow-md"
            >
              {selectedStaff ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
