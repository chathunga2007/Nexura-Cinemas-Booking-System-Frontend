import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Film, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle, 
  ArrowLeft,
  Phone,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';

type ModalView = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [view, setView] = useState<ModalView>(authModalMode || 'login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync external mode if changed
  React.useEffect(() => {
    if (authModalMode) {
      setView(authModalMode);
    }
  }, [authModalMode]);

  if (!authModalOpen) return null;

  // 1. Handle Login or Register
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        const success = await login(email, password);
        if (success) {
          setAuthModalOpen(false);
        }
      } else if (view === 'register') {
        await register({ fullName, email, password, phoneNumber, role: 'CUSTOMER' });
        setAuthModalOpen(false);
      }
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Send Forgot Password OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your account email address.');
      return;
    }
    setLoading(true);
    try {
      await userApi.forgotPassword(email.trim().toLowerCase());
      toast.success('6-Digit Verification Code sent to your email!');
      setView('reset');
    } catch {
      toast.error('Failed to send reset code. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP and Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the verification code.');
      return;
    }
    if (password.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await userApi.resetPassword(email.trim().toLowerCase(), otp.trim(), password);
      toast.success('Password successfully reset! Please sign in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setView('login');
      setAuthModalMode('login');
    } catch {
      toast.error('Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 shadow-lg shadow-rose-500/30 mb-3">
            <Film className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            {view === 'login' && 'Welcome Back'}
            {view === 'register' && 'Create Your Account'}
            {view === 'forgot' && 'Reset Password'}
            {view === 'reset' && 'Create New Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {view === 'login' && 'Enter your credentials to access tickets and services.'}
            {view === 'register' && 'Sign up to reserve seats, pre-order snacks & earn loyalty points.'}
            {view === 'forgot' && 'We’ll send a 6-digit one-time password (OTP) to your email.'}
            {view === 'reset' && `Enter the verification code sent to ${email}`}
          </p>
        </div>

        {/* Tabs for Login & Register */}
        {(view === 'login' || view === 'register') && (
          <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setView('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                view === 'login'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setView('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                view === 'register'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* ---------------- 1. LOGIN & REGISTER FORMS ---------------- */}
        {(view === 'login' || view === 'register') && (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {view === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kasun Perera"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (Sri Lanka)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{view === 'login' ? 'Sign In to Nexura' : 'Create Customer Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ---------------- 2. FORGOT PASSWORD: REQUEST OTP ---------------- */}
        {view === 'forgot' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Enter your account email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </form>
        )}

        {/* ---------------- 3. RESET PASSWORD: ENTER OTP & NEW PASSWORD ---------------- */}
        {view === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                6-Digit Verification Code (OTP)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-center font-mono font-bold tracking-widest text-amber-400 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Update Password & Sign In</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setView('forgot')}
                className="text-slate-400 hover:text-white"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-rose-400 hover:text-rose-300 font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
