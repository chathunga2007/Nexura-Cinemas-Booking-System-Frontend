import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Play, 
  Ticket, 
  MapPin, 
  Tv, 
  Share2, 
  ArrowLeft,
  MessageSquare,
  Send,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { movieApi, showTimeApi, reviewApi } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShowtime } = useBooking();
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review form
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Generate next 7 days for the date selector
  const dateOptions = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNumber: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      fullIso: d.toISOString().split('T')[0]
    };
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const movieData = await movieApi.getById(id);
        setMovie(movieData);
        setSelectedMovie(movieData);

        const stData = await showTimeApi.getByMovie(id);
        setShowtimes(stData);

        const revData = await reviewApi.getByMovie(id);
        setReviews(revData);
      } catch (err) {
        console.error('Error loading movie details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    navigate(`/booking/${showtime.id}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please sign in to post a movie review', { icon: '🔒' });
      setAuthModalOpen(true);
      return;
    }
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    try {
      await reviewApi.addReview({
        movieId: Number(id),
        rating: ratingInput,
        comment: commentInput
      });
      toast.success('Thank you! Your review has been submitted.');
      setReviews((prev) => [
        {
          id: Date.now(),
          userName: user?.fullName || 'You',
          rating: ratingInput,
          comment: commentInput,
          createdAt: 'Just now'
        },
        ...prev
      ]);
      setCommentInput('');
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      
      {/* ---------------- 1. Backdrop Banner & Movie Overview ---------------- */}
      <div className="relative min-h-[55vh] flex items-end">
        <div className="absolute inset-0 bg-slate-950">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Movies
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Poster */}
            <div className="w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 shrink-0 bg-slate-900">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                  {movie.ageRating ? movie.ageRating.replace('_', '-') : 'PG-13'}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {movie.language || 'ENGLISH'}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating ? Number(movie.rating).toFixed(1) : '8.9'} IMDb
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {movie.durationMins || 166} mins
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
                {movie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {movie.synopsis}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold">Director: </span>
                  {movie.director || 'Denis Villeneuve'}
                </div>
                <div>
                  <span className="text-slate-200 font-semibold">Genre: </span>
                  {movie.genre}
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-200 font-semibold">Starring: </span>
                  {movie.cast || 'Timothée Chalamet, Zendaya, Rebecca Ferguson'}
                </div>
              </div>

              {movie.trailerUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTrailer(movie)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-semibold text-white transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Watch Official Trailer
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ---------------- 2. Date Selection Bar ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-500" /> Select Showtime Date:
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {dateOptions.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDateIndex(idx)}
              className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-4 rounded-2xl border transition-all ${
                selectedDateIndex === idx
                  ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-[11px] font-medium">{date.dayName}</span>
              <span className="text-xl font-black font-['Outfit'] my-0.5">{date.dateNumber}</span>
              <span className="text-[10px] uppercase font-semibold">{date.month}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- 3. Available Theatres & Showtimes ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-500" /> Available Screenings & Theatres
          </h2>
          <span className="text-xs text-slate-400">
            {dateOptions[selectedDateIndex]?.dayName}, {dateOptions[selectedDateIndex]?.dateNumber} {dateOptions[selectedDateIndex]?.month}
          </span>
        </div>

        {showtimes.length > 0 ? (
          <div className="space-y-6">
            {showtimes.map((st) => (
              <div
                key={st.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Theatre Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {st.experience ? st.experience.replace('_', ' ') : 'IMAX 3D'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-slate-500" /> {st.screenName || 'Hall 1'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    {st.theatreName || 'Nexura Grand - Colombo City Centre'}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
                    <span>ODC: <strong className="text-slate-200">LKR {st.odcPrice || 1500}</strong></span>
                    <span>Balcony: <strong className="text-slate-200">LKR {st.balconyPrice || 2200}</strong></span>
                    <span>Couple Seat: <strong className="text-slate-200">LKR {st.couplePrice || 5000}</strong></span>
                    <span>VIP Recliner: <strong className="text-amber-400">LKR {st.vipPrice || 3800}</strong></span>
                  </div>
                </div>

                {/* Showtime Pills & Select CTA */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSelectShowtime(st)}
                    className="group px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <div className="text-left">
                      <span className="block text-[10px] text-rose-200 font-normal">Showtime</span>
                      <span className="text-base font-black font-['Outfit']">{st.startTime || '02:00 PM'}</span>
                    </div>
                    <span className="w-px h-6 bg-white/20" />
                    <span>Select Seats</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No scheduled screenings for this date.</p>
          </div>
        )}
      </section>

      {/* ---------------- 4. Customer Reviews & Ratings ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-800">
        <h2 className="text-2xl font-black text-white font-['Outfit'] mb-8 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-rose-500" /> Moviegoer Reviews & Ratings
        </h2>

        {/* Submit Review Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 mb-10">
          <h4 className="text-sm font-bold text-white mb-2">Write a Verified Review</h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            
            {/* Rating Stars Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= ratingInput
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-2">{ratingInput}.0 / 5.0</span>
            </div>

            {/* Comment */}
            <div>
              <textarea
                rows="3"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your experience (visuals, Dolby sound, seating comfort)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview || !commentInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{rev.userName || 'Moviegoer'}</h5>
                    <span className="text-[10px] text-slate-500">{rev.createdAt || 'Recent'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating || 5}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trailer Modal */}
      {activeTrailer && (
        <TrailerModal
          movie={activeTrailer}
          onClose={() => setActiveTrailer(null)}
        />
      )}

    </div>
  );
}
