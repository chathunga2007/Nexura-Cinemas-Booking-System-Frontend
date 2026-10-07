import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Tv, 
  Volume2, 
  Armchair, 
  Navigation, 
  Search, 
  Sparkles, 
  Film, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { theatreApi, MOCK_THEATRES } from '../services/api';
import { Theatre } from '../types';

export default function TheatresPage() {
  const [theatres, setTheatres] = useState<Theatre[]>(MOCK_THEATRES);
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTheatres() {
      setLoading(true);
      try {
        const data = await theatreApi.getAll();
        if (data && data.length > 0) {
          setTheatres(data);
        }
      } catch (err) {
        console.error('Error fetching theatres:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTheatres();
  }, []);

  const cities = ['ALL', 'Colombo', 'Kandy', 'Galle', 'Negombo'];

  const filteredTheatres = theatres.filter((t) => {
    const matchesCity = selectedCity === 'ALL' || t.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = searchQuery
      ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0D101A] to-[#090A0F] border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-600/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Islandwide Flagship Multiplexes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-['Outfit'] tracking-tight">
            Our Cinema Theatres
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 mt-4 leading-relaxed">
            Experience movies in pure comfort and technological grandeur across all our cinema multiplexes in Sri Lanka.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by cinema or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 shadow-xl"
            />
          </div>

          {/* City Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {city === 'ALL' ? 'All Locations' : city}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Theatres Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Available Multiplex Locations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredTheatres.length} cinema theatres in Sri Lanka
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTheatres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTheatres.map((theatre) => (
              <div
                key={theatre.id}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all p-6 sm:p-7 flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-4">
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                      {theatre.city}
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open Today
                    </span>
                  </div>

                  {/* Theatre Name */}
                  <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors font-['Outfit']">
                    {theatre.name}
                  </h3>

                  {/* Address & Contact */}
                  <div className="space-y-2 text-xs text-slate-400 pt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{theatre.location || theatre.address || `${theatre.city}, Sri Lanka`}</span>
                    </div>
                    {theatre.contactNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="font-mono text-slate-300">{theatre.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Screen Features & Capabilities */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-lg bg-slate-950 text-[10px] font-semibold text-slate-300 border border-slate-800 flex items-center gap-1">
                      <Film className="w-3 h-3 text-rose-400" />
                      {theatre.screens || 3} Screens
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-950 text-[10px] font-semibold text-cyan-400 border border-slate-800 flex items-center gap-1">
                      <Tv className="w-3 h-3" />
                      4K Laser
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-950 text-[10px] font-semibold text-amber-400 border border-slate-800 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      Dolby Atmos
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-950 text-[10px] font-semibold text-rose-300 border border-slate-800 flex items-center gap-1">
                      <Armchair className="w-3 h-3" />
                      VIP Suites
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                  <Link
                    to={`/?search=${encodeURIComponent(theatre.name.split('-')[0].trim())}`}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold text-center shadow-lg shadow-rose-600/30 transition-all"
                  >
                    View Showtimes
                  </Link>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theatre.name + ' ' + (theatre.address || theatre.city))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                    title="Open in Google Maps"
                  >
                    <Navigation className="w-4 h-4 text-cyan-400" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-slate-900/40 border border-slate-800">
            <p className="text-slate-400 text-sm">No cinema multiplexes match your query.</p>
            <button
              onClick={() => { setSelectedCity('ALL'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
