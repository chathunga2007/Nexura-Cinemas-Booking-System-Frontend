import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Ticket, 
  Film, 
  Users, 
  QrCode, 
  Search, 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardApi, bookingApi, movieApi, MOCK_MOVIES } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('SCANNER'); // 'SCANNER', 'MOVIES', 'BOOKINGS', 'PROMOS'
  
  // Usher Ticket Scanner State
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  // Movie Management
  const [moviesList, setMoviesList] = useState(MOCK_MOVIES);
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    genre: '',
    durationMins: 140,
    posterUrl: '',
    trailerUrl: '',
    synopsis: ''
  });

  useEffect(() => {
    async function loadStats() {
      const data = await dashboardApi.getStats();
      setStats(data);
      const movies = await movieApi.getAll();
      if (movies && movies.length > 0) setMoviesList(movies);
    }
    loadStats();
  }, []);

  // Handle Usher Gate QR Scan
  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await bookingApi.checkIn(qrInput.trim());
      setScanResult({
        success: true,
        message: res.message || 'Ticket Verified & Admitted! Enjoy the show.',
        code: qrInput.trim(),
        time: new Date().toLocaleTimeString()
      });
      toast.success('Customer checked in at gate!');
      setQrInput('');
    } catch (err) {
      setScanResult({
        success: false,
        message: 'Invalid or already scanned ticket QR code.',
        code: qrInput.trim(),
        time: new Date().toLocaleTimeString()
      });
      toast.error('Ticket verification failed');
    } finally {
      setScanning(false);
    }
  };

  // Handle Add Movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await movieApi.save(newMovie);
      toast.success('Movie published successfully to cinema catalog!');
      setMoviesList((prev) => [{ ...newMovie, id: Date.now(), rating: 8.5 }, ...prev]);
      setShowAddMovieModal(false);
      setNewMovie({
        title: '',
        language: 'ENGLISH',
        ageRating: 'PG_13',
        genre: '',
        durationMins: 140,
        posterUrl: '',
        trailerUrl: '',
        synopsis: ''
      });
    } catch (err) {
      toast.error('Failed to add movie');
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4" /> Cinema Operations Center
          </div>
          <h1 className="text-3xl font-black text-white font-['Outfit'] mt-1">
            Nexura Staff & Manager Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Welcome, <strong className="text-slate-200">{user?.fullName || 'Cinema Staff'}</strong> ({user?.role?.replace('_', ' ') || 'CINEMA_MANAGER'})
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'SCANNER'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('MOVIES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MOVIES'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movie Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'BOOKINGS'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Live Bookings</span>
          </button>
        </div>
      </div>

      {/* ---------------- KPI Stat Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Box Office</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            LKR {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '3,450,800'}
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">+18.4% from last weekend</p>
        </div>

        {/* Total Admissions */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Tickets Sold</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {stats?.totalBookings || '1,420'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 cinema multiplexes</p>
        </div>

        {/* Movies Playing */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Movies</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {stats?.activeMovies || moviesList.length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">IMAX, 3D, Dolby Atmos</p>
        </div>

        {/* Average Occupancy */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Hall Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {stats?.averageOccupancyRate || '84.5'}%
          </h3>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium">High peak-hour demand</p>
        </div>

      </div>

      {/* ---------------- Tab 1: Ticket Usher Gate Scanner Simulator ---------------- */}
      {activeTab === 'SCANNER' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Ticket Usher Gate Check-in
            </h2>
            <p className="text-xs text-slate-400">
              Scan customer ticket QR hash to verify booking and admit cinephiles through gate turnstiles.
            </p>
          </div>

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scan or Enter Ticket QR Hash
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. NEXURA-PASS-NX-892143"
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={scanning}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  {scanning ? 'Verifying...' : 'Admit Customer'}
                </button>
              </div>
            </div>
          </form>

          {/* Verification Result Banner */}
          {scanResult && (
            <div
              className={`p-5 rounded-2xl border text-xs space-y-1.5 animate-in fade-in ${
                scanResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {scanResult.success ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-rose-400" />}
                <span>{scanResult.message}</span>
              </div>
              <p className="font-mono text-[11px] text-slate-400">
                Code: {scanResult.code} • Time: {scanResult.time}
              </p>
            </div>
          )}

          {/* Quick Demo QR buttons */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-2 font-semibold uppercase">
              Quick Test QR Codes:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setQrInput('NEXURA-PASS-NX-892143')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                NEXURA-PASS-NX-892143
              </button>
              <button
                type="button"
                onClick={() => setQrInput('NEXURA-PASS-NX-651239')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                NEXURA-PASS-NX-651239
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Tab 2: Movie Management ---------------- */}
      {activeTab === 'MOVIES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Active Movie Catalog ({moviesList.length})
            </h2>
            <button
              onClick={() => setShowAddMovieModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Movie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {moviesList.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3"
              >
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full aspect-[2/3] object-cover rounded-xl"
                />
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{m.title}</h4>
                  <p className="text-xs text-slate-400">{m.genre}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <span>{m.language}</span>
                    <span className="text-amber-400 font-bold">★ {m.rating || 8.8}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- Tab 3: Live Bookings Feed ---------------- */}
      {activeTab === 'BOOKINGS' && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white font-['Outfit']">
            Recent Box Office Transactions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Movie</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(stats?.recentBookings || [
                  { reference: 'NX-89214', customerName: 'Roshan Silva', movie: 'Dune: Part Two', seats: 'A1, A2', amount: 7600, status: 'CONFIRMED' },
                  { reference: 'NX-65123', customerName: 'Anuki De Silva', movie: 'Oppenheimer', seats: 'C5, C6', amount: 4400, status: 'CONFIRMED' },
                  { reference: 'NX-32091', customerName: 'Sahan Wickrama', movie: 'Gladiator II', seats: 'B3, B4', amount: 5000, status: 'CHECKED_IN' }
                ]).map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{b.reference}</td>
                    <td className="py-3.5 px-4 text-white font-medium">{b.customerName}</td>
                    <td className="py-3.5 px-4">{b.movie}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-300">{b.seats}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">LKR {b.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddMovieModal(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Add New Movie to Catalog
            </h3>

            <form onSubmit={handleAddMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="e.g. Deadpool & Wolverine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Language</label>
                  <select
                    value={newMovie.language}
                    onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="ENGLISH">English</option>
                    <option value="SINHALA">Sinhala</option>
                    <option value="TAMIL">Tamil</option>
                    <option value="HINDI">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Age Rating</label>
                  <select
                    value={newMovie.ageRating}
                    onChange={(e) => setNewMovie({ ...newMovie, ageRating: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="GENERAL">General</option>
                    <option value="PG_13">PG-13</option>
                    <option value="R_18">R-18</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Genre</label>
                <input
                  type="text"
                  value={newMovie.genre}
                  onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                  placeholder="Action / Comedy / Sci-Fi"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={newMovie.posterUrl}
                  onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Publish Movie
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
