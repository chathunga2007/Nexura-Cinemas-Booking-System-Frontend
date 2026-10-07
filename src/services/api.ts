import axios from 'axios';
import { FALLBACK_POSTER, FALLBACK_CONCESSION } from '../utils/imageFallback';
import { Movie, ShowTime, Concession, Coupon, Booking, Theatre } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexura_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Movies
export let MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Interstellar',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 169,
    genre: 'Sci-Fi / Adventure / Drama',
    rating: 8.7,
    releaseDate: '2024-03-01',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    director: 'Christopher Nolan',
    experiences: ['IMAX 3D', 'Dolby Atmos', 'VIP Recliner']
  },
  {
    id: 2,
    title: 'Avatar: The Way of Water',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 192,
    genre: 'Sci-Fi / Action / Fantasy',
    rating: 7.6,
    releaseDate: '2024-02-15',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    bannerUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    cast: 'Sam Worthington, Zoe Saldana, Sigourney Weaver',
    director: 'James Cameron',
    experiences: ['IMAX 3D', 'Dolby Cinema', 'VIP Lounge']
  },
  {
    id: 3,
    title: 'Dune: Part Two',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 166,
    genre: 'Sci-Fi / Adventure / Action',
    rating: 8.9,
    releaseDate: '2024-03-01',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    bannerUrl: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.',
    cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler',
    director: 'Denis Villeneuve',
    experiences: ['IMAX 3D', 'Dolby Atmos', 'VIP Recliner']
  },
  {
    id: 4,
    title: 'Gladiator II',
    language: 'ENGLISH',
    ageRating: 'R_18',
    durationMins: 148,
    genre: 'Action / Adventure / Epic',
    rating: 8.4,
    releaseDate: '2024-11-22',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    bannerUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the emperors of Rome conquer his home.',
    cast: 'Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen',
    director: 'Ridley Scott',
    experiences: ['IMAX 3D', 'Dolby Atmos', '4DX']
  },
  {
    id: 5,
    title: 'Spider-Man: No Way Home',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 148,
    genre: 'Action / Adventure / Sci-Fi',
    rating: 8.2,
    releaseDate: '2024-01-10',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
    bannerUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
    cast: 'Tom Holland, Zendaya, Benedict Cumberbatch',
    director: 'Jon Watts',
    experiences: ['IMAX 3D', 'Dolby Atmos']
  },
  {
    id: 6,
    title: 'Siddhartha Gautama: Enlightenment',
    language: 'SINHALA',
    ageRating: 'GENERAL',
    durationMins: 145,
    genre: 'Historical / Spiritual / Drama',
    rating: 9.0,
    releaseDate: '2024-05-20',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'An epic cinematic journey into the life, renunciation, and enlightenment of the Buddha.',
    cast: 'Gagan Malik, Anchal Singh, Gautam Gulati',
    director: 'Samudra Wijesekara',
    experiences: ['Dolby Atmos', 'VIP Recliner']
  }
];

export let MOCK_THEATRES: Theatre[] = [
  { id: 1, name: 'Nexura Cinemas - Colombo City Centre', city: 'Colombo', location: '137 Sir James Pieris Mawatha, Colombo 02', address: '137 Sir James Pieris Mawatha', screens: 5 },
  { id: 2, name: 'Nexura Cinemas - Kandy City Centre', city: 'Kandy', location: '05 Dalada Veediya, Kandy', address: '05 Dalada Veediya', screens: 4 },
  { id: 3, name: 'Nexura Cinemas - Galle Fort', city: 'Galle', location: '42 Church Street, Galle Fort', address: '42 Church Street', screens: 3 },
  { id: 4, name: 'Nexura Cinemas - Negombo Seaside', city: 'Negombo', location: '18 Lewis Place, Negombo', address: '18 Lewis Place', screens: 2 }
];

export let MOCK_CONCESSIONS: Concession[] = [
  { id: 1, name: 'Caramel Crunch Popcorn (Large)', category: 'POPCORN', price: 1200, calories: 550, imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80', description: 'Freshly popped warm popcorn drizzled with authentic butterscotch caramel glaze.' },
  { id: 2, name: 'Classic Butter Popcorn (Medium)', category: 'POPCORN', price: 850, calories: 380, imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80', description: 'Classic cinema popcorn popped with gourmet golden coconut oil and sea salt.' },
  { id: 3, name: 'Loaded Mexican Nachos & Cheese', category: 'SNACKS', price: 1400, calories: 680, imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80', description: 'Crispy corn tortilla chips served with spicy salsa dip and molten Monterey Jack cheese sauce.' },
  { id: 4, name: 'Nexura Blockbuster Duo Combo', category: 'COMBO', price: 2400, calories: 1200, imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=500&q=80', description: '1x Large Caramel Popcorn + 2x Large Soft Drinks (Save 20%)' },
  { id: 5, name: 'Chilled Fountain Coca-Cola (500ml)', category: 'BEVERAGE', price: 450, calories: 240, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80', description: 'Ice-cold bubbly Coca-Cola with fresh lemon slice.' },
  { id: 6, name: 'Belgium Dark Chocolate Ice Cream', category: 'DESSERT', price: 950, calories: 320, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80', description: 'Rich artisanal 70% cocoa dark chocolate gelato.' }
];

export let MOCK_COUPONS: Coupon[] = [
  { id: 1, code: 'WELCOME20', discountType: 'PERCENTAGE', discountValue: 20, minSpend: 1000, maxDiscount: 800, status: 'ACTIVE' },
  { id: 2, code: 'NEXURA10', discountType: 'PERCENTAGE', discountValue: 10, minSpend: 800, maxDiscount: 500, status: 'ACTIVE' },
  { id: 3, code: 'VIPPASS', discountType: 'FIXED_AMOUNT', discountValue: 500, minSpend: 2500, maxDiscount: 500, status: 'ACTIVE' }
];

export let MOCK_SHOWTIMES: ShowTime[] = [
  {
    id: 1,
    movieId: 1,
    theatreId: 1,
    theatreName: 'Nexura Cinemas - Colombo City Centre',
    screenId: 1,
    screenName: 'IMAX Laser Hall 1',
    experience: 'IMAX_3D',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:30 AM',
    endTime: '01:19 PM',
    odcPrice: 1200,
    balconyPrice: 1800,
    couplePrice: 3500,
    vipPrice: 2500
  },
  {
    id: 2,
    movieId: 1,
    theatreId: 1,
    theatreName: 'Nexura Cinemas - Colombo City Centre',
    screenId: 2,
    screenName: 'Dolby Atmos Screen 2',
    experience: 'DOLBY_ATMOS',
    date: new Date().toISOString().split('T')[0],
    startTime: '02:15 PM',
    endTime: '05:04 PM',
    odcPrice: 1000,
    balconyPrice: 1500,
    couplePrice: 3000,
    vipPrice: 2200
  },
  {
    id: 3,
    movieId: 2,
    theatreId: 2,
    theatreName: 'Nexura Cinemas - Kandy City Centre',
    screenId: 1,
    screenName: 'IMAX Laser Hall 1',
    experience: 'IMAX_3D',
    date: new Date().toISOString().split('T')[0],
    startTime: '06:00 PM',
    endTime: '09:12 PM',
    odcPrice: 1200,
    balconyPrice: 1800,
    couplePrice: 3500,
    vipPrice: 2500
  },
  {
    id: 4,
    movieId: 3,
    theatreId: 1,
    theatreName: 'Nexura Cinemas - Colombo City Centre',
    screenId: 3,
    screenName: 'VIP Recliner Suite',
    experience: 'VIP_LOUNGE',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:30 PM',
    endTime: '10:16 PM',
    odcPrice: 1500,
    balconyPrice: 2200,
    couplePrice: 4500,
    vipPrice: 3200
  }
];

export let MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    bookingReference: 'NX-892143',
    customerName: 'Kasun Perera',
    userEmail: 'kasun@gmail.com',
    movieTitle: 'Interstellar',
    theatreName: 'Nexura Cinemas - Colombo City Centre',
    screenName: 'IMAX Laser Hall 1',
    showStartTime: 'Today, 02:00 PM',
    totalAmount: 4400,
    bookingStatus: 'CONFIRMED',
    qrCodeHash: 'NEXURA-PASS-NX-892143',
    seats: 'C5, C6',
    bookedSeats: [
      { rowLetter: 'C', seatNumber: 5, seatType: 'BALCONY', price: 2200 },
      { rowLetter: 'C', seatNumber: 6, seatType: 'BALCONY', price: 2200 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    bookingReference: 'NX-651239',
    customerName: 'Anuki De Silva',
    userEmail: 'anuki@gmail.com',
    movieTitle: 'Avatar: The Way of Water',
    theatreName: 'Nexura Cinemas - Kandy City Centre',
    screenName: 'VIP Recliner Suite',
    showStartTime: 'Yesterday, 07:15 PM',
    totalAmount: 6400,
    bookingStatus: 'CHECKED_IN',
    qrCodeHash: 'NEXURA-PASS-NX-651239',
    seats: 'A1, A2',
    bookedSeats: [
      { rowLetter: 'A', seatNumber: 1, seatType: 'VIP_RECLINER', price: 3200 },
      { rowLetter: 'A', seatNumber: 2, seatType: 'VIP_RECLINER', price: 3200 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function generateMockSeatLayout(showTimeId: number | string = 1) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const layout = [];
  let id = 1;

  rows.forEach((rowLetter, rIndex) => {
    let seatType = 'ODC';
    let price = 1200;

    if (rowLetter === 'A') {
      seatType = 'VIP_RECLINER';
      price = 2500;
    } else if (rowLetter === 'B') {
      seatType = 'COUPLE_SEAT';
      price = 3500;
    } else if (['C', 'D'].includes(rowLetter)) {
      seatType = 'BALCONY';
      price = 1800;
    }

    const seatsInRow = seatType === 'COUPLE_SEAT' ? 6 : 10;

    for (let seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
      const isBooked = (rIndex * 11 + seatNumber) % 5 === 0;
      const isHeld = seatNumber === 4 && rIndex === 2;

      layout.push({
        id: id++,
        seatId: id,
        showTimeId: Number(showTimeId),
        rowLetter,
        seatNumber,
        seatType,
        seatStatus: isBooked ? 'BOOKED' : isHeld ? 'HELD' : 'AVAILABLE',
        price
      });
    }
  });

  return layout;
}

// ----------------- API Methods -----------------

export const movieApi = {
  getAll: async (): Promise<Movie[]> => {
    try {
      const res = await apiClient.get('/movie/getAll');
      if (res.data?.body?.length > 0) {
        return res.data.body.map((m: any) => ({
          ...m,
          posterUrl: m.posterUrl || FALLBACK_POSTER,
          bannerUrl: m.bannerUrl || m.posterUrl || FALLBACK_POSTER,
          experiences: m.experiences || ['IMAX 3D', 'Dolby Atmos']
        }));
      }
      return MOCK_MOVIES;
    } catch {
      return MOCK_MOVIES;
    }
  },
  getById: async (id: number | string): Promise<Movie> => {
    try {
      const res = await apiClient.get(`/movie/get/${id}`);
      if (res.data?.body) {
        const m = res.data.body;
        return {
          ...m,
          posterUrl: m.posterUrl || FALLBACK_POSTER,
          bannerUrl: m.bannerUrl || m.posterUrl || FALLBACK_POSTER,
          experiences: m.experiences || ['IMAX 3D', 'Dolby Atmos']
        };
      }
      return MOCK_MOVIES.find(m => m.id === Number(id)) || MOCK_MOVIES[0];
    } catch {
      return MOCK_MOVIES.find(m => m.id === Number(id)) || MOCK_MOVIES[0];
    }
  },
  search: async (title: string): Promise<Movie[]> => {
    try {
      const res = await apiClient.get(`/movie/search?title=${encodeURIComponent(title)}`);
      return res.data?.body || [];
    } catch {
      return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(title.toLowerCase()));
    }
  },
  save: async (movieDto: Partial<Movie>): Promise<Movie> => {
    try {
      const res = await apiClient.post('/movie/save', movieDto);
      const saved = res.data?.body || { ...movieDto, id: Date.now() };
      MOCK_MOVIES = [saved, ...MOCK_MOVIES];
      return saved;
    } catch {
      const saved = { ...movieDto, id: Date.now(), rating: 8.5 } as Movie;
      MOCK_MOVIES = [saved, ...MOCK_MOVIES];
      return saved;
    }
  },
  update: async (id: number | string, movieDto: Partial<Movie>): Promise<Movie> => {
    try {
      const res = await apiClient.put(`/movie/update/${id}`, movieDto);
      const updated = res.data?.body || { ...movieDto, id: Number(id) };
      MOCK_MOVIES = MOCK_MOVIES.map(m => m.id === Number(id) ? { ...m, ...updated } : m);
      return updated;
    } catch {
      MOCK_MOVIES = MOCK_MOVIES.map(m => m.id === Number(id) ? { ...m, ...movieDto } : m);
      return { ...movieDto, id: Number(id) } as Movie;
    }
  },
  delete: async (id: number | string): Promise<boolean> => {
    try {
      await apiClient.delete(`/movie/delete/${id}`);
      MOCK_MOVIES = MOCK_MOVIES.filter(m => m.id !== Number(id));
      return true;
    } catch {
      MOCK_MOVIES = MOCK_MOVIES.filter(m => m.id !== Number(id));
      return true;
    }
  }
};

export const showTimeApi = {
  getAll: async (): Promise<ShowTime[]> => {
    try {
      const res = await apiClient.get('/showtime/search');
      if (res.data?.body?.length > 0) return res.data.body;
      return MOCK_SHOWTIMES;
    } catch {
      return MOCK_SHOWTIMES;
    }
  },
  getByMovie: async (movieId: number | string): Promise<ShowTime[]> => {
    try {
      const res = await apiClient.get(`/showtime/getByMovie/${movieId}`);
      if (res.data?.body?.length > 0) {
        return res.data.body.map((st: any) => ({
          ...st,
          startTime: st.startTime ? (typeof st.startTime === 'string' && st.startTime.includes('T') ? new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : st.startTime) : '10:30 AM',
          endTime: st.endTime ? (typeof st.endTime === 'string' && st.endTime.includes('T') ? new Date(st.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : st.endTime) : '01:20 PM',
          theatreName: st.theatreName || 'Nexura Cinemas - Colombo City Centre',
          screenName: st.screenName || (st.screenId === 1 ? 'IMAX Laser Hall 1' : 'Dolby Atmos Screen 2'),
          odcPrice: st.odcPrice || 1200,
          balconyPrice: st.balconyPrice || 1800,
          couplePrice: st.coupleSeatPrice || st.couplePrice || 3500,
          vipPrice: st.vipReclinerPrice || st.vipPrice || 2500
        }));
      }
      return MOCK_SHOWTIMES.filter(s => s.movieId === Number(movieId));
    } catch {
      return MOCK_SHOWTIMES.filter(s => s.movieId === Number(movieId));
    }
  },
  getLayout: async (showTimeId: number | string) => {
    try {
      const res = await apiClient.get(`/showtime/getLayout/${showTimeId}`);
      if (res.data?.body?.length > 0) return res.data.body;
      return generateMockSeatLayout(showTimeId);
    } catch {
      return generateMockSeatLayout(showTimeId);
    }
  },
  create: async (dto: Partial<ShowTime>): Promise<ShowTime> => {
    try {
      const res = await apiClient.post('/showtime/create', dto);
      const created = res.data?.body || { ...dto, id: Date.now() };
      MOCK_SHOWTIMES = [created, ...MOCK_SHOWTIMES];
      return created;
    } catch {
      const created = { ...dto, id: Date.now() } as ShowTime;
      MOCK_SHOWTIMES = [created, ...MOCK_SHOWTIMES];
      return created;
    }
  },
  update: async (id: number | string, dto: Partial<ShowTime>): Promise<ShowTime> => {
    try {
      const res = await apiClient.put(`/showtime/update/${id}`, dto);
      const updated = res.data?.body || { ...dto, id: Number(id) };
      MOCK_SHOWTIMES = MOCK_SHOWTIMES.map(s => s.id === Number(id) ? { ...s, ...updated } : s);
      return updated;
    } catch {
      MOCK_SHOWTIMES = MOCK_SHOWTIMES.map(s => s.id === Number(id) ? { ...s, ...dto } : s);
      return { ...dto, id: Number(id) } as ShowTime;
    }
  },
  delete: async (id: number | string): Promise<boolean> => {
    try {
      await apiClient.delete(`/showtime/delete/${id}`);
      MOCK_SHOWTIMES = MOCK_SHOWTIMES.filter(s => s.id !== Number(id));
      return true;
    } catch {
      MOCK_SHOWTIMES = MOCK_SHOWTIMES.filter(s => s.id !== Number(id));
      return true;
    }
  }
};

export const concessionApi = {
  getAll: async (): Promise<Concession[]> => {
    try {
      const res = await apiClient.get('/concession/getAll');
      if (res.data?.body?.length > 0) {
        return res.data.body.map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl || FALLBACK_CONCESSION
        }));
      }
      return MOCK_CONCESSIONS;
    } catch {
      return MOCK_CONCESSIONS;
    }
  },
  save: async (dto: Partial<Concession>): Promise<Concession> => {
    try {
      const res = await apiClient.post('/concession/save', dto);
      const saved = res.data?.body || { ...dto, id: Date.now() };
      MOCK_CONCESSIONS = [saved, ...MOCK_CONCESSIONS];
      return saved;
    } catch {
      const saved = { ...dto, id: Date.now() } as Concession;
      MOCK_CONCESSIONS = [saved, ...MOCK_CONCESSIONS];
      return saved;
    }
  },
  update: async (id: number | string, dto: Partial<Concession>): Promise<Concession> => {
    try {
      const res = await apiClient.put(`/concession/update/${id}`, dto);
      const updated = res.data?.body || { ...dto, id: Number(id) };
      MOCK_CONCESSIONS = MOCK_CONCESSIONS.map(c => c.id === Number(id) ? { ...c, ...updated } : c);
      return updated;
    } catch {
      MOCK_CONCESSIONS = MOCK_CONCESSIONS.map(c => c.id === Number(id) ? { ...c, ...dto } : c);
      return { ...dto, id: Number(id) } as Concession;
    }
  },
  delete: async (id: number | string): Promise<boolean> => {
    try {
      await apiClient.delete(`/concession/delete/${id}`);
      MOCK_CONCESSIONS = MOCK_CONCESSIONS.filter(c => c.id !== Number(id));
      return true;
    } catch {
      MOCK_CONCESSIONS = MOCK_CONCESSIONS.filter(c => c.id !== Number(id));
      return true;
    }
  }
};

export const promoApi = {
  validate: async ({ code, totalAmount }: { code: string; totalAmount: number }) => {
    try {
      const res = await apiClient.post('/promo/validate', { code, totalAmount });
      return res.data?.body;
    } catch {
      const c = code?.toUpperCase();
      if (c === 'WELCOME20' || c === 'NEXURA20') {
        const discount = totalAmount * 0.20;
        return {
          valid: true,
          discountAmount: discount,
          finalAmount: totalAmount - discount,
          message: 'Promo code applied: 20% discount!'
        };
      }
      if (c === 'NEXURA10') {
        const discount = totalAmount * 0.10;
        return {
          valid: true,
          discountAmount: discount,
          finalAmount: totalAmount - discount,
          message: 'Promo code applied: 10% discount!'
        };
      }
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        message: 'Invalid promo code. Try WELCOME20 or NEXURA10'
      };
    }
  },
  getAll: async (): Promise<Coupon[]> => {
    try {
      const res = await apiClient.get('/promo/getAll');
      if (res.data?.body?.length > 0) return res.data.body;
      return MOCK_COUPONS;
    } catch {
      return MOCK_COUPONS;
    }
  },
  save: async (couponDto: Partial<Coupon>): Promise<Coupon> => {
    try {
      const res = await apiClient.post('/promo/save', couponDto);
      const saved = res.data?.body || { ...couponDto, id: Date.now() };
      MOCK_COUPONS = [saved, ...MOCK_COUPONS];
      return saved;
    } catch {
      const saved = { ...couponDto, id: Date.now() } as Coupon;
      MOCK_COUPONS = [saved, ...MOCK_COUPONS];
      return saved;
    }
  },
  delete: async (id: number | string): Promise<boolean> => {
    try {
      await apiClient.delete(`/promo/delete/${id}`);
      MOCK_COUPONS = MOCK_COUPONS.filter(c => c.id !== Number(id));
      return true;
    } catch {
      MOCK_COUPONS = MOCK_COUPONS.filter(c => c.id !== Number(id));
      return true;
    }
  }
};

export const theatreApi = {
  getAll: async (): Promise<Theatre[]> => {
    try {
      const res = await apiClient.get('/theatre/getAll');
      if (res.data?.body && Array.isArray(res.data.body) && res.data.body.length > 0) {
        return res.data.body.map((t: any) => ({
          ...t,
          location: t.address || t.location || `${t.city}, Sri Lanka`,
          screens: t.screens || 3
        }));
      }
    } catch {
      // Backend fallback
    }
    return MOCK_THEATRES;
  },
  getById: async (id: number | string): Promise<Theatre | null> => {
    try {
      const res = await apiClient.get(`/theatre/get/${id}`);
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    return MOCK_THEATRES.find(t => t.id === Number(id)) || null;
  },
  getByCity: async (city: string): Promise<Theatre[]> => {
    try {
      const res = await apiClient.get(`/theatre/getByCity/${encodeURIComponent(city)}`);
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    return MOCK_THEATRES.filter(t => t.city.toLowerCase() === city.toLowerCase());
  },
  save: async (theatreDto: Partial<Theatre>) => {
    try {
      const res = await apiClient.post('/theatre/save', theatreDto);
      const saved = res.data?.body || { ...theatreDto, id: Date.now() };
      MOCK_THEATRES = [saved, ...MOCK_THEATRES];
      return saved;
    } catch {
      const saved = { ...theatreDto, id: Date.now(), screens: theatreDto.screens || 3 } as Theatre;
      MOCK_THEATRES = [saved, ...MOCK_THEATRES];
      return saved;
    }
  },
  update: async (id: number | string, theatreDto: Partial<Theatre>) => {
    try {
      const res = await apiClient.put(`/theatre/update/${id}`, theatreDto);
      const updated = res.data?.body || { ...theatreDto, id: Number(id) };
      MOCK_THEATRES = MOCK_THEATRES.map(t => t.id === Number(id) ? { ...t, ...updated } : t);
      return updated;
    } catch {
      MOCK_THEATRES = MOCK_THEATRES.map(t => t.id === Number(id) ? { ...t, ...theatreDto } : t);
      return { ...theatreDto, id: Number(id) };
    }
  },
  delete: async (id: number | string) => {
    try {
      await apiClient.delete(`/theatre/delete/${id}`);
    } catch {
      // Fallback
    }
    MOCK_THEATRES = MOCK_THEATRES.filter(t => t.id !== Number(id));
    return true;
  }
};

export const screenApi = {
  getByTheatre: async (theatreId: number | string) => {
    try {
      const res = await apiClient.get(`/screen/getByTheatre/${theatreId}`);
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    return [
      { id: 1, theatreId: Number(theatreId), screenName: 'IMAX Laser Hall 1', totalSeats: 120, experience: 'IMAX_3D' },
      { id: 2, theatreId: Number(theatreId), screenName: 'Dolby Atmos Hall 2', totalSeats: 96, experience: 'DOLBY_ATMOS' },
      { id: 3, theatreId: Number(theatreId), screenName: 'VIP Recliner Suite', totalSeats: 48, experience: 'VIP_RECLINER' }
    ];
  },
  save: async (screenDto: any) => {
    try {
      const res = await apiClient.post('/screen/save', screenDto);
      return res.data?.body;
    } catch {
      return { ...screenDto, id: Date.now() };
    }
  },
  update: async (id: number | string, screenDto: any) => {
    try {
      const res = await apiClient.put(`/screen/update/${id}`, screenDto);
      return res.data?.body;
    } catch {
      return { ...screenDto, id: Number(id) };
    }
  },
  delete: async (id: number | string) => {
    try {
      await apiClient.delete(`/screen/delete/${id}`);
    } catch {
      // Fallback
    }
    return true;
  }
};

export const bookingApi = {
  create: async (data: any): Promise<Booking> => {
    try {
      const res = await apiClient.post('/booking/create', data);
      if (res.data?.body) {
        MOCK_BOOKINGS = [res.data.body, ...MOCK_BOOKINGS];
        return res.data.body;
      }
    } catch {
      // Fallback
    }

    const fallbackBooking: Booking = {
      id: Math.floor(Math.random() * 90000) + 10000,
      bookingReference: 'NX-' + Math.floor(100000 + Math.random() * 900000),
      userId: data.userId || 1,
      customerName: 'Cinephile User',
      userEmail: 'user@nexuracinemas.lk',
      showTimeId: data.showTimeId,
      movieTitle: 'Interstellar',
      screenName: 'IMAX Laser Hall 1',
      theatreName: 'Nexura Cinemas - Colombo City Centre',
      showStartTime: '02:00 PM',
      totalAmount: 4800,
      bookingStatus: 'CONFIRMED',
      paymentMethod: data.paymentMethod || 'PAYHERE',
      paymentStatus: 'PAID',
      qrCodeHash: 'NEXURA-PASS-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      bookedSeats: data.seatIds?.map((id: number, index: number) => ({
        seatId: id,
        rowLetter: 'C',
        seatNumber: 10 + index,
        seatType: 'BALCONY',
        price: 1800
      })) || []
    };
    MOCK_BOOKINGS = [fallbackBooking, ...MOCK_BOOKINGS];
    return fallbackBooking;
  },
  getAll: async (): Promise<Booking[]> => {
    try {
      const res = await apiClient.get('/booking/getAll');
      if (res.data?.body?.length > 0) return res.data.body;
      return MOCK_BOOKINGS;
    } catch {
      return MOCK_BOOKINGS;
    }
  },
  getByReference: async (ref: string): Promise<Booking | null> => {
    try {
      const res = await apiClient.get(`/booking/getByReference/${ref}`);
      return res.data?.body;
    } catch {
      return MOCK_BOOKINGS.find(b => b.bookingReference === ref) || null;
    }
  },
  getByUser: async (userId: number | string): Promise<Booking[]> => {
    try {
      const res = await apiClient.get(`/booking/getByUser/${userId}`);
      if (res.data?.body?.length > 0) return res.data.body;
      return MOCK_BOOKINGS;
    } catch {
      return MOCK_BOOKINGS;
    }
  },
  cancel: async (id: number | string): Promise<boolean> => {
    try {
      await apiClient.put(`/booking/cancel/${id}`);
      MOCK_BOOKINGS = MOCK_BOOKINGS.map(b => b.id === Number(id) ? { ...b, bookingStatus: 'CANCELLED' } : b);
      return true;
    } catch {
      MOCK_BOOKINGS = MOCK_BOOKINGS.map(b => b.id === Number(id) ? { ...b, bookingStatus: 'CANCELLED' } : b);
      return true;
    }
  },
  checkIn: async (qrHash: string) => {
    try {
      const res = await apiClient.post(`/booking/checkin?qrCodeHash=${encodeURIComponent(qrHash)}`);
      return res.data;
    } catch {
      const found = MOCK_BOOKINGS.find(b => b.qrCodeHash === qrHash || b.bookingReference === qrHash.replace('NEXURA-PASS-', ''));
      if (found) {
        found.bookingStatus = 'CHECKED_IN';
        return {
          status: 200,
          message: `Ticket Verified! Admitted: ${found.customerName || 'Guest'} (${found.movieTitle || 'Movie'})`
        };
      }
      return {
        status: 200,
        message: 'Ticket verified & guest checked in successfully! (Demo Gate Turnstile Open)'
      };
    }
  }
};

export const seatHoldApi = {
  holdSeat: async (dto: any) => {
    try {
      const res = await apiClient.post('/seat-hold/hold', dto);
      return res.data;
    } catch {
      return { status: 200, message: 'Seat held for checkout' };
    }
  },
  releaseSeat: async (dto: any) => {
    try {
      const res = await apiClient.post('/seat-hold/release', dto);
      return res.data;
    } catch {
      return { status: 200, message: 'Seat released' };
    }
  },
  hold: async (data: { showTimeId: number; seatId: number; userId?: number; seatStatus?: string }) => {
    try {
      const res = await apiClient.post('/seat-hold/hold', { ...data, seatStatus: 'HELD' });
      return res.data?.body ?? true;
    } catch {
      return true;
    }
  },
  release: async (data: { showTimeId: number; seatId: number; userId?: number; seatStatus?: string }) => {
    try {
      const res = await apiClient.post('/seat-hold/release', { ...data, seatStatus: 'AVAILABLE' });
      return res.data?.body ?? true;
    } catch {
      return true;
    }
  }
};

export const aiApi = {
  chatWithAi: async (message: string, history: any[] = []): Promise<string> => {
    try {
      const res = await apiClient.post('/ai/chat', { message, history });
      if (res.data?.body?.reply) return res.data.body.reply;
    } catch {
      // Fallback
    }

    const msg = message.toLowerCase();
    if (msg.includes('interstellar') || msg.includes('avatar') || msg.includes('dune') || msg.includes('movie') || msg.includes('imax')) {
      return "Here are our top recommended blockbusters today:\n• **Interstellar (IMAX 3D)**: Christopher Nolan's space epic in crystal-clear 4K Laser.\n• **Avatar: The Way of Water**: Unrivaled visual brilliance in 3D HFR.\n• **Dune: Part Two**: Ground-shaking spatial sound with 64-channel Dolby Atmos.\n\nWould you like to reserve seats for one of these?";
    }
    if (msg.includes('popcorn') || msg.includes('snack') || msg.includes('food') || msg.includes('combo')) {
      return "Our most popular snacks prepared fresh in-house:\n• **Caramel Crunch Popcorn (Large)** - LKR 1,200\n• **Loaded Mexican Nachos & Molten Cheese** - LKR 1,400\n• **Blockbuster Duo Combo** (Save 20%) - LKR 2,400\n\nYou can pre-order these directly on our Concessions page to skip all queues!";
    }
    if (msg.includes('seat') || msg.includes('vip') || msg.includes('couple')) {
      return "At Nexura Cinemas we offer 3 luxury tiers:\n1. **VIP Recliners**: Full electric recline, plush leather & private spacing.\n2. **Couple Pods**: Cozy double seating perfect for date nights.\n3. **Balcony & ODC**: Elevated premium sightlines and acoustics.\n\nSeats are held for 10 minutes once selected!";
    }
    if (msg.includes('cancel') || msg.includes('refund') || msg.includes('ticket')) {
      return "Tickets can be cancelled up to 2 hours before showtime directly from the **My Bookings** page. Full refund will be credited back immediately!";
    }
    return "Hello! I am your **Nexura AI Cinema Concierge** powered by Groq LLaMA 3.3. How can I help you pick movies, reserve prime IMAX seats, or order snacks today?";
  }
};

export const userApi = {
  login: async (credentials: { email: string; password?: string }) => {
    const res = await apiClient.post('/user/login', credentials);
    return res.data?.body;
  },
  register: async (userData: any) => {
    const payload = {
      ...userData,
      role: 'CUSTOMER'
    };
    const res = await apiClient.post('/user/register', payload);
    return res.data?.body;
  },
  getProfile: () => apiClient.get('/user/me'),
  forgotPassword: (email: string) => apiClient.post('/user/forgot-password', { email }),
  verifyOtp: (email: string, otp: string) => apiClient.post('/user/verify-otp', { email, otp }),
  resetPassword: (email: string, otp: string, newPassword: string) => apiClient.post('/user/reset-password', { email, otp, newPassword }),
};

export const reviewApi = {
  getByMovie: async (movieId: number | string) => {
    try {
      const res = await apiClient.get(`/review/movie/${movieId}`);
      if (res.data?.body && res.data.body.length > 0) return res.data.body;
    } catch {
      // Fallback to sample reviews
    }
    return [
      { id: 1, movieId: Number(movieId), userFullName: 'Kavindu Senarath', rating: 5, reviewText: 'Mindblowing visual effects in IMAX with Laser! Best cinematic sound quality in Sri Lanka.', createdAt: '2025-02-10' },
      { id: 2, movieId: Number(movieId), userFullName: 'Dinithi Perera', rating: 5, reviewText: 'Loved the VIP recliners and caramel popcorn combo! Super comfortable seating.', createdAt: '2025-02-18' },
      { id: 3, movieId: Number(movieId), userFullName: 'Roshan Wickramasinghe', rating: 4.5, reviewText: 'Dolby Atmos sound was spectacular! Highly recommended for cinema enthusiasts.', createdAt: '2025-02-25' }
    ];
  },
  getSummary: async (movieId: number | string) => {
    try {
      const res = await apiClient.get(`/review/summary/${movieId}`);
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    return {
      movieId: Number(movieId),
      totalReviews: 28,
      averageRating: 4.8
    };
  },
  addReview: async (reviewDto: { movieId: number; rating: number; reviewText: string }) => {
    const res = await apiClient.post('/review/add', reviewDto);
    return res.data?.body;
  },
  deleteReview: async (id: number) => {
    const res = await apiClient.delete(`/review/delete/${id}`);
    return res.data?.body;
  }
};

export const watchlistApi = {
  toggle: async (movieId: number): Promise<boolean> => {
    try {
      const res = await apiClient.post(`/watchlist/toggle/${movieId}`);
      return !!res.data?.body;
    } catch {
      const saved = JSON.parse(localStorage.getItem('nexura_watchlist') || '[]');
      const index = saved.indexOf(movieId);
      let added = false;
      if (index > -1) {
        saved.splice(index, 1);
      } else {
        saved.push(movieId);
        added = true;
      }
      localStorage.setItem('nexura_watchlist', JSON.stringify(saved));
      return added;
    }
  },
  getMyList: async () => {
    try {
      const res = await apiClient.get('/watchlist/my-list');
      if (res.data?.body && Array.isArray(res.data.body) && res.data.body.length > 0) {
        return res.data.body;
      }
    } catch {
      // Fallback
    }
    const saved: number[] = JSON.parse(localStorage.getItem('nexura_watchlist') || '[1, 3]');
    return MOCK_MOVIES.filter(m => saved.includes(m.id)).map(m => ({
      id: m.id,
      movieId: m.id,
      movieTitle: m.title,
      moviePoster: m.posterUrl,
      movieGenre: m.genre || 'Action',
      durationMinutes: m.durationMins || 150,
      rating: m.rating || 4.8,
      ageRating: m.ageRating || 'PG_13',
      addedAt: new Date().toISOString()
    }));
  },
  getStatus: async (movieId: number): Promise<boolean> => {
    try {
      const res = await apiClient.get(`/watchlist/status/${movieId}`);
      return !!res.data?.body;
    } catch {
      const saved: number[] = JSON.parse(localStorage.getItem('nexura_watchlist') || '[]');
      return saved.includes(movieId);
    }
  },
  remove: async (movieId: number) => {
    try {
      await apiClient.delete(`/watchlist/remove/${movieId}`);
    } catch {
      const saved: number[] = JSON.parse(localStorage.getItem('nexura_watchlist') || '[]');
      const filtered = saved.filter(id => id !== movieId);
      localStorage.setItem('nexura_watchlist', JSON.stringify(filtered));
    }
  }
};

export const loyaltyApi = {
  getProfile: async (): Promise<any> => {
    try {
      const res = await apiClient.get('/loyalty/profile');
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    const userStr = localStorage.getItem('nexura_user');
    const localUser = userStr ? JSON.parse(userStr) : null;
    const pts = localUser?.loyaltyPoints || 350;
    return {
      userId: localUser?.id || 1,
      userFullName: localUser?.fullName || 'Valued Moviegoer',
      points: pts,
      currentTier: pts >= 1000 ? 'PLATINUM' : pts >= 500 ? 'GOLD' : 'SILVER',
      discountPercentage: pts >= 1000 ? 15.0 : pts >= 500 ? 10.0 : 5.0,
      nextTierPoints: pts >= 1000 ? 1000 : 500,
      progressPercentage: pts >= 1000 ? 100 : Math.round((pts / 500) * 100),
      totalBookingsCount: 4,
      availableRewards: [
        { id: 1, title: 'Free Large Caramel Popcorn', description: 'Freshly popped golden caramel popcorn at any concession counter.', pointsCost: 150, category: 'CONCESSION', voucherCode: 'CINE-POP-150', iconName: 'Popcorn' },
        { id: 2, title: 'LKR 500 Ticket Discount', description: 'Save LKR 500 instantly on your next blockbuster booking.', pointsCost: 300, category: 'DISCOUNT', voucherCode: 'NX-TICKET-500', iconName: 'Ticket' },
        { id: 3, title: 'VIP Recliner Suite Upgrade', description: 'Upgrade any standard ticket to a plush heated leather recliner.', pointsCost: 450, category: 'UPGRADE', voucherCode: 'VIP-UPG-450', iconName: 'Armchair' },
        { id: 4, title: 'Complimentary IMAX 3D Pass', description: 'Experience pure cinematic grandeur on the giant laser screen.', pointsCost: 750, category: 'TICKET', voucherCode: 'IMAX-PASS-750', iconName: 'Tv' }
      ],
      tierBenefits: [
        '5% Off Gourmet Concessions & Beverages',
        'Birthday Surprise Gift Voucher',
        'Earn 10 CinePoints for Every LKR 100 Spent'
      ]
    };
  },
  redeem: async (rewardId: number) => {
    try {
      const res = await apiClient.post(`/loyalty/redeem/${rewardId}`);
      return res.data?.body;
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Insufficient CinePoints for this reward.';
      throw new Error(msg);
    }
  }
};

export const userProfileApi = {
  update: async (id: number, data: { fullName: string; phoneNumber?: string }) => {
    const res = await apiClient.put(`/user/update/${id}`, data);
    return res.data?.body;
  },
  changePassword: async (passwords: { oldPassword: string; newPassword: string }) => {
    const res = await apiClient.post('/user/change-password', passwords);
    return res.data?.body;
  }
};

export const dashboardApi = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/dashboard/stats');
      if (res.data?.body) return res.data.body;
    } catch {
      // Fallback
    }
    return {
      totalRevenue: 3450800,
      totalBookings: MOCK_BOOKINGS.length + 1420,
      activeMovies: MOCK_MOVIES.length,
      averageOccupancyRate: 84.5,
      recentBookings: MOCK_BOOKINGS.slice(0, 5)
    };
  }
};

export default apiClient;
