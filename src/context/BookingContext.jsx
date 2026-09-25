import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { seatHoldApi, promoApi, bookingApi } from '../services/api';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSnacks, setSelectedSnacks] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(null);
  const [latestBooking, setLatestBooking] = useState(null);

  // 10-Minute Hold Timer
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(600);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isHolding && holdSecondsLeft > 0) {
      interval = setInterval(() => {
        setHoldSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsHolding(false);
            setSelectedSeats([]);
            toast.error('Seat hold expired (10 minutes). Seats have been released.');
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (holdSecondsLeft === 0) {
      setIsHolding(false);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdSecondsLeft]);

  // Toggle seat selection
  const toggleSeat = async (seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      // Release
      const updated = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(updated);
      if (updated.length === 0) {
        setIsHolding(false);
        setHoldSecondsLeft(600);
      }
      // Notify backend to release hold
      seatHoldApi.releaseSeat({
        seatId: seat.id,
        showTimeId: selectedShowtime?.id || seat.showTimeId,
        rowLetter: seat.rowLetter,
        seatNumber: seat.seatNumber
      });
    } else {
      // Check max limit (8 seats per transaction)
      if (selectedSeats.length >= 8) {
        toast.error('Maximum 8 seats can be selected per transaction.');
        return;
      }

      // Optimistically hold
      const updated = [...selectedSeats, seat];
      setSelectedSeats(updated);
      setIsHolding(true);

      // Call backend to lock seat
      seatHoldApi.holdSeat({
        seatId: seat.id,
        showTimeId: selectedShowtime?.id || seat.showTimeId,
        rowLetter: seat.rowLetter,
        seatNumber: seat.seatNumber
      });
    }
  };

  // Snack quantity handler
  const updateSnackQuantity = (snack, delta) => {
    setSelectedSnacks((prev) => {
      const existing = prev.find((item) => item.id === snack.id);
      if (!existing && delta > 0) {
        return [...prev, { ...snack, quantity: delta }];
      }
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((item) => item.id !== snack.id);
        }
        return prev.map((item) =>
          item.id === snack.id ? { ...item, quantity: newQty } : item
        );
      }
      return prev;
    });
  };

  // Calculate Subtotals
  const seatsSubtotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const snacksSubtotal = selectedSnacks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = seatsSubtotal + snacksSubtotal;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Apply Promo
  const applyPromo = async (code) => {
    if (!code.trim()) {
      toast.error('Please enter a coupon code.');
      return;
    }
    const result = await promoApi.validate({ code, totalAmount: subtotal });
    if (result && result.valid) {
      setPromoCode(code.toUpperCase());
      setDiscountAmount(result.discountAmount);
      setPromoApplied(result);
      toast.success(result.message || 'Promo applied successfully!');
    } else {
      setDiscountAmount(0);
      setPromoApplied(null);
      toast.error(result?.message || 'Invalid or expired coupon code.');
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setDiscountAmount(0);
    setPromoApplied(null);
    toast('Coupon removed', { icon: 'ℹ️' });
  };

  const resetBooking = () => {
    setSelectedSeats([]);
    setSelectedSnacks([]);
    setPromoCode('');
    setDiscountAmount(0);
    setPromoApplied(null);
    setIsHolding(false);
    setHoldSecondsLeft(600);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedShowtime,
        setSelectedShowtime,
        selectedSeats,
        setSelectedSeats,
        toggleSeat,
        selectedSnacks,
        updateSnackQuantity,
        promoCode,
        discountAmount,
        promoApplied,
        applyPromo,
        removePromo,
        seatsSubtotal,
        snacksSubtotal,
        subtotal,
        finalTotal,
        resetBooking,
        holdSecondsLeft,
        formattedHoldTimer: formatTimer(holdSecondsLeft),
        isHolding,
        latestBooking,
        setLatestBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
