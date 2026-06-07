import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { login, registerCustomer, clearAuthError } from '../../../store/slices/authSlice';
import { KhatamPattern } from '../../../shared/ui/ArabicPattern';

export default function CustomerAuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await dispatch(login({ email: formData.email, password: formData.password }));
      if (login.fulfilled.match(result)) {
        onClose();
      }
    } else {
      const result = await dispatch(registerCustomer(formData));
      if (registerCustomer.fulfilled.match(result)) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1A0A00] border border-gold/30 rounded-lg w-full max-w-md relative overflow-hidden shadow-2xl">
        <KhatamPattern opacity={0.05} />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gold/20 relative z-10">
          <h2 className="font-display italic text-title-md text-ivory">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-cream/50 hover:text-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 relative z-10">
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded text-accent-red text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                    <User className="w-3 h-3 text-gold" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A1205]/60 border border-gold/20 rounded px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gold" /> Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A1205]/60 border border-gold/20 rounded px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-gold" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#2A1205]/60 border border-gold/20 rounded px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body"
              />
            </div>

            <div className="space-y-1">
              <label className="text-label-xs uppercase tracking-widest text-cream/60 font-body flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-gold" /> Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#2A1205]/60 border border-gold/20 rounded px-4 py-2.5 text-body-sm text-ivory placeholder-cream/30 focus:outline-none focus:border-gold transition-colors font-body"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-gold hover:bg-gold-light text-[#1A0A00] font-body text-label-sm font-bold uppercase tracking-[0.2em] rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Please Wait...' : (isLogin ? 'Log In' : 'Register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearAuthError());
              }}
              className="text-sm font-body text-cream/60 hover:text-gold transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
