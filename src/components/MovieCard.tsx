import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Ticket, Heart, BookmarkCheck } from 'lucide-react';
import { handleImageError, FALLBACK_POSTER } from '../utils/imageFallback';
import { Movie } from '../types';
import { watchlistApi } from '../services/api';
import toast from 'react-hot-toast';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer?: (movie: Movie) => void;
}

export default function MovieCard({ movie, onPlayTrailer }: MovieCardProps) {
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    watchlistApi.getStatus(movie.id).then(setIsWatchlisted).catch(() => {});
  }, [movie.id]);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;
    setIsToggling(true);
    try {
      const added = await watchlistApi.toggle(movie.id);
      setIsWatchlisted(added);
      if (added) {
        toast.success(`"${movie.title}" added to your Watchlist! ❤️`, {
          style: { background: '#121522', color: '#fff', border: '1px solid rgba(244,63,94,0.3)' }
        });
      } else {
        toast('Removed from Watchlist', { icon: '🗑️' });
      }
    } catch {
      toast.error('Unable to update watchlist.');
    } finally {
      setIsToggling(false);
    }
  };

  const formatDuration = (mins?: number) => {
    if (!mins) return '2h 15m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getAgeRatingColor = (rating?: string) => {
    switch (rating) {
      case 'R_18':
      case 'ADULT':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PG_13':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card hover:border-rose-500/50 transition-all duration-500 flex flex-col h-full">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl || FALLBACK_POSTER}
          alt={movie.title}
          onError={(e) => handleImageError(e, FALLBACK_POSTER)}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/40 opacity-70 group-hover:opacity-85 transition-opacity" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.8'}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${getAgeRatingColor(movie.ageRating)}`}>
              {movie.ageRating ? movie.ageRating.replace('_', '-') : 'PG-13'}
            </span>

            {/* Watchlist Heart Button */}
            <button
              onClick={handleToggleWatchlist}
              disabled={isToggling}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-md ${
                isWatchlisted 
                  ? 'bg-rose-600/90 border-rose-400 text-white scale-110 shadow-rose-600/40' 
                  : 'bg-black/40 hover:bg-black/70 border-white/20 text-slate-300 hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Trailer Hover Overlay Button */}
        {movie.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onPlayTrailer && onPlayTrailer(movie)}
              className="w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              title="Watch Trailer"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>
          </div>
        )}

        {/* Language & Runtime Bar */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md uppercase tracking-wider font-semibold border border-white/10">
            {movie.language || 'ENGLISH'}
          </span>
          <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatDuration(movie.durationMins)}
          </span>
        </div>
      </div>

      {/* Movie Details Bottom */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-gradient-to-b from-transparent to-slate-900/40">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 font-['Outfit']">
            {movie.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-normal">
            {movie.genre || 'Action / Adventure / Sci-Fi'}
          </p>

          {/* Experience Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {(movie.experiences || ['IMAX 3D', 'Dolby Atmos']).map((exp, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 backdrop-blur-sm"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-3 border-t border-slate-800/80">
          <Link
            to={`/movie/${movie.id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 group-hover:shadow-rose-600/40 transition-all duration-300"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
