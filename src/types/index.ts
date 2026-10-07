// TypeScript Definitions for Nexura Cinemas

export type Role = 'CUSTOMER' | 'TICKET_USHER' | 'BOX_OFFICE_STAFF' | 'CINEMA_MANAGER' | 'SUPER_ADMIN';

export type MovieLanguage = 'ENGLISH' | 'SINHALA' | 'TAMIL' | 'HINDI';
export type AgeRating = 'GENERAL' | 'PG_13' | 'NC_15' | 'R_18' | 'ADULT';
export type MovieExperience = 'IMAX_3D' | 'DOLBY_ATMOS' | 'VIP_LOUNGE' | 'SCREEN_X' | 'STANDARD_2D';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  loyaltyPoints?: number;
  token?: string;
}

export interface Movie {
  id: number;
  title: string;
  language: string;
  ageRating: string;
  durationMins?: number;
  genre?: string;
  rating?: number;
  releaseDate?: string;
  status?: string;
  posterUrl: string;
  trailerUrl?: string;
  bannerUrl?: string;
  synopsis?: string;
  cast?: string;
  director?: string;
  experiences?: string[];
}

export interface Theatre {
  id: number;
  name: string;
  city: string;
  location?: string;
  address?: string;
  contactNumber?: string;
  screens?: number;
  status?: string;
}

export interface Seat {
  id: number;
  seatId?: number;
  showTimeId?: number;
  rowLetter: string;
  seatNumber: number;
  seatType: 'ODC' | 'BALCONY' | 'COUPLE_SEAT' | 'VIP_RECLINER' | string;
  seatStatus: 'AVAILABLE' | 'HELD' | 'BOOKED' | string;
  price: number;
}

export interface ShowTime {
  id: number;
  movieId: number;
  theatreId: number;
  theatreName?: string;
  screenId?: number;
  screenName?: string;
  experience?: string;
  date?: string;
  startTime: string;
  endTime?: string;
  odcPrice: number;
  balconyPrice: number;
  couplePrice?: number;
  vipPrice?: number;
  movieTitle?: string;
  status?: string;
}

export interface Concession {
  id: number;
  name: string;
  category: 'POPCORN' | 'SNACKS' | 'BEVERAGE' | 'COMBO' | 'DESSERT' | string;
  price: number;
  calories?: number;
  imageUrl: string;
  description?: string;
  status?: string;
}

export interface SelectedSnack extends Concession {
  quantity: number;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | string;
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  status?: string;
}

export interface Booking {
  id: number;
  bookingReference: string;
  userId?: number;
  customerName?: string;
  userEmail?: string;
  customerEmail?: string;
  customerPhone?: string;
  showTimeId?: number;
  movieTitle: string;
  moviePoster?: string;
  theatreName: string;
  screenName: string;
  showStartTime: string;
  totalAmount?: number;
  totalPaid?: number;
  discountApplied?: number;
  bookingStatus: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | string;
  paymentMethod?: string;
  paymentStatus?: string;
  qrCodeHash: string;
  createdAt?: string;
  seats?: string;
  bookedSeats?: {
    id?: number;
    seatId?: number;
    showTimeId?: number;
    rowLetter: string;
    seatNumber: number;
    seatType: string;
    seatStatus?: string;
    price?: number;
    [key: string]: any;
  }[];
  snacks?: {
    id?: number;
    name?: string;
    concessionId?: number;
    quantity: number;
  }[];
}

export interface WatchlistItem {
  id: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  movieGenre: string;
  durationMinutes?: number;
  rating?: number;
  ageRating?: string;
  addedAt?: string;
}

export interface MovieReview {
  id?: number;
  movieId: number;
  movieTitle?: string;
  userId?: number;
  userFullName?: string;
  rating: number;
  reviewText: string;
  createdAt?: string;
}

export interface ReviewSummary {
  movieId: number;
  totalReviews: number;
  averageRating: number;
}

export interface RewardItem {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  voucherCode: string;
  iconName?: string;
}

export interface LoyaltyProfile {
  userId: number;
  userFullName: string;
  points: number;
  currentTier: 'SILVER' | 'GOLD' | 'PLATINUM' | string;
  discountPercentage: number;
  nextTierPoints: number;
  progressPercentage: number;
  totalBookingsCount: number;
  availableRewards: RewardItem[];
  tierBenefits: string[];
}


