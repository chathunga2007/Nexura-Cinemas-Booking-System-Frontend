import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Popcorn, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ArrowRight, 
  Ticket, 
  Sparkles, 
  Check, 
  Flame, 
  ShoppingBag,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { concessionApi, MOCK_CONCESSIONS } from '../services/api';
import { useBooking } from '../context/BookingContext';

export default function ConcessionsPage() {
  const navigate = useNavigate();
  const {
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    selectedSnacks,
    updateSnackQuantity,
    seatsSubtotal,
    snacksSubtotal,
    subtotal
  } = useBooking();

  const [concessions, setConcessions] = useState(MOCK_CONCESSIONS);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConcessions() {
      setLoading(true);
      try {
        const data = await concessionApi.getAll();
        if (data && data.length > 0) setConcessions(data);
      } catch (err) {
        console.error('Failed to load concessions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConcessions();
  }, []);

  const categories = ['ALL', 'POPCORN', 'SNACKS', 'BEVERAGE', 'COMBO', 'DESSERT'];

  const filteredConcessions = concessions.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const getItemQuantity = (id) => {
    const found = selectedSnacks.find((s) => s.id === id);
    return found ? found.quantity : 0;
  };

  const handleContinue = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen pb-32">
      
      {/* ---------------- Top Breadcrumb & Header ---------------- */}
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={selectedShowtime ? `/booking/${selectedShowtime.id}` : '/'}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Seat Selection
          </Link>
          <div className="text-xs text-slate-400">
            Step 2 of 3: <strong className="text-white">Gourmet Snacks</strong>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Popcorn className="w-4 h-4" /> Freshly Prepared In-House
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Enhance Your Movie Experience
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Skip box-office queues! Your pre-ordered snacks and warm popcorn will be ready at the VIP Express Counter when you arrive.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 justify-start sm:justify-center no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ---------------- Main Content Grid ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Concessions Cards (2 cols) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredConcessions.map((item) => {
              const qty = getItemQuantity(item.id);

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      {item.category}
                    </div>
                    {item.calories && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-slate-400">
                        {item.calories} kcal
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors font-['Outfit']">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-lg font-black text-white font-['Outfit']">
                        LKR {item.price.toLocaleString()}
                      </span>

                      {/* Stepper Buttons */}
                      <div className="flex items-center gap-2">
                        {qty > 0 && (
                          <>
                            <button
                              onClick={() => updateSnackQuantity(item, -1)}
                              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {qty}
                            </span>
                          </>
                        )}
                        <button
                          onClick={() => updateSnackQuantity(item, 1)}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{qty > 0 ? 'Add More' : 'Add'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Card (1 col) */}
          <div className="lg:col-span-1 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sticky top-28 space-y-6">
            <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-500" /> Booking Order Summary
            </h3>

            {/* Movie & Showtime */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
              <p className="font-bold text-white text-sm">{selectedMovie?.title || 'Dune: Part Two'}</p>
              <p className="text-slate-400">{selectedShowtime?.theatreName || 'Nexura Grand'}</p>
              <p className="text-rose-400 font-medium">
                {selectedShowtime?.screenName} • {selectedShowtime?.startTime}
              </p>
            </div>

            {/* Seats */}
            <div className="space-y-2 border-b border-slate-800 pb-4 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Selected Seats ({selectedSeats.length})</span>
                <span className="text-white">LKR {seatsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono"
                  >
                    {s.rowLetter}{s.seatNumber} ({s.seatType})
                  </span>
                ))}
              </div>
            </div>

            {/* Snacks Items List */}
            <div className="space-y-3 border-b border-slate-800 pb-4 text-xs">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Concessions & Snacks</span>
                <span className="text-white">LKR {snacksSubtotal.toLocaleString()}</span>
              </div>

              {selectedSnacks.length > 0 ? (
                selectedSnacks.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-slate-400">
                    <span className="truncate max-w-[170px]">{s.name} x{s.quantity}</span>
                    <span className="font-mono text-slate-200">
                      LKR {(s.price * s.quantity).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic text-[11px]">No snacks added yet</p>
              )}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Total Due</span>
                <span className="text-2xl font-black text-white font-['Outfit']">
                  LKR {subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleContinue}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {selectedSnacks.length === 0 && (
                <button
                  onClick={handleContinue}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Skip snacks & proceed
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
