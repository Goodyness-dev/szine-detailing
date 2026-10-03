import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';
import { IMAGE_MANIFEST } from '../../data/imageManifest';

const AMENITIES = [
  {
    num: "01",
    title: "100% Self-Contained Mobile Fleet",
    description: "Our mobile rigs bring commercial-grade pressure, ultra-quiet generator power, and 0 PPM spot-free water directly to your home or office."
  },
  {
    num: "02",
    title: "Climate-Controlled Coating Studio",
    description: "Multi-year ceramic cures in a dust-free, temperature-stabilized environment under full hexagonal 5,000K daylight LED arrays."
  },
  {
    num: "03",
    title: "Warranty Certification & Documentation",
    description: "Every 3-Year and 5-Year ceramic installation includes official warranty documentation to enhance and protect vehicle resale value."
  },
  {
    num: "04",
    title: "Transparent Digital Estimates",
    description: "No vague pricing or surprise upcharges. Accurate quotes sent via text or email before our polishers ever touch your paint."
  }
];

export default function AmenitiesSection({ onOpenWizard }) {
  return (
    <section id="amenities" className="py-20 lg:py-28 bg-neutral-950 text-white border-t border-neutral-900" aria-labelledby="amenities-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Studio Image */}
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-neutral-900 group">
              <img
                src={IMAGE_MANIFEST.ceramicCoating || "/images/ceramic-coating.jpg"}
                alt="Szine Detailing studio bay with exotic car"
                loading="lazy"
                className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  // EAST & WEST VALLEY DISPATCH
                </span>
                <p className="text-lg font-bold text-white">
                  White-Glove Mobile Rig or Studio Finishing
                </p>
              </div>
            </div>
          </div>

          {/* Right: Perks Grid */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                // 04 THE CLIENT EXPERIENCE
              </div>
              <h2 id="amenities-heading" className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                White-Glove Care from Intake to Delivery
              </h2>
              <p className="text-neutral-400 mt-3 text-base sm:text-lg leading-relaxed">
                Whether servicing your daily commuter, luxury family SUV, or weekend track weapon, experience an uncompromising level of professionalism.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AMENITIES.map((item) => (
                <div 
                  key={item.num}
                  className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-cyan-500/40 transition-all duration-300"
                >
                  <span className="text-xs font-mono font-black text-cyan-400 tracking-wider">
                    // {item.num}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenWizard && onOpenWizard()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase font-mono tracking-wider transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Schedule Your Detailing Session</span>
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
