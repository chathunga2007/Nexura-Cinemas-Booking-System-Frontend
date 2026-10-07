import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Sparkles, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Tv, 
  Volume2, 
  Armchair, 
  MapPin, 
  ArrowRight, 
  ExternalLink,
  Award,
  Heart
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-28">
      
      {/* ---------------- 1. Hero Vision Header ---------------- */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0D101A] to-[#090A0F] border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Pioneering The Future of Cinema</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white font-['Outfit'] tracking-tight leading-none">
            The Story Behind <br />
            <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
              Nexura Cinemas Luxe
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed font-normal">
            Nexura Cinemas was established with a singular, uncompromising vision: to revolutionize the theatrical experience in Sri Lanka through unmatched architectural luxury, cutting-edge 4K Laser projection, and hyper-responsive digital booking engineering.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-xl shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore Now Showing Movies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/theatres"
              className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Our Multiplex Venues</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 2. Creator & Lead Architect Spotlight ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 border border-rose-500/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Avatar / Badge Graphic */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-1 shadow-2xl shadow-rose-600/40">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-4">
                    <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-rose-400 to-amber-300 font-['Outfit']">
                      C
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-2">
                      Nexura Creator
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Lead Architect
                </div>
              </div>

              <h3 className="text-2xl font-black text-white font-['Outfit'] mt-5">
                Chathunga
              </h3>
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                Founder & Lead Software Architect
              </p>

              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://github.com/chathunga2007"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="GitHub Profile"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/chathunga2007/Nexura-Cinemas-Booking-System-Frontend"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                  title="Source Repository"
                >
                  <Code2 className="w-4 h-4 text-cyan-400" />
                </a>
              </div>
            </div>

            {/* Vision & Engineering Note */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5" /> Engineering & Design Vision
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                "We set out to craft an enterprise cinema platform where design meets extreme performance."
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Conceived and engineered by <strong>Chathunga</strong>, the Nexura Cinemas ecosystem was designed from the ground up to solve complex booking concurrency and usher turnstile admission bottlenecks in modern cinema operations.
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                By integrating a high-throughput Java Spring Boot backend with a reactive React 19 + TypeScript frontend, Nexura provides synchronized 10-minute temporary seat-holding, automated QR pass authentication, interactive AI movie concierge recommendations, and seamless local gateway checkouts via PayHere Sri Lanka.
              </p>

              {/* Tech Badges */}
              <div className="pt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> React 19 + TypeScript
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Spring Boot Microservices
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Groq LLaMA 3.3 AI Concierge
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" /> IMAX & Atmos Integration
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ---------------- 3. The Nexura Standards ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">
            Unrivaled Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 font-['Outfit']">
            Four Pillars of Nexura Luxury
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every cinema hall is acoustically sculpted and calibrated to international standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Tv className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">4K Dual Laser</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Unprecedented contrast and vibrant color reproduction that makes every frame come alive with breathtaking clarity.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Dolby Atmos Spatial</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              64 discrete sound channels moving audio objects all around you in three-dimensional space with chest-thumping bass.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Armchair className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Electric VIP Suites</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Motorized leather recliners with in-seat gourmet waiter service, warm blankets, and private acoustic partitions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Instant Digital Passes</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Paperless admission with high-speed 256-bit encrypted QR code verification at all cinema gate turnstiles.
            </p>
          </div>

        </div>
      </section>

      {/* ---------------- 4. By the Numbers ---------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">5</span>
            <span className="block text-xs uppercase font-bold text-rose-400 mt-1">Multiplex Multiplexes</span>
          </div>
          <div>
            <span className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">18+</span>
            <span className="block text-xs uppercase font-bold text-amber-400 mt-1">Laser Screens</span>
          </div>
          <div>
            <span className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">120K+</span>
            <span className="block text-xs uppercase font-bold text-cyan-400 mt-1">Happy Cinephiles</span>
          </div>
          <div>
            <span className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">99.98%</span>
            <span className="block text-xs uppercase font-bold text-emerald-400 mt-1">System Uptime</span>
          </div>
        </div>
      </section>

    </div>
  );
}
