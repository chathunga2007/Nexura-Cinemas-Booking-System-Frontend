import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Play, Ticket, Sparkles } from 'lucide-react';

export default function MovieCard({ movie, onPlayTrailer }) {
  const formatDuration = (mins) => {
    if (!mins) return '2h 15m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const getAgeRatingColor = (rating) => {
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
    <div className="group relative rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-950/30 flex flex-col h-full">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Rating */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.8'}</span>
          </div>

          {/* Age Rating */}
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${getAgeRatingColor(movie.ageRating)}`}>
            {movie.ageRating ? movie.ageRating.replace('_', '-') : 'PG-13'}
          </span>
        </div>

        {/* Trailer Hover Overlay Button */}
        {movie.trailerUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onPlayTrailer && onPlayTrailer(movie)}
              className="w-13 h-13 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm"
              title="Watch Trailer"
            >
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </button>
          </div>
        )}

        {/* Language & Runtime Bar */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md uppercase tracking-wider font-semibold">
            {movie.language || 'ENGLISH'}
          </span>
          <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatDuration(movie.durationMins)}
          </span>
        </div>
      </div>

      {/* Movie Details Bottom */}
      <div className="p-4 flex flex-col flex-1 justify-between">
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
                className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-2 border-t border-slate-800/80">
          <Link
            to={`/movie/${movie.id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-semibold shadow-md shadow-rose-600/20 group-hover:shadow-rose-600/40 transition-all duration-300"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Book Tickets</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
