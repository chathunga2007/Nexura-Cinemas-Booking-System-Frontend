import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Volume2, 
  Armchair, 
  Sparkles, 
  Ticket, 
  Check, 
  ArrowRight,
  Maximize2,
  Sliders,
  Layers,
  Star
} from 'lucide-react';
import { movieApi, MOCK_MOVIES } from '../services/api';
import { handleImageError, FALLBACK_POSTER } from '../utils/imageFallback';
import { Movie } from '../types';

export default function ExperiencesPage() {
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await movieApi.getAll();
        if (data && data.length > 0) setMovies(data);
      } catch (e) {
        console.error('Error loading movies:', e);
      }
    }
    loadMovies();
  }, []);

  const experiences = [
    {
      id: 'IMAX',
      badge: 'Signature Format',
      name: 'IMAX® with Laser',
      tagline: 'Heart-Pounding Audio & Awe-Inspiring Laser Images',
      icon: Tv,
      color: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/40',
      glowColor: 'shadow-cyan-500/20',
      description: 'Nexura’s flagship IMAX laser auditorium utilizes dual 4K laser projection engines, providing crystal-clear images, razor-sharp precision, and unmatched color contrast that fills your entire peripheral vision.',
      specs: [
        { label: 'Projection', value: '4K Commercial Dual Laser' },
        { label: 'Aspect Ratio', value: '1.90:1 Expanded Cinema' },
        { label: 'Sound System', value: '12-Channel Immersive Sound' },
        { label: 'Screen Curve', value: 'Geometric Silver Screen' }
      ],
      features: [
        'Up to 40% more picture visible than standard cinema screens',
        'Next-generation laser light source with deeper blacks and vibrant colors',
        'Sub-bass actuators built beneath flooring for visceral rumble',
        'Custom auditorium tuning engineered for zero distortion'
      ]
    },
    {
      id: 'DOLBY',
      badge: 'Acoustic Masterpiece',
      name: '64-Channel Dolby Atmos®',
      tagline: 'Sound That Surrounds & Transports You Into The Movie',
      icon: Volume2,
      color: 'from-amber-500 to-rose-600',
      borderColor: 'border-amber-500/40',
      glowColor: 'shadow-amber-500/20',
      description: 'Dolby Atmos frees sound from channels, placing audio objects in three-dimensional space all around and above you. You will hear every whisper, rainfall, and roaring spaceship fly overhead with pinpoint realism.',
      specs: [
        { label: 'Audio Channels', value: '64 Discrete Sound Objects' },
        { label: 'Overhead Speakers', value: 'Ceiling Array Audio' },
        { label: 'Acoustic Proofing', value: 'Studio-Grade Damping' },
        { label: 'Dynamic Range', value: '128 Audio Elements' }
      ],
      features: [
        'Precision overhead acoustic immersion that simulates real-world dimensions',
        'Unrivaled dialogue clarity even through intense battle sequences',
        'High-power dual subwoofers tuned specifically for cinematic impact',
        'Calibrated for director-approved acoustic accuracy'
      ]
    },
    {
      id: 'VIP',
      badge: 'Ultra Luxury',
      name: 'Nexura VIP Recliner Suites',
      tagline: 'First-Class Comfort & In-Seat Gourmet Butler Service',
      icon: Armchair,
      color: 'from-rose-500 to-amber-500',
      borderColor: 'border-rose-500/40',
      glowColor: 'shadow-rose-500/20',
      description: 'The pinnacle of private luxury cinema. Relax in motorized top-grain leather electric recliners with integrated heated footrests, personal marble cocktail tables, and complimentary butler food service delivered right to your seat.',
      specs: [
        { label: 'Seating', value: 'Motorized Dual-Motor Recliner' },
        { label: 'Spacing', value: '2.5m Private Legroom' },
        { label: 'Service', value: 'In-Seat Express Butler' },
        { label: 'Perks', value: 'Warm Blankets & Welcome Drink' }
      ],
      features: [
        'Full 160-degree electric recline with customizable headrest tilt',
        'Call button for at-seat champagne, hot gourmet snacks, and desserts',
        'Private acoustically separated seating pods for uninterrupted viewing',
        'VIP lounge access with priority express entry'
      ]
    },
    {
      id: 'SCREENX',
      badge: '270° Panoramic',
      name: 'ScreenX 270° Surround',
      tagline: 'Beyond The Frame Into Total Panoramic Immersion',
      icon: Maximize2,
      color: 'from-indigo-500 to-purple-600',
      borderColor: 'border-indigo-500/40',
      glowColor: 'shadow-indigo-500/20',
      description: 'ScreenX expands cinematic action beyond the main screen onto both side walls of the cinema auditorium, creating a 270-degree surround visual field that makes you feel seated directly inside the world of the film.',
      specs: [
        { label: 'Field of View', value: '270° Multi-Wall Projection' },
        { label: 'Projector Units', value: '5 Synchronized Laser Engines' },
        { label: 'Immersion', value: 'Panoramic Peripheral Vision' },
        { label: 'Auditorium', value: 'Acoustic Fabric Side Walls' }
      ],
      features: [
        'Peripheral sensory immersion engineered for epic blockbusters and thrillers',
        'Adaptive brightness calibration across main and secondary wall surfaces',
        'Specially mastered film sequences extending the director’s vision'
      ]
    }
  ];

  const filteredExperiences = selectedFormat === 'ALL'
    ? experiences
    : experiences.filter(e => e.id === selectedFormat);

  return (
    <div className="min-h-screen pb-24">
      
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0D101A] to-[#090A0F] border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-600/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>State-Of-The-Art Projection & Sound</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-['Outfit'] tracking-tight">
            Cinematic Experiences
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-300 mt-4 leading-relaxed">
            Every auditorium at Nexura is custom-engineered to deliver absolute sensory immersion. Discover our world-class formats, from towering IMAX Laser screens to VIP recliner sanctuaries.
          </p>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            <button
              onClick={() => setSelectedFormat('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFormat === 'ALL'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Experiences
            </button>
            {experiences.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setSelectedFormat(exp.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFormat === exp.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {exp.name.split('®')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {filteredExperiences.map((exp, idx) => {
          const Icon = exp.icon;
          const matchingMovies = movies.filter(m => 
            m.experiences?.some(e => e.toUpperCase().includes(exp.id))
          );

          return (
            <div
              key={exp.id}
              id={exp.id.toLowerCase()}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all p-6 sm:p-10 shadow-2xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Overview Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${exp.color} flex items-center justify-center text-white shadow-lg ${exp.glowColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                        {exp.badge}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                        {exp.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-200">
                    {exp.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {exp.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-left">
                        <span className="block text-[10px] uppercase font-semibold text-slate-500">
                          {spec.label}
                        </span>
                        <span className="text-xs font-bold text-white font-['Outfit'] mt-0.5 block">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 pt-2">
                    {exp.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Currently Showing Movies in this Format */}
                <div className="lg:col-span-5 bg-slate-950/70 rounded-2xl border border-slate-800/80 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-rose-500" />
                      Now Playing in {exp.name.split(' ')[0]}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {matchingMovies.length} Available
                    </span>
                  </div>

                  {matchingMovies.length > 0 ? (
                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                      {matchingMovies.slice(0, 3).map((movie) => (
                        <div
                          key={movie.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                        >
                          <img
                            src={movie.posterUrl || FALLBACK_POSTER}
                            alt={movie.title}
                            onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                            className="w-12 h-16 object-cover rounded-lg shrink-0 border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate font-['Outfit']">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                {movie.rating || 9.0}
                              </span>
                              <span>•</span>
                              <span>{movie.durationMins || 150}m</span>
                            </div>
                            <Link
                              to={`/movie/${movie.id}`}
                              className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-bold hover:text-rose-300 mt-1"
                            >
                              <span>Book Tickets</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-4 text-center">
                      No movies currently scheduled in this specific format today.
                    </p>
                  )}

                  <Link
                    to="/"
                    className="block text-center w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold border border-slate-800 transition-colors"
                  >
                    View All Showtimes
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
