import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Ticket, Star, Clock, Film, ArrowRight, Sparkles } from 'lucide-react';
import { watchlistApi } from '../services/api';
import { WatchlistItem } from '../types';
import { handleImageError, FALLBACK_POSTER } from '../utils/imageFallback';
import toast from 'react-hot-toast';

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const data = await watchlistApi.getMyList();
      setItems(data || []);
    } catch {
      toast.error('Failed to load your watchlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (movieId: number, title: string) => {
    try {
      await watchlistApi.remove(movieId);
      setItems(prev => prev.filter(item => item.movieId !== movieId));
      toast.success(`Removed "${title}" from your watchlist.`);
    } catch {
      toast.error('Could not remove movie.');
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/30 via-slate-900/40 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Personal Saved Movies</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] tracking-tight">
              My Cinematic <span className="bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">Watchlist</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Keep track of blockbusters you're anticipating. When tickets go on sale, reserve your premier IMAX or VIP recliner seats in seconds.
            </p>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="rounded-2xl bg-slate-900/50 border border-slate-800 h-80 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl glass-panel border border-slate-800 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-['Outfit']">Your Watchlist is Empty</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Explore the latest premier Hollywood and local releases, tap the heart icon on any poster, and save them for instant booking.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:scale-105 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Explore Now Showing Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div
                key={item.id || item.movieId}
                className="group relative rounded-2xl overflow-hidden glass-card flex flex-col justify-between"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                  <img
                    src={item.moviePoster || FALLBACK_POSTER}
                    alt={item.movieTitle}
                    onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/50" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.rating ? Number(item.rating).toFixed(1) : '8.8'}</span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.movieId, item.movieTitle)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 hover:bg-red-600 border border-white/20 text-slate-300 hover:text-white transition-colors backdrop-blur-md shadow-lg"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Bottom Runtime */}
                  <div className="absolute bottom-3 left-3 text-[11px] text-slate-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.durationMinutes ? `${Math.floor(item.durationMinutes / 60)}h ${item.durationMinutes % 60}m` : '2h 15m'}</span>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 font-['Outfit']">
                      {item.movieTitle}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {item.movieGenre || 'Cinema Blockbuster'}
                    </p>
                  </div>

                  <Link
                    to={`/movie/${item.movieId}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all duration-300"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Tickets</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
