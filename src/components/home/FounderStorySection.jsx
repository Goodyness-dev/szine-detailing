import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';
import { IMAGE_MANIFEST } from '../../data/imageManifest';

export default function FounderStorySection({ onOpenWizard }) {
  const { owner, stats, instagram } = BUSINESS_INFO;

  return (
    <section id="founder-story" className="py-20 lg:py-28 relative overflow-hidden bg-neutral-950 text-white">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Founder Spotlight • Young Entrepreneur DNA
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Built from Pure Obsession: Meet 20-Year-Old Founder <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Tomas Williams</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-2xl font-normal leading-relaxed">
            Started at 17 with a single pressure washer and an uncompromising eye for paint clarity. Now at 20, leading Arizona's apex exotic automotive preservation studio.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Visual & Verification (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-neutral-800 bg-neutral-900 group shadow-2xl">
              <img 
                src={IMAGE_MANIFEST.paintCorrection || "/images/paint-correction.jpg"} 
                alt="Tomas Williams precision paint correction on exotic vehicle"
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase mb-2">
                  // 01 OPTICAL PRECISION
                </span>
                <p className="text-white font-bold text-lg sm:text-xl">
                  Surgical Compound Leveling & Machine Jeweling
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Every curve inspected under 5,000K daylight LED bars.
                </p>
              </div>
            </div>

            {/* Quick KPI Stats Bento Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">20</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-semibold">Years Old Founder</span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.followers}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-semibold">Instagram Community</span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{stats.reviews}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-semibold">5-Star Reviews</span>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.vehiclesProtected}</span>
                <span className="text-xs uppercase tracking-wider text-neutral-400 mt-1 font-semibold">Protected in AZ</span>
              </div>
            </div>
          </div>

          {/* Right Column: Deep Story & Quote (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl p-7 sm:p-10 lg:p-12 bg-neutral-900/80 border-2 border-neutral-800 shadow-2xl relative">
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-lg">
                  TW
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Tomas Williams
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
                    Founder & Master Paint Specialist • Szine Detailing LLC
                  </p>
                </div>
              </div>

              {/* Quote Block */}
              <div className="p-6 rounded-2xl bg-black/50 border border-neutral-800/80 relative">
                <svg className="w-8 h-8 text-cyan-500/30 absolute top-4 left-4 -z-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-sm sm:text-base text-neutral-200 italic font-medium leading-relaxed relative z-10 pl-6">
                  "{owner.quote}"
                </p>
              </div>

              {/* The Journey Milestones */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                  // THE RISE OF SZINE DETAILING
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
                    <span className="text-xs font-mono text-cyan-400 font-bold">2021 • Age 17</span>
                    <h5 className="text-sm font-bold text-white mt-1">Single Pressure Washer & Dream</h5>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Started mobile detailing in Queen Creek & Gilbert with pure sweat equity, spending 10+ hours per car to understand clear coat behavior.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
                    <span className="text-xs font-mono text-cyan-400 font-bold">2023 • Age 19</span>
                    <h5 className="text-sm font-bold text-white mt-1">Exotic Certification</h5>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Certified in multi-year commercial ceramic coatings. Trusted by Ferrari F8, Porsche GT3 RS, and supercar owners across the Valley.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
                    <span className="text-xs font-mono text-cyan-400 font-bold">2024 • Age 20</span>
                    <h5 className="text-sm font-bold text-white mt-1">42K+ Loyal Community</h5>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Scaled @szinedetailing into Arizona's most active car detailing community, posting real daily transformations and behind-the-scenes craft.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
                    <span className="text-xs font-mono text-cyan-400 font-bold">Today • 300+ 5-Star Records</span>
                    <h5 className="text-sm font-bold text-white mt-1">White-Glove Fleet & Studio</h5>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      On-site deionized water filtration rigs dispatching Valley-wide alongside our climate-controlled studio coating bay.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenWizard && onOpenWizard()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-neutral-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition"
              >
                <span>Book Direct with Tomas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-sm border border-neutral-700 flex items-center gap-2.5 transition active:scale-95"
              >
                <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>View 29K+ Posts ({instagram.followers})</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="text-xs text-neutral-400 hover:text-cyan-400 font-mono flex items-center gap-1.5 transition ml-auto"
              >
                <span>Direct Line: {BUSINESS_INFO.phone}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
