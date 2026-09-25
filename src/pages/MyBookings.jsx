import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  ArrowLeft,
  Popcorn
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fallbackBookings = [
    {
      id: 101,
      bookingReference: 'NX-892143',
      movieTitle: 'Dune: Part Two',
      moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      theatreName: 'Nexura Grand - Colombo City Centre',
      screenName: 'IMAX Laser Hall 1',
      showStartTime: 'Today, 02:00 PM',
      totalAmount: 4400,
      bookingStatus: 'CONFIRMED',
      qrCodeHash: 'NEXURA-PASS-NX-892143',
      bookedSeats: [
        { rowLetter: 'C', seatNumber: 5, seatType: 'BALCONY' },
        { rowLetter: 'C', seatNumber: 6, seatType: 'BALCONY' }
      ]
    },
    {
      id: 102,
      bookingReference: 'NX-651239',
      movieTitle: 'Oppenheimer',
      moviePoster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
      theatreName: 'Nexura Luxe - One Galle Face',
      screenName: 'VIP Recliner Suite',
      showStartTime: 'Yesterday, 07:15 PM',
      totalAmount: 7600,
      bookingStatus: 'CHECKED_IN',
      qrCodeHash: 'NEXURA-PASS-NX-651239',
      bookedSeats: [
        { rowLetter: 'A', seatNumber: 1, seatType: 'VIP_RECLINER' },
        { rowLetter: 'A', seatNumber: 2, seatType: 'VIP_RECLINER' }
      ]
    }
  ];

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      try {
        if (user?.id) {
          const list = await bookingApi.getByUser(user.id);
          if (list && list.length > 0) {
            setBookings(list);
          } else {
            setBookings(fallbackBookings);
          }
        } else {
          setBookings(fallbackBookings);
        }
      } catch (err) {
        setBookings(fallbackBookings);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking and release seats?')) {
      try {
        await bookingApi.cancel(bookingId);
        toast.success('Booking cancelled successfully.');
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'CANCELLED' } : b))
        );
      } catch (err) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CHECKED_IN':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-3xl font-black text-white font-['Outfit'] flex items-center gap-3">
            <Ticket className="w-7 h-7 text-rose-500" /> My Cinema Passes & Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your admission QR codes, view seat details, or manage your bookings.
          </p>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-5">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex gap-4 items-center">
                {b.moviePoster && (
                  <img
                    src={b.moviePoster}
                    alt={b.movieTitle}
                    className="w-16 h-24 object-cover rounded-2xl border border-slate-700 shrink-0"
                  />
                )}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {b.bookingReference}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(b.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    {b.movieTitle}
                  </h3>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p>{b.theatreName} • <span className="text-rose-400">{b.screenName}</span></p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {b.showStartTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Seats & Actions */}
              <div className="flex flex-col md:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400">Seats:</span>
                  {b.bookedSeats?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold"
                    >
                      {s.rowLetter}{s.seatNumber}
                    </span>
                  ))}
                </div>

                <div className="text-xs font-mono font-bold text-slate-200">
                  Total Paid: LKR {Number(b.totalAmount || 0).toLocaleString()}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View QR Pass</span>
                  </button>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No movie tickets found</h3>
          <p className="text-xs text-slate-400 mt-1">Ready for your next cinema adventure?</p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
          >
            Explore Movies
          </Link>
        </div>
      )}

      {/* View QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 relative shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white font-['Outfit']">
              {selectedTicket.movieTitle}
            </h3>
            <p className="text-xs text-rose-400 font-mono font-semibold">
              {selectedTicket.bookingReference}
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-lg">
              <QRCodeSVG
                value={selectedTicket.qrCodeHash || selectedTicket.bookingReference}
                size={180}
                level="H"
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Show this QR code at the ticket usher scanner for immediate cinema hall entry.
            </p>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
