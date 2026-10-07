import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Ticket, 
  Film, 
  Users, 
  QrCode, 
  Search, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Edit2, 
  Trash2, 
  Popcorn, 
  Tag, 
  Eye,
  MapPin,
  Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  dashboardApi, 
  bookingApi, 
  movieApi, 
  showTimeApi, 
  concessionApi, 
  promoApi, 
  theatreApi, 
  MOCK_MOVIES, 
  MOCK_SHOWTIMES, 
  MOCK_CONCESSIONS, 
  MOCK_COUPONS, 
  MOCK_BOOKINGS,
  MOCK_THEATRES
} from '../services/api';
import { handleImageError, FALLBACK_POSTER, FALLBACK_CONCESSION } from '../utils/imageFallback';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { Movie, ShowTime, Concession, Coupon, Booking, Theatre } from '../types';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'MOVIES' | 'SHOWTIMES' | 'THEATRES' | 'CONCESSIONS' | 'PROMOS' | 'BOOKINGS'>('SCANNER');

  // Gate Scanner state
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; code: string; time: string } | null>(null);
  const [scanning, setScanning] = useState(false);

  // Movies state
  const [moviesList, setMoviesList] = useState<Movie[]>(MOCK_MOVIES);
  const [movieSearch, setMovieSearch] = useState('');
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    genre: '',
    durationMins: 140,
    posterUrl: '',
    trailerUrl: '',
    synopsis: ''
  });

  // Showtimes state
  const [showtimesList, setShowtimesList] = useState<ShowTime[]>(MOCK_SHOWTIMES);
  const [showAddShowtimeModal, setShowAddShowtimeModal] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: 1,
    theatreId: 1,
    screenId: 1,
    experience: 'IMAX_3D',
    date: new Date().toISOString().split('T')[0],
    startTime: '02:00 PM',
    endTime: '04:45 PM',
    odcPrice: 1200,
    balconyPrice: 1800,
    couplePrice: 3500,
    vipPrice: 2500
  });

  // Concessions state
  const [concessionsList, setConcessionsList] = useState<Concession[]>(MOCK_CONCESSIONS);
  const [showAddConcessionModal, setShowAddConcessionModal] = useState(false);
  const [editingConcession, setEditingConcession] = useState<Concession | null>(null);
  const [concessionForm, setConcessionForm] = useState({
    name: '',
    category: 'POPCORN',
    price: 1000,
    calories: 450,
    imageUrl: '',
    description: ''
  });

  // Promo codes state
  const [couponsList, setCouponsList] = useState<Coupon[]>(MOCK_COUPONS);
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minSpend: 1000,
    maxDiscount: 750
  });

  // Bookings state
  const [bookingsList, setBookingsList] = useState<Booking[]>(MOCK_BOOKINGS);
  const [bookingSearch, setBookingSearch] = useState('');
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);

  // Theatres state
  const [theatresList, setTheatresList] = useState<Theatre[]>(MOCK_THEATRES);
  const [theatreSearch, setTheatreSearch] = useState('');
  const [showAddTheatreModal, setShowAddTheatreModal] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState<Theatre | null>(null);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    city: 'Colombo',
    address: '',
    contactNumber: '+94 11 234 5678',
    screens: 3
  });

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      const statsData = await dashboardApi.getStats();
      if (statsData) setStats(statsData);

      const movies = await movieApi.getAll();
      if (movies && movies.length > 0) setMoviesList(movies);

      const showtimes = await showTimeApi.getAll();
      if (showtimes && showtimes.length > 0) setShowtimesList(showtimes);

      const concessions = await concessionApi.getAll();
      if (concessions && concessions.length > 0) setConcessionsList(concessions);

      const promos = await promoApi.getAll();
      if (promos && promos.length > 0) setCouponsList(promos);

      const bookings = await bookingApi.getAll();
      if (bookings && bookings.length > 0) setBookingsList(bookings);

      const theatres = await theatreApi.getAll();
      if (theatres && theatres.length > 0) setTheatresList(theatres);
    }

    loadInitialData();
  }, []);

  // ---------------- Gate QR Scanner ----------------
  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await bookingApi.checkIn(qrInput.trim());
      setScanResult({
        success: true,
        message: res.message || 'Ticket Verified! Guest admitted to auditorium.',
        code: qrInput.trim(),
        time: new Date().toLocaleTimeString()
      });
      toast.success('Ticket Verified & Admitted!');
      setQrInput('');

      setBookingsList((prev) =>
        prev.map((b) =>
          b.qrCodeHash === qrInput.trim() || b.bookingReference === qrInput.trim()
            ? { ...b, bookingStatus: 'CHECKED_IN' }
            : b
        )
      );
    } catch {
      setScanResult({
        success: false,
        message: 'Invalid or already admitted ticket code.',
        code: qrInput.trim(),
        time: new Date().toLocaleTimeString()
      });
      toast.error('Verification failed');
    } finally {
      setScanning(false);
    }
  };

  // ---------------- Movie CRUD ----------------
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await movieApi.update(editingMovie.id, movieForm);
        setMoviesList((prev) =>
          prev.map((m) => (m.id === editingMovie.id ? { ...m, ...movieForm } : m))
        );
        toast.success(`Updated "${movieForm.title}" successfully!`);
      } else {
        const saved = await movieApi.save(movieForm);
        setMoviesList((prev) => [saved, ...prev]);
        toast.success(`Movie "${movieForm.title}" published!`);
      }
      setShowAddMovieModal(false);
      setEditingMovie(null);
      resetMovieForm();
    } catch {
      toast.error('Failed to save movie');
    }
  };

  const handleEditMovieClick = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title || '',
      language: movie.language || 'ENGLISH',
      ageRating: movie.ageRating || 'PG_13',
      genre: movie.genre || '',
      durationMins: movie.durationMins || 140,
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || '',
      synopsis: movie.synopsis || ''
    });
    setShowAddMovieModal(true);
  };

  const handleDeleteMovie = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      try {
        await movieApi.delete(id);
        setMoviesList((prev) => prev.filter((m) => m.id !== id));
        toast.success('Movie deleted from catalog');
      } catch {
        toast.error('Failed to delete movie');
      }
    }
  };

  const resetMovieForm = () => {
    setMovieForm({
      title: '',
      language: 'ENGLISH',
      ageRating: 'PG_13',
      genre: '',
      durationMins: 140,
      posterUrl: '',
      trailerUrl: '',
      synopsis: ''
    });
  };

  // ---------------- Showtime CRUD ----------------
  const handleSaveShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMovieObj = moviesList.find((m) => m.id === Number(showtimeForm.movieId));
      const selectedTheatreObj = theatresList.find((t) => t.id === Number(showtimeForm.theatreId));

      const newEntry = {
        ...showtimeForm,
        movieId: Number(showtimeForm.movieId),
        theatreId: Number(showtimeForm.theatreId),
        theatreName: selectedTheatreObj?.name || 'Nexura Cinemas - Colombo',
        screenName: showtimeForm.screenId === 1 ? 'IMAX Laser Hall 1' : 'Dolby Atmos Screen 2',
        movieTitle: selectedMovieObj?.title || 'Featured Movie'
      };

      const saved = await showTimeApi.create(newEntry);
      setShowtimesList((prev) => [saved, ...prev]);
      toast.success('Showtime scheduled successfully!');
      setShowAddShowtimeModal(false);
    } catch {
      toast.error('Failed to schedule showtime');
    }
  };

  const handleDeleteShowtime = async (id: number) => {
    if (window.confirm('Delete this showtime slot?')) {
      try {
        await showTimeApi.delete(id);
        setShowtimesList((prev) => prev.filter((s) => s.id !== id));
        toast.success('Showtime slot removed');
      } catch {
        toast.error('Failed to remove showtime');
      }
    }
  };

  // ---------------- Concession CRUD ----------------
  const handleSaveConcession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConcession) {
        await concessionApi.update(editingConcession.id, concessionForm);
        setConcessionsList((prev) =>
          prev.map((c) => (c.id === editingConcession.id ? { ...c, ...concessionForm } : c))
        );
        toast.success(`Updated snack "${concessionForm.name}"!`);
      } else {
        const saved = await concessionApi.save(concessionForm);
        setConcessionsList((prev) => [saved, ...prev]);
        toast.success(`Added "${concessionForm.name}" to menu!`);
      }
      setShowAddConcessionModal(false);
      setEditingConcession(null);
      resetConcessionForm();
    } catch {
      toast.error('Failed to save concession item');
    }
  };

  const handleEditConcessionClick = (item: Concession) => {
    setEditingConcession(item);
    setConcessionForm({
      name: item.name || '',
      category: item.category || 'POPCORN',
      price: item.price || 1000,
      calories: item.calories || 450,
      imageUrl: item.imageUrl || '',
      description: item.description || ''
    });
    setShowAddConcessionModal(true);
  };

  const handleDeleteConcession = async (id: number, name: string) => {
    if (window.confirm(`Delete "${name}" from snacks menu?`)) {
      try {
        await concessionApi.delete(id);
        setConcessionsList((prev) => prev.filter((c) => c.id !== id));
        toast.success('Snack item removed');
      } catch {
        toast.error('Failed to delete snack');
      }
    }
  };

  const resetConcessionForm = () => {
    setConcessionForm({
      name: '',
      category: 'POPCORN',
      price: 1000,
      calories: 450,
      imageUrl: '',
      description: ''
    });
  };

  // ---------------- Promo Code CRUD ----------------
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await promoApi.save(couponForm);
      setCouponsList((prev) => [saved, ...prev]);
      toast.success(`Promo code "${couponForm.code}" created!`);
      setShowAddCouponModal(false);
      setCouponForm({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minSpend: 1000,
        maxDiscount: 750
      });
    } catch {
      toast.error('Failed to create promo code');
    }
  };

  const handleDeleteCoupon = async (id: number, code: string) => {
    if (window.confirm(`Delete promo code "${code}"?`)) {
      try {
        await promoApi.delete(id);
        setCouponsList((prev) => prev.filter((c) => c.id !== id));
        toast.success('Promo code deleted');
      } catch {
        toast.error('Failed to delete promo code');
      }
    }
  };

  // ---------------- Booking Cancellation ----------------
  const handleCancelBooking = async (id: number) => {
    if (window.confirm('Cancel this customer booking and refund seats?')) {
      try {
        await bookingApi.cancel(id);
        setBookingsList((prev) =>
          prev.map((b) => (b.id === id ? { ...b, bookingStatus: 'CANCELLED' } : b))
        );
        toast.success('Booking cancelled and seats released.');
      } catch {
        toast.error('Failed to cancel booking');
      }
    }
  };

  // ---------------- Theatres CRUD ----------------
  const handleOpenAddTheatre = () => {
    setEditingTheatre(null);
    setTheatreForm({
      name: '',
      city: 'Colombo',
      address: '',
      contactNumber: '+94 11 234 5678',
      screens: 3
    });
    setShowAddTheatreModal(true);
  };

  const handleOpenEditTheatre = (theatre: Theatre) => {
    setEditingTheatre(theatre);
    setTheatreForm({
      name: theatre.name,
      city: theatre.city,
      address: theatre.address || theatre.location || '',
      contactNumber: theatre.contactNumber || '+94 11 234 5678',
      screens: theatre.screens || 3
    });
    setShowAddTheatreModal(true);
  };

  const handleSaveTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theatreForm.name.trim() || !theatreForm.city.trim()) {
      toast.error('Please enter theatre name and city.');
      return;
    }

    try {
      if (editingTheatre) {
        await theatreApi.update(editingTheatre.id, theatreForm);
        setTheatresList((prev) =>
          prev.map((t) => (t.id === editingTheatre.id ? { ...t, ...theatreForm } : t))
        );
        toast.success(`Theatre "${theatreForm.name}" updated successfully!`);
      } else {
        const saved = await theatreApi.save(theatreForm);
        setTheatresList((prev) => [saved, ...prev]);
        toast.success(`Theatre "${theatreForm.name}" added to operations!`);
      }
      setShowAddTheatreModal(false);
    } catch {
      toast.error('Failed to save theatre');
    }
  };

  const handleDeleteTheatre = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from active theatres?`)) {
      try {
        await theatreApi.delete(id);
        setTheatresList((prev) => prev.filter((t) => t.id !== id));
        toast.success('Theatre removed.');
      } catch {
        toast.error('Failed to delete theatre');
      }
    }
  };

  // Filter movies, bookings, and theatres
  const filteredMovies = moviesList.filter((m) =>
    m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
    m.genre?.toLowerCase().includes(movieSearch.toLowerCase())
  );

  const filteredBookings = bookingsList.filter((b) =>
    (b.bookingReference && b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase())) ||
    (b.customerName && b.customerName.toLowerCase().includes(bookingSearch.toLowerCase())) ||
    (b.movieTitle && b.movieTitle.toLowerCase().includes(bookingSearch.toLowerCase()))
  );

  const filteredTheatres = theatresList.filter((t) =>
    t.name.toLowerCase().includes(theatreSearch.toLowerCase()) ||
    t.city.toLowerCase().includes(theatreSearch.toLowerCase()) ||
    (t.address && t.address.toLowerCase().includes(theatreSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Cinema Operations Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Logged in: <strong className="text-slate-200">{user?.fullName || 'Staff Operator'}</strong> ({user?.role?.replace('_', ' ') || 'STAFF'})
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('SCANNER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SCANNER' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Gate Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('MOVIES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'MOVIES' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Movies ({moviesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SHOWTIMES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SHOWTIMES' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Showtimes ({showtimesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('THEATRES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'THEATRES' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Theatres ({theatresList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONCESSIONS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'CONCESSIONS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Popcorn className="w-3.5 h-3.5" />
            <span>Snacks & Combos</span>
          </button>

          <button
            onClick={() => setActiveTab('PROMOS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PROMOS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'BOOKINGS' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Bookings Feed</span>
          </button>
        </div>
      </div>

      {/* ---------------- KPI Stat Cards ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Box Office</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            LKR {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '3,450,800'}
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">+18.4% this week</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Tickets Sold</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {stats?.totalBookings || '1,420'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Across 5 theatre multiplexes</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Movies</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {moviesList.length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">IMAX, 3D & Dolby Atmos</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Hall Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">
            {stats?.averageOccupancyRate || '84.5'}%
          </h3>
          <p className="text-[11px] text-cyan-400 mt-1 font-medium">Peak weekend demand</p>
        </div>
      </div>

      {/* ---------------- 1. GATE QR SCANNER TAB ---------------- */}
      {activeTab === 'SCANNER' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-rose-500/20 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center shadow-lg">
              <QrCode className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Ticket Usher Turnstile Gate Check-in
            </h2>
            <p className="text-xs text-slate-400">
              Enter or scan the customer's digital ticket pass hash to verify admission status.
            </p>
          </div>

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter or Scan Ticket QR Pass Hash
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
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-600/30"
                >
                  {scanning ? 'Verifying...' : 'Admit Guest'}
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

          {/* Quick Demo QR Test Buttons */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-semibold uppercase">
              Quick Test Codes:
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

      {/* ---------------- 2. MOVIES MANAGEMENT TAB (CRUD) ---------------- */}
      {activeTab === 'MOVIES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white font-['Outfit']">
                Cinema Movie Catalog ({filteredMovies.length})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter movies..."
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              <button
                onClick={() => { resetMovieForm(); setEditingMovie(null); setShowAddMovieModal(true); }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Movie</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMovies.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3 flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <img
                      src={m.posterUrl || FALLBACK_POSTER}
                      alt={m.title}
                      onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-500/30">
                      ★ {m.rating || 8.5}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1 font-['Outfit']">{m.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{m.genre}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                    <span className="uppercase font-semibold">{m.language}</span>
                    <span className="text-rose-400">{m.durationMins || 140} mins</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleEditMovieClick(m)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMovie(m.id, m.title)}
                    className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center transition-colors"
                    title="Delete Movie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. SHOWTIMES MANAGEMENT TAB (CRUD) ---------------- */}
      {activeTab === 'SHOWTIMES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Screen Showtimes & Schedules ({showtimesList.length})
            </h2>

            <button
              onClick={() => setShowAddShowtimeModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30 whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Showtime</span>
            </button>
          </div>

          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Movie</th>
                    <th className="py-3.5 px-4">Theatre</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Time Slot</th>
                    <th className="py-3.5 px-4">Ticket Prices</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {showtimesList.map((st) => {
                    const matchedMovie = moviesList.find((m) => m.id === st.movieId);
                    return (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {matchedMovie?.title || st.movieTitle || `Movie #${st.movieId}`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {st.theatreName || 'Nexura Cinemas - Colombo'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase">
                            {st.experience?.replace('_', ' ') || 'IMAX 3D'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-amber-300">
                          {st.startTime} - {st.endTime || '04:30 PM'}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          LKR {st.odcPrice} / {st.balconyPrice} / {st.vipPrice}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteShowtime(st.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Showtime"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- THEATRES MANAGEMENT TAB (CRUD) ---------------- */}
      {activeTab === 'THEATRES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Building className="w-5 h-5 text-rose-500" />
                Cinema Multiplex Locations ({filteredTheatres.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage cinema theatres, screens, and location contact details.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search multiplex or city..."
                  value={theatreSearch}
                  onChange={(e) => setTheatreSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>

              <button
                onClick={handleOpenAddTheatre}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Multiplex</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTheatres.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4 flex flex-col justify-between group hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase border border-rose-500/30">
                      {t.city}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-rose-400 transition-colors">
                    {t.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{t.address || t.location || `${t.city}, Sri Lanka`}</span>
                    </p>
                    {t.contactNumber && (
                      <p className="text-slate-300 font-mono text-[11px]">
                        Hotline: {t.contactNumber}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-semibold text-white">{t.screens || 3} Screens</span>
                    <span>•</span>
                    <span className="text-cyan-400">IMAX & Atmos</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleOpenEditTheatre(t)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Theatre</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTheatre(t.id, t.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
                    title="Delete Theatre"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 4. CONCESSIONS & SNACKS TAB (CRUD) ---------------- */}
      {activeTab === 'CONCESSIONS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Gourmet Concessions & Popcorn Menu ({concessionsList.length})
            </h2>

            <button
              onClick={() => { resetConcessionForm(); setEditingConcession(null); setShowAddConcessionModal(true); }}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30 whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Snack Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {concessionsList.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3 flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 mb-3 relative">
                    <img
                      src={item.imageUrl || FALLBACK_CONCESSION}
                      alt={item.name}
                      onError={(e) => handleImageError(e, FALLBACK_CONCESSION)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 uppercase">
                      {item.category}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1 font-['Outfit']">{item.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-xs">
                    <span className="font-bold text-white font-mono">LKR {item.price.toLocaleString()}</span>
                    {item.calories && <span className="text-slate-400">{item.calories} kcal</span>}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleEditConcessionClick(item)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteConcession(item.id, item.name)}
                    className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center transition-colors"
                    title="Delete Snack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 5. PROMO CODES TAB (CRUD) ---------------- */}
      {activeTab === 'PROMOS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Active Promo Discounts & Coupons ({couponsList.length})
            </h2>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/30 whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {couponsList.map((cp) => (
              <div
                key={cp.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-base text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {cp.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <p className="text-2xl font-black text-white font-['Outfit'] mt-3">
                    {cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}% OFF` : `LKR ${cp.discountValue} OFF`}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1 mt-2">
                    <p>Min Spend: LKR {cp.minSpend || 1000}</p>
                    <p>Max Discount: LKR {cp.maxDiscount || 800}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                    className="py-1 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 6. LIVE BOOKINGS FEED TAB ---------------- */}
      {activeTab === 'BOOKINGS' && (
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              Live Box Office Bookings ({filteredBookings.length})
            </h2>

            <div className="relative">
              <input
                type="text"
                placeholder="Search reference or guest..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

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
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBookings.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{b.bookingReference}</td>
                    <td className="py-3.5 px-4 text-white font-medium">{b.customerName || 'Guest Cinephile'}</td>
                    <td className="py-3.5 px-4">{b.movieTitle || 'Interstellar'}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-300">
                      {b.seats || b.bookedSeats?.map(s => `${s.rowLetter}${s.seatNumber}`).join(', ') || 'C5, C6'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      LKR {(b.totalAmount || b.totalPaid || 4400).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : b.bookingStatus === 'CHECKED_IN'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setInspectBooking(b)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Ticket QR Pass"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {b.bookingStatus === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Cancel & Refund"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 1: ADD/EDIT MOVIE ---------------- */}
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
              {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Schedule New Movie to Catalog'}
            </h3>

            <form onSubmit={handleSaveMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  placeholder="e.g. Gladiator II"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Language</label>
                  <select
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
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
                    value={movieForm.ageRating}
                    onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="GENERAL">General</option>
                    <option value="PG_13">PG-13</option>
                    <option value="R_18">R-18</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Genre</label>
                  <input
                    type="text"
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    placeholder="Action / Sci-Fi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={movieForm.durationMins}
                    onChange={(e) => setMovieForm({ ...movieForm, durationMins: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Poster Image URL</label>
                <input
                  type="url"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trailer YouTube URL</label>
                <input
                  type="url"
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Synopsis</label>
                <textarea
                  rows={3}
                  value={movieForm.synopsis}
                  onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                  placeholder="Brief story synopsis..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                {editingMovie ? 'Save Changes' : 'Publish Movie'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: ADD SHOWTIME ---------------- */}
      {showAddShowtimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddShowtimeModal(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Schedule Showtime Slot
            </h3>

            <form onSubmit={handleSaveShowtime} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Movie</label>
                <select
                  value={showtimeForm.movieId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                >
                  {moviesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Multiplex Theatre</label>
                  <select
                    value={showtimeForm.theatreId}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, theatreId: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    {theatresList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Format / Experience</label>
                  <select
                    value={showtimeForm.experience}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, experience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    <option value="IMAX_3D">IMAX 3D Laser</option>
                    <option value="DOLBY_ATMOS">Dolby Atmos</option>
                    <option value="VIP_LOUNGE">VIP Recliner Suite</option>
                    <option value="STANDARD_2D">Standard 2D</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={showtimeForm.date}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={showtimeForm.startTime}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, startTime: e.target.value })}
                    placeholder="02:00 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Time</label>
                  <input
                    type="text"
                    value={showtimeForm.endTime}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, endTime: e.target.value })}
                    placeholder="04:45 PM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">ODC Price (LKR)</label>
                  <input
                    type="number"
                    value={showtimeForm.odcPrice}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, odcPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Balcony Price (LKR)</label>
                  <input
                    type="number"
                    value={showtimeForm.balconyPrice}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, balconyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">VIP Recliner (LKR)</label>
                  <input
                    type="number"
                    value={showtimeForm.vipPrice}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, vipPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                Create Showtime Slot
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: ADD/EDIT CONCESSION ---------------- */}
      {showAddConcessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddConcessionModal(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              {editingConcession ? `Edit Snack: ${editingConcession.name}` : 'Add Concession to Snack Bar'}
            </h3>

            <form onSubmit={handleSaveConcession} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Snack Name</label>
                <input
                  type="text"
                  required
                  value={concessionForm.name}
                  onChange={(e) => setConcessionForm({ ...concessionForm, name: e.target.value })}
                  placeholder="e.g. Caramel Crunch Popcorn (Large)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={concessionForm.category}
                    onChange={(e) => setConcessionForm({ ...concessionForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="POPCORN">Popcorn</option>
                    <option value="SNACKS">Snacks</option>
                    <option value="BEVERAGE">Beverage</option>
                    <option value="COMBO">Combo</option>
                    <option value="DESSERT">Dessert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Price (LKR)</label>
                  <input
                    type="number"
                    required
                    value={concessionForm.price}
                    onChange={(e) => setConcessionForm({ ...concessionForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={concessionForm.calories}
                    onChange={(e) => setConcessionForm({ ...concessionForm, calories: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={concessionForm.imageUrl}
                  onChange={(e) => setConcessionForm({ ...concessionForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={concessionForm.description}
                  onChange={(e) => setConcessionForm({ ...concessionForm, description: e.target.value })}
                  placeholder="Freshly prepared delicious cinema snack..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                {editingConcession ? 'Save Changes' : 'Add Item to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: ADD PROMO COUPON ---------------- */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddCouponModal(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Create New Promo Discount Code
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (LKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Minimum Spend (LKR)</label>
                  <input
                    type="number"
                    value={couponForm.minSpend}
                    onChange={(e) => setCouponForm({ ...couponForm, minSpend: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Max Cap (LKR)</label>
                  <input
                    type="number"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                Activate Promo Code
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 5: INSPECT TICKET QR ---------------- */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 relative shadow-2xl">
            <button
              onClick={() => setInspectBooking(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Digital Admission Pass QR
            </h3>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-inner">
              <QRCodeSVG
                value={inspectBooking.qrCodeHash || 'NEXURA-PASS-' + inspectBooking.bookingReference}
                size={180}
                level="H"
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-mono text-amber-400 font-bold">{inspectBooking.bookingReference}</p>
              <p className="font-bold text-white">{inspectBooking.movieTitle}</p>
              <p className="text-slate-400">{inspectBooking.customerName || 'Guest'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 6: ADD / EDIT THEATRE ---------------- */}
      {showAddTheatreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddTheatreModal(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-['Outfit']">
              {editingTheatre ? `Edit Multiplex: ${editingTheatre.name}` : 'Register New Cinema Multiplex'}
            </h3>

            <form onSubmit={handleSaveTheatre} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Multiplex Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexura Luxe - One Galle Face"
                  value={theatreForm.name}
                  onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Colombo"
                    value={theatreForm.city}
                    onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Auditorium Screens</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={theatreForm.screens}
                    onChange={(e) => setTheatreForm({ ...theatreForm, screens: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. 1A Centre Road, Galle Face, Colombo 02"
                  value={theatreForm.address}
                  onChange={(e) => setTheatreForm({ ...theatreForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Box Office Hotline / Phone</label>
                <input
                  type="tel"
                  placeholder="+94 11 234 5678"
                  value={theatreForm.contactNumber}
                  onChange={(e) => setTheatreForm({ ...theatreForm, contactNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shadow-lg shadow-rose-600/30"
              >
                {editingTheatre ? 'Save Changes' : 'Register Multiplex'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
