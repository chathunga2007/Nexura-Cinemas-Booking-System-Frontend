import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, 
  Search, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Ticket, 
  Menu, 
  X,
  Popcorn,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Navbar() {
  const { user, isAuthenticated, logout, setAuthModalOpen, setAuthModalMode, loginAsDemo } = useAuth();
  const { selectedSeats, formattedHoldTimer, isHolding } = useBooking();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Movies', path: '/' },
    { name: 'Experiences', path: '/#experiences' },
    { name: 'Concessions & Snacks', path: '/concessions' },
    { name: 'Theatres', path: '/#theatres' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-105 group-hover:shadow-rose-500/50 transition-all duration-300">
              <Film className="w-6 h-6 text-white transform -rotate-6 group-hover:rotate-0 transition-transform" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-rose-400 bg-clip-text text-transparent font-['Outfit']">
                NEXURA
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-[0.25em] text-rose-500 -mt-1">
                Cinemas Luxe
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/10 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-64">
            <input
              type="text"
              placeholder="Search movies, IMAX, VIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            
            {/* Active Seat Hold Timer Badge */}
            {isHolding && selectedSeats.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-pulse">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Seats Held: {formattedHoldTimer}</span>
              </div>
            )}

            {/* Quick Demo Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all"
                title="Switch demo role to test Admin, Manager, Usher or Customer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setDemoMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => { loginAsDemo('SUPER_ADMIN'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center justify-between"
                  >
                    <span>Super Admin</span>
                    <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-300">All Access</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('CINEMA_MANAGER'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 flex items-center justify-between"
                  >
                    <span>Cinema Manager</span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">Dashboard</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('TICKET_USHER'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-cyan-400 hover:bg-cyan-500/10 flex items-center justify-between"
                  >
                    <span>Ticket Gate Usher</span>
                    <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300">QR Check-in</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('CUSTOMER'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Customer Cinephile</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Booking</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all text-xs font-medium"
                >
                  <span className="max-w-[100px] truncate text-slate-200">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {user?.role?.replace('_', ' ')}
                      </span>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-rose-400" />
                      <span>My Movie Tickets</span>
                    </Link>

                    {['SUPER_ADMIN', 'CINEMA_MANAGER', 'TICKET_USHER'].includes(user?.role) && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors font-medium"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Cinema Staff Portal</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-800 mt-1">
                      <button
                        onClick={() => { logout(); setProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModalMode('register'); setAuthModalOpen(true); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 shadow-md shadow-rose-600/30 transition-all"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-6 space-y-3 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Search movies, IMAX, VIP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-900"
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-rose-400 px-3 py-2"
              >
                <Ticket className="w-4 h-4" /> My Movie Tickets
              </Link>
              {['SUPER_ADMIN', 'CINEMA_MANAGER', 'TICKET_USHER'].includes(user?.role) && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-amber-400 px-3 py-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Cinema Staff Portal
                </Link>
              )}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-left text-sm text-rose-500 px-3 py-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex gap-3 border-t border-slate-800">
              <button
                onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white"
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthModalMode('register'); setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-rose-600 text-white"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
