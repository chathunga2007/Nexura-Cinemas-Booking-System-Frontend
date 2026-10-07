import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06070B] text-slate-400 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-wider text-white font-['Outfit']">
                  NEXURA
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-[0.25em] text-rose-500 -mt-1">
                  Cinemas Luxe
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka's premier cinematic destination. Featuring IMAX with Laser, Dolby Atmos 3D, and bespoke VIP Recliner suites with in-seat gourmet dining.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-rose-500" />
                <span>+94 76 794 5968</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-rose-500" />
                <span>support@nexuracinemas.lk</span>
              </div>
            </div>
          </div>

          {/* Cinemas & Locations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Cinema Locations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Colombo City Centre (IMAX)
              </li>
              <li className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> One Galle Face Mall (Luxe)
              </li>
              <li className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Kandy City Centre (Royale)
              </li>
              <li className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> Galle Fort Promenade (Waves)
              </li>
            </ul>
          </div>

          {/* Experiences & Dining */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Explore Nexura
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/experiences" className="hover:text-rose-400 transition-colors">IMAX with Laser</Link></li>
              <li><Link to="/experiences" className="hover:text-rose-400 transition-colors">Dolby Atmos Surround</Link></li>
              <li><Link to="/theatres" className="hover:text-rose-400 transition-colors">Multiplex Theatres</Link></li>
              <li><Link to="/concessions" className="hover:text-rose-400 transition-colors">Caramel Popcorn & Snacks</Link></li>
              <li><Link to="/about" className="text-rose-400 font-semibold hover:text-rose-300 transition-colors flex items-center gap-1">About Us & Creator</Link></li>
            </ul>
          </div>

          {/* Payment Gateways & Secure */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Official Payments
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Protected by 256-bit SSL encryption & Sri Lanka's PayHere payment gateway.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-semibold text-rose-400">PayHere</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-medium text-slate-300">VISA</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-medium text-slate-300">Mastercard</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-medium text-slate-300">Genie</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] font-medium text-slate-300">EzCash</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            <p>© {new Date().getFullYear()} Nexura Cinemas PVT LTD. All rights reserved.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Architected & Engineered by <Link to="/about" className="text-rose-400 hover:text-rose-300 font-bold underline decoration-rose-500/40">Chathunga</Link>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 font-medium">About Creator</Link>
            <Link to="/theatres" className="hover:text-slate-300">Theatres</Link>
            <Link to="/experiences" className="hover:text-slate-300">Experiences</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
