import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';
import { DESIGN_THEME } from '../../data/designTheme';
import { IMAGE_MANIFEST } from '../../data/imageManifest';

export default function Hero({ onOpenWizard }) {
  const badgeText = DESIGN_THEME?.copyHooks?.heroBadge || "42.2K Community • 300+ 5★ Reviews • Phoenix Metro & East Valley";
  const headline = DESIGN_THEME?.copyHooks?.heroHeadline || "Optical Perfection. Extreme Ceramic Gloss.";
  const subtitle = DESIGN_THEME?.copyHooks?.heroSubtitle || BUSINESS_INFO.tagline;

  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white" aria-label="Hero Introduction">
      {/* Hero Media Container */}
      <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0 overflow-hidden bg-neutral-950">
          <img 
            src={IMAGE_MANIFEST.heroPoster || "/images/hero-poster.jpg"} 
            alt="Szine Detailing supercar ceramic coating studio bay" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
            fetchpriority="high"
          />
          {/* Subtle multi-layer gradient vignette for tactical contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/75 to-neutral-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/50" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 w-full z-10">
          <div className="max-w-3xl space-y-6">
            
            {/* Architectural Status Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.08] text-white">
              {headline}
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => onOpenWizard && onOpenWizard()}
                className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-base transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/25 active:scale-95"
                aria-label="Request Instant Quote or Schedule"
              >
                <span>Request Instant Quote</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="px-7 py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold text-base border border-neutral-700/80 backdrop-blur-md transition flex items-center justify-center gap-2.5 active:scale-95"
                aria-label={`Call ${BUSINESS_INFO.phone}`}
              >
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call (602) 880-9822</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-neutral-300 pt-3 border-t border-neutral-800/80">
              <div className="flex items-center gap-1 text-amber-400">
                {'★★★★★'.split('').map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <span className="font-semibold text-white">5.0 Star Rating</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-300">Over 300+ Verified Valley Clients</span>
              <span className="text-neutral-500">•</span>
              <span className="text-cyan-400 font-mono font-medium">@szinedetailing (42.2k IG)</span>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Tactical Service Quick-Bar */}
      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 pb-10">
        <div className="bg-neutral-900/95 border-2 border-neutral-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                // MOBILE DISPATCH OR STUDIO FINISHING
              </p>
              <p className="text-sm font-semibold text-neutral-200">
                On-site deionized water rigs across Phoenix, Scottsdale, Gilbert, Chandler & East Valley
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onOpenWizard && onOpenWizard()}
              className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider transition active:scale-95 text-center"
            >
              Instant Estimate →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
