import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Check, 
  Heart, 
  Crown,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { showTimeApi, MOCK_MOVIES, MOCK_SHOWTIMES } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Seat } from '../types';

export default function SeatSelection() {
  const { showTimeId } = useParams<{ showTimeId: string }>();
  const navigate = useNavigate();

  const {
    selectedMovie,
    setSelectedMovie,
    selectedShowtime,
    setSelectedShowtime,
    selectedSeats,
    toggleSeat,
    seatsSubtotal,
    formattedHoldTimer,
    isHolding
  } = useBooking();

  const [seatLayout, setSeatLayout] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLayout() {
      setLoading(true);
      try {
        if (!selectedShowtime && showTimeId) {
          const fallbackSt = MOCK_SHOWTIMES.find(s => s.id === Number(showTimeId)) || MOCK_SHOWTIMES[0];
          setSelectedShowtime(fallbackSt);
          if (!selectedMovie) {
            setSelectedMovie(MOCK_MOVIES.find(m => m.id === fallbackSt.movieId) || MOCK_MOVIES[0]);
          }
        }

        if (showTimeId) {
          const layout = await showTimeApi.getLayout(showTimeId);
          setSeatLayout(layout || []);
        }
      } catch (err) {
        console.error('Failed to load seat layout:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLayout();
  }, [showTimeId, selectedShowtime, selectedMovie, setSelectedShowtime, setSelectedMovie]);

  // Group seats by rowLetter
  const rowsMap = seatLayout.reduce((acc: Record<string, Seat[]>, seat: Seat) => {
    if (!acc[seat.rowLetter]) acc[seat.rowLetter] = [];
    acc[seat.rowLetter].push(seat);
    return acc;
  }, {});

  const rowKeys = Object.keys(rowsMap).sort();

  const getSeatVisuals = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (seat.seatStatus === 'BOOKED') {
      return 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed';
    }
    if (seat.seatStatus === 'HELD' && !isSelected) {
      return 'bg-amber-500/20 text-amber-500 border-amber-500/40 cursor-not-allowed animate-pulse';
    }
    if (isSelected) {
      return 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-lg shadow-emerald-500/50 scale-110 z-10';
    }

    // Available styles based on seat type
    switch (seat.seatType) {
      case 'VIP_RECLINER':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 hover:shadow-lg hover:shadow-amber-500/30';
      case 'COUPLE_SEAT':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/40 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30';
      case 'BALCONY':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500 hover:text-white';
      default: // ODC
        return 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-500';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.seatStatus === 'BOOKED') {
      toast.error(`Seat ${seat.rowLetter}${seat.seatNumber} is already booked.`);
      return;
    }
    if (seat.seatStatus === 'HELD' && !selectedSeats.some(s => s.id === seat.id)) {
      toast('Seat currently held by another user in checkout', { icon: '⏳' });
      return;
    }
    toggleSeat(seat);
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least 1 cinema seat to proceed.');
      return;
    }
    navigate('/concessions');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-36">
      
      {/* Top Header Bar */}
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link
              to={selectedMovie ? `/movie/${selectedMovie.id}` : '/'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                {selectedMovie?.title || 'Dune: Part Two'}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{selectedShowtime?.theatreName || 'Nexura Grand'}</span>
                <span>•</span>
                <span className="text-rose-400 font-semibold">{selectedShowtime?.screenName || 'IMAX Screen 1'}</span>
                <span>•</span>
                <span className="text-white font-medium">{selectedShowtime?.startTime || '02:00 PM'}</span>
              </p>
            </div>
          </div>

          {/* Hold Countdown Badge */}
          {isHolding && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Clock className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Hold Session Active: <strong className="text-white font-mono">{formattedHoldTimer}</strong></span>
            </div>
          )}

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Cinema Screen Curved Glow */}
        <div className="relative mb-16 text-center max-w-3xl mx-auto">
          <div className="h-2.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full cinema-screen-glow mb-4" />
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-400/80">
            ALL EYES THIS WAY • CURVED 4K LASER SCREEN
          </p>
          <div className="w-3/4 mx-auto h-12 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none rounded-t-full" />
        </div>

        {/* Seat Matrix Layout */}
        <div className="space-y-4 overflow-x-auto pb-6 text-center no-scrollbar">
          {rowKeys.map((rowLetter) => {
            const seats = rowsMap[rowLetter];
            const isVipRow = rowLetter === 'A';
            const isCoupleRow = rowLetter === 'B';

            return (
              <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3 min-w-[600px]">
                
                {/* Row Letter Left */}
                <span className="w-6 text-xs font-bold text-slate-500 uppercase">
                  {rowLetter}
                </span>

                {/* Seats List */}
                <div className="flex items-center gap-2">
                  {seats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.id === seat.id);
                    const isCouple = seat.seatType === 'COUPLE_SEAT';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        className={`relative rounded-lg border text-xs transition-all duration-200 flex items-center justify-center ${
                          isCouple ? 'w-14 h-8' : 'w-8 h-8'
                        } ${getSeatVisuals(seat)}`}
                        title={`Row ${seat.rowLetter}, Seat ${seat.seatNumber} (${seat.seatType} - LKR ${seat.price})`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isCouple ? (
                          <Heart className="w-3 h-3 fill-current opacity-70" />
                        ) : isVipRow ? (
                          <Crown className="w-3 h-3 fill-current opacity-70" />
                        ) : (
                          <span className="text-[10px] font-semibold">{seat.seatNumber}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row Letter Right */}
                <span className="w-6 text-xs font-bold text-slate-500 uppercase">
                  {rowLetter}
                </span>

              </div>
            );
          })}
        </div>

        {/* Seat Categories Legend */}
        <div className="mt-14 p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700" />
            <span>ODC (LKR 1,500)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
              B
            </div>
            <span>Balcony (LKR 2,200)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-5 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <Heart className="w-3 h-3 fill-current" />
            </div>
            <span>Couple Seat (LKR 5,000)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Crown className="w-3 h-3 fill-current" />
            </div>
            <span>VIP Recliner (LKR 3,800)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
              ✓
            </div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-800/40 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">
              ✕
            </div>
            <span>Unavailable / Booked</span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Booking Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-[#090A0F]/95 backdrop-blur-2xl border-t border-slate-800/90 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Selected Seats Pills */}
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
            <div className="text-left shrink-0">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Selected ({selectedSeats.length}/8):
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono"
                    >
                      {s.rowLetter}{s.seatNumber}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No seats selected yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & CTA Button */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Subtotal</span>
              <span className="text-2xl font-black text-white font-['Outfit']">
                LKR {seatsSubtotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-xl shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Continue to Snacks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
