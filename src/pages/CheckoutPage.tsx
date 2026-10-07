import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Tag, 
  ArrowLeft, 
  Check, 
  Lock, 
  Ticket 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '../services/api';
import { handleImageError, FALLBACK_POSTER } from '../utils/imageFallback';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedMovie,
    selectedShowtime,
    selectedSeats,
    selectedSnacks,
    seatsSubtotal,
    snacksSubtotal,
    finalTotal,
    discountAmount,
    promoCode,
    applyPromo,
    removePromo,
    setLatestBooking,
    resetBooking
  } = useBooking();

  // Contact details
  const [customerName, setCustomerName] = useState<string>(user?.fullName || 'Kasun Perera');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || 'kasun.cinephile@gmail.com');
  const [customerPhone, setCustomerPhone] = useState<string>('+94 77 123 4567');

  // Promo code local input
  const [couponInput, setCouponInput] = useState<string>('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'PAYHERE' | 'CARD' | 'COUNTER'>('PAYHERE');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput) {
      applyPromo(couponInput);
    }
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      toast.error('No seats selected! Please select your seats.');
      navigate('/');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        userId: user?.id || 1,
        showTimeId: selectedShowtime?.id || 101,
        seatIds: selectedSeats.map((s) => s.id),
        paymentMethod: paymentMethod === 'PAYHERE' ? 'PAYHERE' : paymentMethod === 'CARD' ? 'CREDIT_CARD' : 'CASH',
        snacks: selectedSnacks.map((s) => ({
          concessionId: s.id,
          quantity: s.quantity
        })),
        promoCode: promoCode || null
      };

      const result = await bookingApi.create(payload);

      const confirmedBooking = {
        ...result,
        customerName,
        customerEmail,
        customerPhone,
        movieTitle: selectedMovie?.title || 'Dune: Part Two',
        moviePoster: selectedMovie?.posterUrl,
        theatreName: selectedShowtime?.theatreName || 'Nexura Grand - Colombo City Centre',
        screenName: selectedShowtime?.screenName || 'IMAX Laser Hall 1',
        showStartTime: selectedShowtime?.startTime || '02:00 PM',
        bookedSeats: selectedSeats,
        snacks: selectedSnacks,
        totalPaid: finalTotal,
        discountApplied: discountAmount,
        bookingReference: result?.bookingReference || 'NX-' + Math.floor(100000 + Math.random() * 900000),
        qrCodeHash: result?.qrCodeHash || 'NEXURA-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: new Date().toISOString()
      };

      setLatestBooking(confirmedBooking);
      resetBooking();

      toast.success('Payment authorized & tickets confirmed!');
      navigate(`/booking/ticket/${confirmedBooking.bookingReference}`);
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      
      {/* Top Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to="/concessions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Snacks
          </Link>
          <div className="text-xs text-slate-400">
            Step 3 of 3: <strong className="text-white">Review & Payment</strong>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white font-['Outfit']">
            Checkout & Secure Payment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your movie passes and complete checkout via PayHere Sri Lanka or Card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Contact & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Ticket Contact Information */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                1. Digital Ticket Delivery Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Phone (For SMS Ticket)</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Email (For PDF Ticket & QR Code)</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Promo Code Voucher */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" /> 2. Nexura Promo Code / Voucher
              </h3>
              
              {promoCode ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Coupon <strong>{promoCode}</strong> applied (-LKR {discountAmount.toLocaleString()})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-xs text-rose-400 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Try voucher: NEXURA20"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* 3. Payment Method Selection */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span>3. Select Payment Gateway</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-normal">
                  <Lock className="w-3 h-3" /> 256-bit Encrypted
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* PayHere Sri Lanka */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PAYHERE')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'PAYHERE'
                      ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-400">PayHere</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Local</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Sri Lanka Gateway</p>
                  <p className="text-[10px] text-slate-500 mt-1">Genie, EzCash, VISA, MC</p>
                </button>

                {/* Credit / Debit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Instant</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Credit / Debit Card</p>
                  <p className="text-[10px] text-slate-500 mt-1">Visa, Mastercard, Amex</p>
                </button>

                {/* Box Office Counter */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COUNTER')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'COUNTER'
                      ? 'bg-rose-500/10 border-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Reserve</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">Pay at Box Office</p>
                  <p className="text-[10px] text-slate-500 mt-1">Hold ticket 30 mins prior</p>
                </button>

              </div>

              {/* Simulated Card Fields if CARD chosen */}
              {paymentMethod === 'CARD' && (
                <div className="pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8912"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Column: Final Order Summary */}
          <div className="lg:col-span-1 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 space-y-6 sticky top-28">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Order Breakdown
            </h3>

            {/* Movie */}
            <div className="flex gap-3 text-xs">
              <img
                src={selectedMovie?.posterUrl || FALLBACK_POSTER}
                alt={selectedMovie?.title || 'Selected Movie'}
                onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                className="w-14 h-20 object-cover rounded-xl shrink-0"
              />
              <div className="space-y-1">
                <p className="font-bold text-white text-sm line-clamp-1">{selectedMovie?.title}</p>
                <p className="text-slate-400">{selectedShowtime?.theatreName}</p>
                <p className="text-rose-400 font-semibold">{selectedShowtime?.startTime}</p>
              </div>
            </div>

            {/* Calculation Lines */}
            <div className="space-y-2.5 border-t border-b border-slate-800 py-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Cinema Seats ({selectedSeats.length})</span>
                <span className="font-mono text-white">LKR {seatsSubtotal.toLocaleString()}</span>
              </div>
              
              {selectedSnacks.length > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Concessions & Food</span>
                  <span className="font-mono text-white">LKR {snacksSubtotal.toLocaleString()}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({promoCode})</span>
                  <span className="font-mono">-LKR {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Taxes & Cinema Surcharge</span>
                <span>Included</span>
              </div>
            </div>

            {/* Final Total */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Total Amount</span>
                <span className="text-3xl font-black text-white font-['Outfit']">
                  LKR {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              onClick={handleCompletePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-xl shadow-rose-600/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Confirm Booking</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              By confirming, you agree to Nexura Cinemas terms. Digital QR passes will be emailed and accessible on your account.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
