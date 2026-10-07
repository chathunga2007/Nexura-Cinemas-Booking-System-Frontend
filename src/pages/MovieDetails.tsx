import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Play, 
  Ticket, 
  Tv, 
  ArrowLeft,
  MessageSquare,
  Send,
  User,
  Heart,
  Share2,
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { movieApi, showTimeApi, reviewApi, watchlistApi } from '../services/api';
import { handleImageError, FALLBACK_POSTER } from '../utils/imageFallback';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import TrailerModal from '../components/TrailerModal';
import { Movie, ShowTime } from '../types';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShowtime } = useBooking();
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<ShowTime[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<{ totalReviews: number; averageRating: number }>({ totalReviews: 0, averageRating: 4.8 });
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [activeTrailer, setActiveTrailer] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);

  // Review form
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

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
      if (!id) return;
      setLoading(true);
      try {
        const movieData = await movieApi.getById(id);
        setMovie(movieData);
        if (movieData) {
          setSelectedMovie(movieData);
        }

        const [stData, revData, summaryData, watchStatus] = await Promise.all([
          showTimeApi.getByMovie(id).catch(() => []),
          reviewApi.getByMovie(id).catch(() => []),
          reviewApi.getSummary(id).catch(() => ({ totalReviews: 18, averageRating: 4.8 })),
          watchlistApi.getStatus(Number(id)).catch(() => false)
        ]);

        setShowtimes(stData || []);
        setReviews(revData || []);
        if (summaryData) {
          setReviewSummary({
            totalReviews: summaryData.totalReviews || revData?.length || 0,
            averageRating: summaryData.averageRating || 4.8
          });
        }
        setIsWatchlisted(watchStatus);
      } catch (err) {
        console.error('Error loading movie details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, setSelectedMovie]);

  const handleToggleWatchlist = async () => {
    if (!id) return;
    try {
      const added = await watchlistApi.toggle(Number(id));
      setIsWatchlisted(added);
      if (added) {
        toast.success(`"${movie?.title}" added to your Watchlist! ❤️`);
      } else {
        toast('Removed from Watchlist', { icon: '🗑️' });
      }
    } catch {
      toast.error('Unable to update watchlist.');
    }
  };

  const handleSelectShowtime = (showtime: ShowTime) => {
    setSelectedShowtime(showtime);
    navigate(`/booking/${showtime.id}`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please sign in to post a verified movie review', { icon: '🔒' });
      setAuthModalOpen(true);
      return;
    }
    if (!commentInput.trim() || !id) return;

    setSubmittingReview(true);
    try {
      await reviewApi.addReview({
        movieId: Number(id),
        rating: ratingInput,
        reviewText: commentInput
      });
      toast.success('Thank you! Your verified review has been submitted.');
      setReviews((prev) => [
        {
          id: Date.now(),
          userFullName: user?.fullName || 'You',
          userName: user?.fullName || 'You',
          rating: ratingInput,
          reviewText: commentInput,
          comment: commentInput,
          createdAt: 'Just now'
        },
        ...prev
      ]);
      setReviewSummary(prev => ({
        totalReviews: prev.totalReviews + 1,
        averageRating: Number(((prev.averageRating * prev.totalReviews + ratingInput) / (prev.totalReviews + 1)).toFixed(1))
      }));
      setCommentInput('');
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090A0F]">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin glow-rose" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      
      {/* 1. Backdrop Banner & Movie Overview */}
      <div className="relative min-h-[60vh] flex items-end">
        <div className="absolute inset-0 bg-[#090A0F]">
          <img
            src={movie.bannerUrl || movie.posterUrl || FALLBACK_POSTER}
            alt={movie.title}
            onError={(e) => handleImageError(e, FALLBACK_POSTER)}
            className="w-full h-full object-cover opacity-35 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/85 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-rose-950/20 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md transition-all hover:bg-black/60"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Movies
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Poster Card with Specular Border */}
            <div className="w-48 sm:w-60 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/15 shrink-0 bg-slate-950 relative group">
              <img 
                src={movie.posterUrl || FALLBACK_POSTER} 
                alt={movie.title} 
                onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>

            {/* Info & Badges */}
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                  {movie.ageRating ? movie.ageRating.replace('_', '-') : 'PG-13'}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 backdrop-blur-md">
                  {movie.language || 'ENGLISH'}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.9'} IMDb</span>
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-rose-400" /> {movie.durationMins || 166} mins
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Outfit'] tracking-tight">
                {movie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {movie.synopsis}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 font-medium">Director: </span>
                  <span className="font-semibold text-white">{movie.director || 'Christopher Nolan'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Genre: </span>
                  <span className="font-semibold text-white">{movie.genre}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-medium">Starring: </span>
                  <span className="font-semibold text-white">{movie.cast || 'Matthew McConaughey, Anne Hathaway, Jessica Chastain'}</span>
                </div>
              </div>

              {/* Action Buttons: Trailer, Watchlist */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {movie.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailer(movie)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-rose-500 text-xs font-semibold text-white transition-all shadow-md hover:shadow-rose-500/20 backdrop-blur-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" /> Watch Official Trailer
                  </button>
                )}

                <button
                  onClick={handleToggleWatchlist}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold transition-all backdrop-blur-md ${
                    isWatchlisted
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-black/40 hover:bg-black/70 border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-white' : ''}`} />
                  <span>{isWatchlisted ? 'In Your Watchlist' : 'Add to Watchlist'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Date Selection Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-rose-500" /> Select Showtime Date:
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {dateOptions.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDateIndex(idx)}
              className={`flex flex-col items-center justify-center min-w-[84px] py-3.5 px-4 rounded-2xl border transition-all duration-300 ${
                selectedDateIndex === idx
                  ? 'bg-gradient-to-b from-rose-600 to-rose-700 border-rose-500 text-white shadow-xl shadow-rose-600/30 scale-105'
                  : 'glass-card border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="text-[11px] font-medium">{date.dayName}</span>
              <span className="text-2xl font-black font-['Outfit'] my-0.5">{date.dateNumber}</span>
              <span className="text-[10px] uppercase font-semibold">{date.month}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Available Theatres & Showtimes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-rose-500" /> Available Screenings & Theatres
          </h2>
          <span className="text-xs text-slate-400 font-medium px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            {dateOptions[selectedDateIndex]?.dayName}, {dateOptions[selectedDateIndex]?.dateNumber} {dateOptions[selectedDateIndex]?.month}
          </span>
        </div>

        {showtimes.length > 0 ? (
          <div className="space-y-5">
            {showtimes.map((st) => (
              <div
                key={st.id}
                className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Theatre Details */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {st.experience ? st.experience.replace('_', ' ') : 'IMAX 3D'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Tv className="w-3.5 h-3.5 text-rose-400" /> {st.screenName || 'Hall 1'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Outfit']">
                    {st.theatreName || 'Nexura Grand - Colombo City Centre'}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-1">
                    <span>ODC: <strong className="text-slate-100">LKR {st.odcPrice || 1500}</strong></span>
                    <span>Balcony: <strong className="text-slate-100">LKR {st.balconyPrice || 2200}</strong></span>
                    <span>Couple: <strong className="text-slate-100">LKR {st.couplePrice || 5000}</strong></span>
                    <span>VIP Recliner: <strong className="text-amber-400">LKR {st.vipPrice || 3800}</strong></span>
                  </div>
                </div>

                {/* Showtime Pills & Select CTA */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSelectShowtime(st)}
                    className="group px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-xl shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <div className="text-left">
                      <span className="block text-[10px] text-rose-200 font-normal">Showtime</span>
                      <span className="text-lg font-black font-['Outfit'] leading-none">{st.startTime || '02:00 PM'}</span>
                    </div>
                    <span className="w-px h-6 bg-white/20" />
                    <span>Select Seats</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No scheduled screenings for this date. Please pick another date above.</p>
          </div>
        )}
      </section>

      {/* 4. Verified Customer Reviews & Ratings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-800/80 space-y-8">
        
        {/* Rating Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-500" /> Moviegoer Reviews & Ratings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Verified feedback from guests who experienced this movie at Nexura Cinemas.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl glass-panel border border-amber-500/30">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400 font-['Outfit'] leading-none">
                {reviewSummary.averageRating}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Average</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-xs text-slate-300">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400">{reviewSummary.totalReviews} verified ratings</span>
            </div>
          </div>
        </div>

        {/* Submit Review Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Write a Verified Review</h4>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            
            {/* Rating Stars Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 mr-2">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingInput(star)}
                  className="p-1 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= ratingInput
                        ? 'fill-amber-400 text-amber-400 scale-110'
                        : 'text-slate-600 hover:text-slate-400'
                    } transition-all`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-3">{ratingInput}.0 / 5.0</span>
            </div>

            {/* Comment Area */}
            <div>
              <textarea
                rows={3}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your experience (laser projection clarity, Dolby Atmos bass, VIP seat comfort)..."
                className="w-full glass-input rounded-2xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview || !commentInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl glass-card border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {(rev.userFullName || rev.userName || 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{rev.userFullName || rev.userName || 'Moviegoer'}</h5>
                    <span className="text-[10px] text-slate-500">{rev.createdAt || 'Recent Screening'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rev.rating || 5}.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.reviewText || rev.comment}</p>
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
