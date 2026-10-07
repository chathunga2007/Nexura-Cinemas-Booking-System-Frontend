import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Film, ExternalLink, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Admin Brand */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                <Film className="w-5 h-5 text-white transform -rotate-6 group-hover:rotate-0 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-wider text-white font-['Outfit']">
                    NEXURA
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Staff Hub
                  </span>
                </div>
                <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 -mt-0.5">
                  Cinema Operations & Management
                </span>
              </div>
            </Link>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-3">
            
            {/* Link back to Cinema Customer Web */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
              title="Return to the public cinema website"
            >
              <span>View Cinema Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            </Link>

            {/* Operator Info Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <span className="font-semibold text-white max-w-[120px] truncate">
                {user?.fullName?.split(' ')[0] || 'Admin'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                {user?.role?.replace('_', ' ') || 'STAFF'}
              </span>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
