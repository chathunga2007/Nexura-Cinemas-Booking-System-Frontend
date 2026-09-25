import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Printer, 
  Share2, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  Popcorn, 
  Home, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function TicketSuccess() {
  const { reference } = useParams();
  const { latestBooking } = useBooking();
  const printRef = useRef(null);

  useEffect(() => {
    // Fire confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#F59E0B', '#10B981', '#38BDF8']
      });
    } catch (e) {
      console.warn('Confetti unavailable');
    }
  }, []);

  const booking = latestBooking || {
    bookingReference: reference || 'NX-491028',
    customerName: 'Kasun Perera',
    movieTitle: 'Dune: Part Two',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    theatreName: 'Nexura Grand - Colombo City Centre',
    screenName: 'IMAX Laser Hall 1',
    showStartTime: '02:00 PM',
    bookedSeats: [
      { id: 1, rowLetter: 'C', seatNumber: 5, seatType: 'BALCONY', price: 2200 },
      { id: 2, rowLetter: 'C', seatNumber: 6, seatType: 'BALCONY', price: 2200 }
    ],
    snacks: [
      { id: 1, name: 'Caramel Crunch Popcorn (Large)', quantity: 1 }
    ],
    totalPaid: 5600,
    qrCodeHash: 'NEXURA-PASS-' + (reference || 'NX-491028'),
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      
      {/* Top Congratulatory Header */}
      <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Your digital ticket pass is ready. Please present this QR code to the usher at the gate.
        </p>
      </div>

      {/* ---------------- Boarding-Pass Style Cinema Ticket ---------------- */}
      <div 
        ref={printRef}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
      >
        
        {/* Ticket Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider text-white font-['Outfit']">
                NEXURA CINEMAS
              </span>
              <span className="block text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                Digital Admission Pass
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking Ref</span>
            <span className="text-sm font-black text-amber-400 font-mono tracking-wider">
              {booking.bookingReference}
            </span>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {booking.moviePoster && (
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-24 sm:w-28 aspect-[2/3] object-cover rounded-2xl shadow-lg border border-slate-700 shrink-0"
              />
            )}

            <div className="space-y-3 flex-1">
              <div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase border border-rose-500/30">
                  Confirmed & Paid
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1.5">
                  {booking.movieTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Cinema</span>
                  <span className="text-slate-200 font-medium truncate block">{booking.theatreName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Screen</span>
                  <span className="text-rose-400 font-semibold">{booking.screenName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Showtime</span>
                  <span className="text-slate-200 font-medium">{booking.showStartTime}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Guest Name</span>
                  <span className="text-slate-200 font-medium truncate block">{booking.customerName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seats & Snacks Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold text-white">Seats Reserved:</span>
              <div className="flex gap-1.5">
                {booking.bookedSeats?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono font-bold"
                  >
                    {s.rowLetter}{s.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            {booking.snacks && booking.snacks.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  <Popcorn className="w-3.5 h-3.5 text-amber-400" /> Express Snacks:
                </span>
                <span className="text-slate-200">
                  {booking.snacks.map((sn) => `${sn.name} (x${sn.quantity})`).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Perforated Notch Line */}
          <div className="relative my-4 flex items-center">
            <div className="w-4 h-8 bg-[#090A0F] rounded-r-full -ml-6 border-r border-slate-800" />
            <div className="flex-1 border-b-2 border-dashed border-slate-700/60 mx-2" />
            <div className="w-4 h-8 bg-[#090A0F] rounded-l-full -mr-6 border-l border-slate-800" />
          </div>

          {/* QR Code Verification Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1 justify-center sm:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gate QR Pass
              </span>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                Scan this code at the ticket gate usher scanner for entry. Valid for all seats in this reservation.
              </p>
              <p className="text-xs font-mono font-bold text-slate-300 pt-1">
                Total Paid: LKR {Number(booking.totalPaid || 0).toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-xl shrink-0">
              <QRCodeSVG
                value={booking.qrCodeHash || booking.bookingReference}
                size={110}
                level="M"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 text-center border-t border-slate-800 text-[10px] text-slate-500 font-mono">
          AUTHENTICATED SECURE TICKET • NEXURA CINEMAS LUXE
        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Ticket</span>
        </button>

        <Link
          to="/my-bookings"
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-2"
        >
          <Ticket className="w-4 h-4 text-rose-400" />
          <span>View My Bookings</span>
        </Link>

        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Book Another Movie</span>
        </Link>
      </div>

    </div>
  );
}
