import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';

export default function Footer({ onOpenWizard, onNavigate }) {
  const { name, tagline, phone, address, instagram, hours } = BUSINESS_INFO;

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    if (target === 'services') {
      if (onNavigate) onNavigate('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (onNavigate) onNavigate('home');
    setTimeout(() => {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs sm:text-sm border-t border-neutral-900 pb-16 sm:pb-0" role="contentinfo">
      
      {/* Pre-footer Callout */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-cyan-500 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 text-neutral-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-950">
              Preserve Your Vehicle's Finish with Szine Detailing
            </h3>
            <p className="mt-1.5 text-neutral-900 font-medium text-sm sm:text-base">
              Get an accurate estimate for ceramic coating, paint correction, or mobile detail in 2 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenWizard && onOpenWizard()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-xl text-center"
            >
              Get Free Estimate
            </button>
            <a
              href={`tel:${phone.replace(/[^0-9]/g, '')}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition border border-black/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-neutral-950 font-black font-mono text-sm">
              SZ
            </div>
            <span className="text-lg font-black text-white tracking-tight">SZINE DETAILING</span>
          </div>
          <p className="text-neutral-400 leading-relaxed text-xs">
            {tagline}
          </p>
          <div className="pt-1">
            <p className="text-xs font-mono text-cyan-400">
              Founded & Operated by 20-Year-Old Specialist Tomas Williams
            </p>
          </div>
          <div className="pt-2">
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-neutral-300 hover:text-cyan-400 transition"
            >
              <span>Instagram: {instagram.handle} ({instagram.followers})</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-mono">
            <li><a href="#founder-story" onClick={(e) => handleLinkClick(e, '#founder-story')} className="hover:text-cyan-400 transition">Founder Story</a></li>
            <li><a href="#services" onClick={(e) => handleLinkClick(e, '#services')} className="hover:text-cyan-400 transition">Ceramic Coatings & Correction</a></li>
            <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="hover:text-cyan-400 transition">The Szine Standard</a></li>
            <li><a href="#amenities" onClick={(e) => handleLinkClick(e, '#amenities')} className="hover:text-cyan-400 transition">Client Amenities</a></li>
            <li><a href="#reviews" onClick={(e) => handleLinkClick(e, '#reviews')} className="hover:text-cyan-400 transition">Client Reviews (300+)</a></li>
            <li><a href="#location" onClick={(e) => handleLinkClick(e, '#location')} className="hover:text-cyan-400 transition">Dispatch & Hours</a></li>
            <li><a href="#/admin" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('admin'); }} className="text-neutral-500 hover:text-neutral-300 transition">Admin Portal</a></li>
          </ul>
        </div>

        {/* Service Coverage Areas */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
            Service Areas
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
            {address.serviceAreas.map(c => (
              <span key={c} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                {c}, AZ
              </span>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-neutral-500 leading-relaxed font-mono">
            Mobile deionized water rigs dispatched Valley-wide directly to your garage or office.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 font-mono text-xs">
          <h4 className="font-mono font-bold uppercase tracking-wider text-white mb-4">
            Direct Contact
          </h4>
          <p className="text-neutral-300">
            Direct Calls & SMS:<br />
            <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="text-cyan-400 font-bold hover:underline">
              {phone}
            </a>
          </p>
          <p className="text-neutral-400">
            Email:<br />
            <span className="text-neutral-200">{BUSINESS_INFO.email}</span>
          </p>
          <p className="text-neutral-400 pt-1">
            Studio Hours:<br />
            <span className="text-neutral-300">Mon-Fri: 7:30 AM – 6:30 PM</span><br />
            <span className="text-neutral-300">Sat-Sun: By Appointment</span>
          </p>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.legalName}. All Rights Reserved.</p>
          <p>Phoenix Metro, East Valley & Scottsdale Exotic Detailing Specialist.</p>
        </div>
      </div>

    </footer>
  );
}
