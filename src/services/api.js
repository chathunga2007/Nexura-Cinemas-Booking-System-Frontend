import axios from 'axios';

// Default base URL uses the Vite proxy '/api', or custom env, or direct backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token to requests if available
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

// Fallback Mock Data for immediate offline/dev testing when backend database is empty or offline
export const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 166,
    genre: 'Sci-Fi / Adventure / Action',
    rating: 8.9,
    releaseDate: '2024-03-01',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.',
    cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler',
    director: 'Denis Villeneuve',
    experiences: ['IMAX 3D', 'Dolby Atmos', 'VIP Recliner']
  },
  {
    id: 2,
    title: 'Oppenheimer: The Director’s Cut',
    language: 'ENGLISH',
    ageRating: 'R_18',
    durationMins: 180,
    genre: 'Biography / Drama / History',
    rating: 9.1,
    releaseDate: '2024-02-15',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb that changed human history forever.',
    cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
    director: 'Christopher Nolan',
    experiences: ['IMAX 70mm', 'Dolby Atmos', 'Executive Lounge']
  },
  {
    id: 3,
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
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after the emperors of Rome conquer his home.',
    cast: 'Paul Mescal, Pedro Pascal, Denzel Washington, Connie Nielsen',
    director: 'Ridley Scott',
    experiences: ['IMAX 3D', 'Dolby Atmos', '4DX']
  },
  {
    id: 4,
    title: 'Avatar: Fire and Ash',
    language: 'ENGLISH',
    ageRating: 'PG_13',
    durationMins: 190,
    genre: 'Sci-Fi / Fantasy / Adventure',
    rating: 9.3,
    releaseDate: '2025-12-19',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    bannerUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'Jake Sully and Neytiri encounter a dangerous new Na’vi clan known as the Ash People on Pandora.',
    cast: 'Sam Worthington, Zoe Saldaña, Sigourney Weaver, Michelle Yeoh',
    director: 'James Cameron',
    experiences: ['IMAX Laser 3D', 'Dolby Cinema', 'VIP Lounge']
  },
  {
    id: 5,
    title: 'Kalki 2898 AD',
    language: 'TAMIL',
    ageRating: 'PG_13',
    durationMins: 181,
    genre: 'Sci-Fi / Mythological / Action',
    rating: 8.7,
    releaseDate: '2024-06-27',
    status: 'ACTIVE',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=y1-w1pUX8Ew',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    synopsis: 'A modern avatar of Vishnu descends to Earth to protect the world from evil forces in a post-apocalyptic future set in Kasi.',
    cast: 'Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone',
    director: 'Nag Ashwin',
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

export const MOCK_THEATRES = [
  { id: 1, name: 'Nexura Grand - Colombo City Centre', city: 'Colombo', location: 'Sir James Pieris Mawatha, Colombo 02', screens: 4 },
  { id: 2, name: 'Nexura Luxe - One Galle Face Mall', city: 'Colombo', location: 'Galle Face Terrace, Colombo 03', screens: 6 },
  { id: 3, name: 'Nexura Royale - Kandy City Centre', city: 'Kandy', location: 'Dalada Veediya, Kandy', screens: 3 },
  { id: 4, name: 'Nexura Waves - Galle Fort Walk', city: 'Galle', location: 'Marine Drive, Galle', screens: 2 }
];

export const MOCK_CONCESSIONS = [
  { id: 1, name: 'Caramel Crunch Popcorn (Large)', category: 'POPCORN', price: 1200, calories: 550, imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80', description: 'Freshly popped warm popcorn drizzled with authentic butterscotch caramel glaze.' },
  { id: 2, name: 'Golden Salted Popcorn (Regular)', category: 'POPCORN', price: 900, calories: 380, imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=500&q=80', description: 'Classic cinema popcorn popped with gourmet golden coconut oil and sea salt.' },
  { id: 3, name: 'Loaded Nachos Supreme & Warm Cheese', category: 'SNACKS', price: 1650, calories: 680, imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=500&q=80', description: 'Crispy corn tortilla chips served with spicy salsa dip and molten Monterey Jack cheese sauce.' },
  { id: 4, name: 'Chilled Fountain Coca-Cola (Large 750ml)', category: 'BEVERAGE', price: 650, calories: 240, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80', description: 'Ice-cold bubbly Coca-Cola with fresh lemon slice.' },
  { id: 5, name: 'Nexura Ultimate Cinema Combo', category: 'COMBO', price: 2800, calories: 1200, imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=500&q=80', description: '1x Large Caramel Popcorn + 1x Nachos Supreme + 2x Large Soft Drinks (Save 20%)' },
  { id: 6, name: 'Belgium Dark Chocolate Ice Cream Tub', category: 'DESSERT', price: 950, calories: 320, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80', description: 'Rich artisanal 70% cocoa dark chocolate gelato.' }
];

export const MOCK_SHOWTIMES = [
  {
    id: 101,
    movieId: 1,
    theatreId: 1,
    theatreName: 'Nexura Grand - Colombo City Centre',
    screenId: 1,
    screenName: 'IMAX Laser Hall 1',
    experience: 'IMAX_3D',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:30 AM',
    endTime: '01:16 PM',
    odcPrice: 1500,
    balconyPrice: 2200,
    couplePrice: 5000,
    vipPrice: 3800
  },
  {
    id: 102,
    movieId: 1,
    theatreId: 1,
    theatreName: 'Nexura Grand - Colombo City Centre',
    screenId: 1,
    screenName: 'IMAX Laser Hall 1',
    experience: 'IMAX_3D',
    date: new Date().toISOString().split('T')[0],
    startTime: '02:00 PM',
    endTime: '04:46 PM',
    odcPrice: 1500,
    balconyPrice: 2200,
    couplePrice: 5000,
    vipPrice: 3800
  },
  {
    id: 103,
    movieId: 1,
    theatreId: 2,
    theatreName: 'Nexura Luxe - One Galle Face Mall',
    screenId: 3,
    screenName: 'Dolby Atmos Screen 2',
    experience: 'DOLBY_ATMOS',
    date: new Date().toISOString().split('T')[0],
    startTime: '06:30 PM',
    endTime: '09:16 PM',
    odcPrice: 1400,
    balconyPrice: 2000,
    couplePrice: 4800,
    vipPrice: 3500
  },
  {
    id: 104,
    movieId: 2,
    theatreId: 1,
    theatreName: 'Nexura Grand - Colombo City Centre',
    screenId: 2,
    screenName: 'VIP Recliner Suite',
    experience: 'VIP_LOUNGE',
    date: new Date().toISOString().split('T')[0],
    startTime: '07:15 PM',
    endTime: '10:15 PM',
    odcPrice: 2000,
    balconyPrice: 2800,
    couplePrice: 6500,
    vipPrice: 4500
  }
];

// Helper to generate dynamic seat layout
export function generateMockSeatLayout(showTimeId = 101) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const layout = [];
  let id = 1;

  rows.forEach((rowLetter, rIndex) => {
    let seatType = 'ODC';
    let price = 1500;

    if (rowLetter === 'A') {
      seatType = 'VIP_RECLINER';
      price = 3800;
    } else if (rowLetter === 'B') {
      seatType = 'COUPLE_SEAT';
      price = 5000;
    } else if (['C', 'D'].includes(rowLetter)) {
      seatType = 'BALCONY';
      price = 2200;
    }

    const seatsInRow = seatType === 'COUPLE_SEAT' ? 6 : 10;

    for (let seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
      // Deterministically mark some seats as booked for realism
      const isBooked = (rIndex * 13 + seatNumber) % 5 === 0 || (rIndex === 3 && seatNumber > 4 && seatNumber < 7);
      const isHeld = seatNumber === 3 && rIndex === 1;

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

// ----------------- API Service Methods -----------------

export const movieApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/movie/getAll');
      if (res.data && res.data.body && res.data.body.length > 0) return res.data.body;
      return MOCK_MOVIES;
    } catch (err) {
      console.warn('API error, using mock movies:', err.message);
      return MOCK_MOVIES;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/movie/get/${id}`);
      if (res.data && res.data.body) return res.data.body;
      return MOCK_MOVIES.find(m => m.id === Number(id)) || MOCK_MOVIES[0];
    } catch (err) {
      return MOCK_MOVIES.find(m => m.id === Number(id)) || MOCK_MOVIES[0];
    }
  },
  search: async (title) => {
    try {
      const res = await apiClient.get(`/movie/search?title=${encodeURIComponent(title)}`);
      return res.data?.body || [];
    } catch (err) {
      return MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(title.toLowerCase()));
    }
  },
  save: (movieDto) => apiClient.post('/movie/save', movieDto),
  update: (id, movieDto) => apiClient.put(`/movie/update/${id}`, movieDto),
  delete: (id) => apiClient.delete(`/movie/delete/${id}`),
};

export const showTimeApi = {
  getByMovie: async (movieId) => {
    try {
      const res = await apiClient.get(`/showtime/getByMovie/${movieId}`);
      if (res.data && res.data.body && res.data.body.length > 0) return res.data.body;
      return MOCK_SHOWTIMES.filter(s => s.movieId === Number(movieId));
    } catch (err) {
      return MOCK_SHOWTIMES.filter(s => s.movieId === Number(movieId));
    }
  },
  getLayout: async (showTimeId) => {
    try {
      const res = await apiClient.get(`/showtime/getLayout/${showTimeId}`);
      if (res.data && res.data.body && res.data.body.length > 0) return res.data.body;
      return generateMockSeatLayout(showTimeId);
    } catch (err) {
      return generateMockSeatLayout(showTimeId);
    }
  },
  getAll: () => apiClient.get('/showtime/search'),
  create: (data) => apiClient.post('/showtime/create', data),
  delete: (id) => apiClient.delete(`/showtime/delete/${id}`)
};

export const seatHoldApi = {
  holdSeat: async (dto) => {
    try {
      const res = await apiClient.post('/seat-hold/hold', dto);
      return res.data;
    } catch (err) {
      // Mock success for offline testing
      return { status: 200, message: 'Seat held for checkout' };
    }
  },
  releaseSeat: async (dto) => {
    try {
      const res = await apiClient.post('/seat-hold/release', dto);
      return res.data;
    } catch (err) {
      return { status: 200, message: 'Seat released' };
    }
  }
};

export const bookingApi = {
  create: async (data) => {
    try {
      const res = await apiClient.post('/booking/create', data);
      return res.data?.body;
    } catch (err) {
      console.warn('Booking API offline, generating local confirmation:', err.message);
      // Return realistic booking response
      return {
        id: Math.floor(Math.random() * 90000) + 10000,
        bookingReference: 'NX-' + Math.floor(100000 + Math.random() * 900000),
        userId: data.userId || 1,
        userFullName: 'Guest Cinephile',
        userEmail: 'guest@nexuracinemas.lk',
        showTimeId: data.showTimeId,
        movieTitle: 'Dune: Part Two',
        screenName: 'IMAX Laser Hall 1',
        showStartTime: new Date().toISOString(),
        totalAmount: 4800,
        bookingStatus: 'CONFIRMED',
        paymentMethod: data.paymentMethod || 'PAYHERE',
        paymentStatus: 'PAID',
        qrCodeHash: 'NEXURA-PASS-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        createdAt: new Date().toISOString(),
        bookedSeats: data.seatIds?.map((id, index) => ({
          seatId: id,
          rowLetter: 'C',
          seatNumber: 10 + index,
          seatType: 'BALCONY',
          price: 2200
        })) || []
      };
    }
  },
  getByReference: async (ref) => {
    try {
      const res = await apiClient.get(`/booking/getByReference/${ref}`);
      return res.data?.body;
    } catch (err) {
      return null;
    }
  },
  getByUser: async (userId) => {
    try {
      const res = await apiClient.get(`/booking/getByUser/${userId}`);
      return res.data?.body || [];
    } catch (err) {
      return [];
    }
  },
  cancel: (id) => apiClient.put(`/booking/cancel/${id}`),
  checkIn: async (qrHash) => {
    try {
      const res = await apiClient.post(`/booking/checkin?qrCodeHash=${encodeURIComponent(qrHash)}`);
      return res.data;
    } catch (err) {
      return { status: 200, message: 'Ticket verified & customer checked-in successfully (Demo)' };
    }
  }
};

export const concessionApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/concession/getAll');
      if (res.data?.body?.length > 0) return res.data.body;
      return MOCK_CONCESSIONS;
    } catch (err) {
      return MOCK_CONCESSIONS;
    }
  }
};

export const promoApi = {
  validate: async ({ code, totalAmount }) => {
    try {
      const res = await apiClient.post('/promo/validate', { code, totalAmount });
      return res.data?.body;
    } catch (err) {
      // Local fallback promo validation: NEXURA20 gives 20% off
      if (code && code.toUpperCase() === 'NEXURA20') {
        const discount = totalAmount * 0.20;
        return {
          valid: true,
          discountAmount: discount,
          finalAmount: totalAmount - discount,
          message: 'Promo code NEXURA20 applied: 20% discount!'
        };
      }
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: totalAmount,
        message: 'Invalid promo code. Try NEXURA20'
      };
    }
  }
};

export const aiApi = {
  chatWithAi: async (message, history = []) => {
    try {
      const res = await apiClient.post('/ai/chat', { message, history });
      return res.data?.body?.reply;
    } catch (err) {
      // Intelligent fallback responses when backend is offline
      const msg = message.toLowerCase();
      if (msg.includes('dune') || msg.includes('sci-fi')) {
        return "I highly recommend **Dune: Part Two** in IMAX Laser! It's Denis Villeneuve's cinematic masterpiece with ground-shaking Dolby Atmos audio.";
      }
      if (msg.includes('popcorn') || msg.includes('snack') || msg.includes('food')) {
        return "Our best-selling snack is the **Caramel Crunch Popcorn** and **Loaded Nachos Supreme**! You can also order the Ultimate Cinema Combo to save 20% on tickets and beverages.";
      }
      if (msg.includes('vip') || msg.includes('seat')) {
        return "Nexura Cinemas features **VIP Recliners** with full electric recline & plush leather, plus **Couple Pods** for ultimate privacy and comfort.";
      }
      return "Hello! I am your **Nexura AI Cinema Assistant** powered by Groq LLaMA 3.3. How can I help you pick the best movies, book prime seats, or order delicious gourmet snacks today?";
    }
  }
};

export const userApi = {
  login: async (credentials) => {
    try {
      const res = await apiClient.post('/user/login', credentials);
      return res.data?.body;
    } catch (err) {
      throw err;
    }
  },
  register: async (userData) => {
    try {
      const res = await apiClient.post('/user/register', userData);
      return res.data?.body;
    } catch (err) {
      throw err;
    }
  },
  getProfile: () => apiClient.get('/user/me'),
  forgotPassword: (email) => apiClient.post('/user/forgot-password', { email }),
  verifyOtp: (email, otp) => apiClient.post('/user/verify-otp', { email, otp }),
  resetPassword: (email, newPassword) => apiClient.post('/user/reset-password', { email, newPassword }),
};

export const reviewApi = {
  getByMovie: async (movieId) => {
    try {
      const res = await apiClient.get(`/review/movie/${movieId}`);
      return res.data?.body || [];
    } catch (err) {
      return [
        { id: 1, userName: 'Kavindu Senarath', rating: 5, comment: 'Mindblowing visual effects in IMAX! Best cinematic experience in Sri Lanka.', createdAt: '2025-02-10' },
        { id: 2, userName: 'Dinithi Perera', rating: 4.8, comment: 'Loved the VIP recliners and caramel popcorn! Super comfortable seating.', createdAt: '2025-02-18' }
      ];
    }
  },
  addReview: (reviewDto) => apiClient.post('/review/add', reviewDto)
};

export const dashboardApi = {
  getStats: async () => {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return res.data?.body;
    } catch (err) {
      return {
        totalRevenue: 3450800,
        totalBookings: 1420,
        activeMovies: 8,
        averageOccupancyRate: 84.5,
        recentBookings: [
          { reference: 'NX-89214', customerName: 'Roshan Silva', movie: 'Dune: Part Two', seats: 'A1, A2', amount: 7600, status: 'CONFIRMED' },
          { reference: 'NX-65123', customerName: 'Anuki De Silva', movie: 'Oppenheimer', seats: 'C5, C6', amount: 4400, status: 'CONFIRMED' },
          { reference: 'NX-32091', customerName: 'Sahan Wickrama', movie: 'Gladiator II', seats: 'B3, B4', amount: 5000, status: 'CHECKED_IN' }
        ]
      };
    }
  }
};

export default apiClient;
