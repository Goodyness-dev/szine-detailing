import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';
import { IMAGE_MANIFEST } from '../../data/imageManifest';

export default function AboutSection({ onOpenWizard }) {
  const { owner } = BUSINESS_INFO;

  return (
    <section id="about" className="py-20 lg:py-28 bg-neutral-900/60 text-white border-t border-neutral-900" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Interior Detailing / Studio Craft */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-neutral-950 group">
              <img
                src={IMAGE_MANIFEST.interiorDetail || "/images/interior-detail.jpg"}
                alt="Szine Detailing bespoke supercar interior and leather care"
                loading="lazy"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-6 right-4 sm:right-8 bg-neutral-900 border-2 border-neutral-800 rounded-2xl shadow-2xl p-5 backdrop-blur-xl">
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">100%</div>
              <div className="text-xs text-neutral-300 font-mono font-semibold uppercase tracking-wider">Spot-Free DI Water</div>
            </div>
          </div>

          {/* Right: Craftsmanship & The Szine Standard */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
              // 03 THE SZINE STANDARD
            </div>

            <h2 id="about-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Surgical Precision on Every Clear Coat
            </h2>

            {/* Owner Quote */}
            <div className="border-l-2 border-cyan-500 pl-5 sm:pl-6 py-2 bg-neutral-950/50 rounded-r-2xl border-t border-b border-r border-neutral-800/80">
              <p className="text-neutral-200 text-sm sm:text-base italic leading-relaxed font-medium">
                "{owner?.quote}"
              </p>
              <div className="mt-3 text-xs sm:text-sm font-mono font-bold text-cyan-400">
                — {owner?.name}, {owner?.role}
              </div>
            </div>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Most automated car washes and volume detailers use harsh alkaline soaps and recycled, grit-filled water that micro-scratches your finish every cycle. At Szine Detailing, every single stage is controlled.
            </p>

            {/* Key Advantages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-mono font-bold text-cyan-400">// 01 ZERO-SCRATCH METHOD</span>
                <p className="text-xs text-neutral-400 mt-1">
                  Multi-bucket grit-guard washes, ultra-soft 1200 GSM microfiber, and high-lubricity snow foam.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-mono font-bold text-cyan-400">// 02 DEIONIZED RIG WATER</span>
                <p className="text-xs text-neutral-400 mt-1">
                  Filtered to 0 PPM total dissolved solids so water drops evaporate with zero mineral spots.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-mono font-bold text-cyan-400">// 03 RUPES POLISH SYSTEMS</span>
                <p className="text-xs text-neutral-400 mt-1">
                  Italian BigFoot random orbital polishers ensuring swirl-free, hologram-free optical clarity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-mono font-bold text-cyan-400">// 04 INFRARED CURING</span>
                <p className="text-xs text-neutral-400 mt-1">
                  Controlled temperature curing binds ceramic coatings deeply into clear coat micropores.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenWizard && onOpenWizard()}
                className="px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition active:scale-95 flex items-center gap-2"
              >
                <span>Request Custom Vehicle Consultation</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
