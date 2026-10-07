import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { seatHoldApi, promoApi } from '../services/api';
import { Movie, ShowTime, Seat, Concession, SelectedSnack, Booking } from '../types';

interface BookingContextType {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedShowtime: ShowTime | null;
  setSelectedShowtime: (showtime: ShowTime | null) => void;
  selectedSeats: Seat[];
  setSelectedSeats: (seats: Seat[]) => void;
  toggleSeat: (seat: Seat) => void;
  selectedSnacks: SelectedSnack[];
  updateSnackQuantity: (snack: Concession, delta: number) => void;
  promoCode: string;
  discountAmount: number;
  promoApplied: any;
  applyPromo: (code: string) => Promise<void>;
  removePromo: () => void;
  seatsSubtotal: number;
  snacksSubtotal: number;
  subtotal: number;
  finalTotal: number;
  resetBooking: () => void;
  holdSecondsLeft: number;
  formattedHoldTimer: string;
  isHolding: boolean;
  latestBooking: Booking | null;
  setLatestBooking: (booking: Booking | null) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<ShowTime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedSnacks, setSelectedSnacks] = useState<SelectedSnack[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);

  // 10-Minute Hold Timer
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(600);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let interval: any = null;
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
  const toggleSeat = (seat: Seat) => {
    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      // Release
      const updated = selectedSeats.filter((s) => s.id !== seat.id);
      setSelectedSeats(updated);
      if (updated.length === 0) {
        setIsHolding(false);
        setHoldSecondsLeft(600);
      }
      seatHoldApi.releaseSeat({
        seatId: seat.id,
        showTimeId: selectedShowtime?.id || seat.showTimeId,
        rowLetter: seat.rowLetter,
        seatNumber: seat.seatNumber
      });
    } else {
      // Limit to 8 seats
      if (selectedSeats.length >= 8) {
        toast.error('Maximum 8 seats can be selected per transaction.');
        return;
      }

      const updated = [...selectedSeats, seat];
      setSelectedSeats(updated);
      setIsHolding(true);

      seatHoldApi.holdSeat({
        seatId: seat.id,
        showTimeId: selectedShowtime?.id || seat.showTimeId,
        rowLetter: seat.rowLetter,
        seatNumber: seat.seatNumber
      });
    }
  };

  // Snack quantity handler
  const updateSnackQuantity = (snack: Concession, delta: number) => {
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

  // Subtotals
  const seatsSubtotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const snacksSubtotal = selectedSnacks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotal = seatsSubtotal + snacksSubtotal;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Apply Promo
  const applyPromo = async (code: string) => {
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

  const formatTimer = (seconds: number) => {
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
