import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Play, 
  Ticket, 
  Star, 
  Clock, 
  Sparkles, 
  SlidersHorizontal, 
  Tv, 
  Volume2, 
  Armchair, 
  Popcorn, 
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { movieApi, MOCK_MOVIES, MOCK_THEATRES } from '../services/api';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

export default function Home() {
  const [movies, setMovies] = useState(MOCK_MOVIES);
  const [featuredMovie, setFeaturedMovie] = useState(MOCK_MOVIES[0]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function loadMovies() {
      const data = await movieApi.getAll();
      if (data && data.length > 0) {
        setMovies(data);
        setFeaturedMovie(data[0]);
      }
    }
    loadMovies();
  }, []);

  // Filter movies
  const filteredMovies = movies.filter((m) => {
    const matchesSearch = searchQuery
      ? m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesLanguage = selectedLanguage === 'ALL' || m.language === selectedLanguage;

    const matchesExperience =
      selectedExperience === 'ALL' ||
      (m.experiences && m.experiences.some((e) => e.toUpperCase().includes(selectedExperience)));

    return matchesSearch && matchesLanguage && matchesExperience;
  });

  return (
    <div className="min-h-screen">
      
      {/* ---------------- 1. Cinematic Hero Billboard ---------------- */}
      {featuredMovie && (
        <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">
          
          {/* Backdrop Image with Multi-Gradient Overlay */}
          <div className="absolute inset-0 bg-slate-950">
            <img
              src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
            />
            {/* Dark Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090A0F] via-[#090A0F]/80 to-transparent w-full md:w-3/4" />
          </div>

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10">
            <div className="max-w-2xl space-y-5">
              
              {/* Featured Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Featured Blockbuster • Now Showing</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none font-['Outfit'] drop-shadow-xl">
                {featuredMovie.title}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {featuredMovie.rating || 9.0} IMDb
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  {featuredMovie.durationMins || 166} Mins
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  {featuredMovie.language || 'ENGLISH'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {featuredMovie.ageRating?.replace('_', '-') || 'PG-13'}
                </span>
                <span className="text-slate-400">
                  {featuredMovie.genre}
                </span>
              </div>

              {/* Synopsis */}
              <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed font-normal">
                {featuredMovie.synopsis}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  to={`/movie/${featuredMovie.id}`}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-sm font-bold shadow-xl shadow-rose-600/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Tickets Now</span>
                </Link>

                {featuredMovie.trailerUrl && (
                  <button
                    onClick={() => setActiveTrailer(featuredMovie)}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white text-sm font-semibold backdrop-blur-md hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>

            </div>

            {/* Quick Hero Switcher Thumbnails */}
            <div className="mt-14 hidden lg:flex items-center gap-4 overflow-x-auto pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-2">
                Trending:
              </span>
              {movies.slice(0, 5).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setFeaturedMovie(m)}
                  className={`group relative rounded-xl overflow-hidden h-20 w-36 shrink-0 border-2 transition-all ${
                    featuredMovie.id === m.id
                      ? 'border-rose-500 scale-105 shadow-lg shadow-rose-500/40'
                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 flex flex-col justify-end">
                    <p className="text-[11px] font-bold text-white truncate text-left">{m.title}</p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ---------------- 2. Filter & Experience Selector Bar ---------------- */}
      <section className="sticky top-20 z-30 bg-[#090A0F]/95 backdrop-blur-xl border-y border-slate-800/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Experience Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
              </span>
              {['ALL', 'IMAX', 'DOLBY', 'VIP'].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExperience(exp)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedExperience === exp
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {exp === 'ALL' ? 'All Formats' : exp === 'IMAX' ? 'IMAX 3D' : exp === 'DOLBY' ? 'Dolby Atmos' : 'VIP Recliner'}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {['ALL', 'ENGLISH', 'SINHALA', 'TAMIL'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-slate-800 text-white border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ALL' ? 'All Languages' : lang}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. Now Showing Movies Grid ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Now Playing in Sri Lanka
            </div>
            <h2 className="text-3xl font-black text-white mt-1 font-['Outfit']">
              Featured Showtimes & Movies
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredMovies.length} blockbuster movies
          </span>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={(m) => setActiveTrailer(m)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm">No movies match your filter criteria.</p>
            <button
              onClick={() => { setSelectedExperience('ALL'); setSelectedLanguage('ALL'); }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ---------------- 4. Signature Cinematic Experiences ---------------- */}
      <section id="experiences" className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-[#090A0F] to-[#0D101A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
              The Nexura Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-['Outfit']">
              Engineered for Pure Cinematic Immersion
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Next-generation projection, thunderous spatial audio, and unmatched seating comfort across all our locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Experience Card 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                <Tv className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">IMAX with Laser</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                4K laser projection delivering crystal-clear images, deeper contrast, and vivid colors that make every movie frame breathtaking.
              </p>
            </div>

            {/* Experience Card 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">64-Channel Dolby Atmos</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Sound that moves all around you in three-dimensional space, immersing you directly inside the director's cinematic universe.
              </p>
            </div>

            {/* Experience Card 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Armchair className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">VIP Recliner Suites</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Full-grain leather electric recliners with in-seat gourmet food ordering, warm blankets, and complimentary welcome beverages.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- 5. Theatres & Venues Grid ---------------- */}
      <section id="theatres" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
              Islandwide Locations
            </span>
            <h2 className="text-3xl font-black text-white mt-1 font-['Outfit']">
              Our Flagship Cinema Theatres
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_THEATRES.map((theatre) => (
            <div
              key={theatre.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2 text-rose-500 text-xs font-bold mb-2">
                <MapPin className="w-4 h-4" /> {theatre.city}
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">{theatre.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{theatre.location}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{theatre.screens} Premium Screens</span>
                <span className="text-rose-400 font-semibold">IMAX & Atmos</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 6. Pre-order Concessions Spotlight ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-10">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
              <Popcorn className="w-3.5 h-3.5" /> Skip Box Office Queues
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Pre-Order Gourmet Snacks & Popcorn
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Order fresh butterscotch caramel popcorn, supreme loaded nachos, and chilled fountain drinks online. Pick them up right at the express counter upon entry!
            </p>
          </div>
          <Link
            to="/concessions"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-xl shadow-amber-500/20 hover:scale-105 transition-all whitespace-nowrap"
          >
            Explore Snacks Menu
          </Link>
        </div>
      </section>

      {/* Trailer Modal Player */}
      {activeTrailer && (
        <TrailerModal
          movie={activeTrailer}
          onClose={() => setActiveTrailer(null)}
        />
      )}

    </div>
  );
}
