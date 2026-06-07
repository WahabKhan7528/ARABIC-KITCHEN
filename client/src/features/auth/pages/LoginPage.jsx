import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../../../store/slices/authSlice';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { KhatamPattern } from '../../../shared/ui/ArabicPattern';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeId && password) {
      dispatch(login({ employeeId, password }));
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0A00] flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay">
        <KhatamPattern />
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#281005_0%,#0F0500_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 border border-[#C9952A]/20 bg-[#1A0A00]/80 backdrop-blur-md rounded-lg shadow-2xl">
        <div className="text-center mb-8">
          <img src="/logo.webp" alt="Logo" className="w-16 h-16 mx-auto mb-4 border border-[#C9952A]/30 rounded-full" />
          <h1 className="text-2xl font-display text-gold mb-1">Staff Access</h1>
          <p className="text-sm font-body text-cream/60">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 rounded text-red-400 text-sm text-center font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
            <input
              type="text"
              placeholder="Employee ID (e.g. ADMIN001)"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded pl-10 pr-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors font-mono uppercase"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1A0A00]/60 border border-gold/20 rounded pl-10 pr-12 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-gold transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full mt-2 bg-[#C9952A] hover:bg-[#E8BA5A] text-[#1A0A00] font-bold py-3 rounded tracking-wider uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body"
          >
            {status === 'loading' ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#home" className="text-sm font-body text-cream/40 hover:text-gold transition-colors">
            &larr; Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
