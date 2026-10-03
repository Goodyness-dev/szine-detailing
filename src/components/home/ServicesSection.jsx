import React, { useState } from 'react';
import { SERVICES } from '../../data/servicesData';
import { BUSINESS_INFO } from '../../data/businessData';
import { IMAGE_MANIFEST } from '../../data/imageManifest';

const SERVICE_IMAGE_MAP = {
  "ceramic-coating-5yr": IMAGE_MANIFEST.ceramicCoating || "/images/ceramic-coating.jpg",
  "ceramic-coating-3yr": IMAGE_MANIFEST.heroPoster || "/images/hero-poster.jpg",
  "stage-2-paint-correction": IMAGE_MANIFEST.paintCorrection || "/images/paint-correction.jpg",
  "stage-1-gloss-enhancement": IMAGE_MANIFEST.paintCorrection || "/images/paint-correction.jpg",
  "supercar-preservation": IMAGE_MANIFEST.heroPoster || "/images/hero-poster.jpg",
  "signature-mobile-detail": IMAGE_MANIFEST.heroPoster || "/images/hero-poster.jpg",
  "interior-spa-steam-leather": IMAGE_MANIFEST.interiorDetail || "/images/interior-detail.jpg"
};

export default function ServicesSection({ onOpenWizard, onViewAllServices }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Ceramic Coatings", "Paint Correction", "Exotics & Collector", "Interior Restoration"];

  const filteredServices = activeCategory === "All" 
    ? SERVICES.slice(0, 6)
    : SERVICES.filter(s => s.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <section id="services" className="py-20 lg:py-28 bg-neutral-950 text-white transition-colors border-t border-neutral-900" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              // 02 APEX SERVICES
            </div>
            <h2 id="services-heading" className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
              Ceramic Coatings & Paint Correction
            </h2>
            <p className="text-neutral-400 mt-3 text-base sm:text-lg max-w-2xl leading-relaxed">
              Engineered for extreme Arizona heat, relentless UV exposure, and swirl-free optical clarity. Every vehicle treated as a showcase piece.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition active:scale-95 ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {filteredServices.map((service, index) => {
            const cardImg = SERVICE_IMAGE_MAP[service.id] || IMAGE_MANIFEST.heroPoster;

            return (
              <article
                key={service.id}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900/90 border-2 border-neutral-800/90 hover:border-cyan-500/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Header with Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={cardImg}
                    alt={`${service.title} - ${BUSINESS_INFO.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                  {/* Category & Warranty Tags */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-neutral-700 text-cyan-300 text-[11px] font-mono font-bold uppercase">
                      {service.category}
                    </span>
                    {service.warranty && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold">
                        {service.warranty}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1 mb-3">
                      // {service.subType}
                    </p>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features list */}
                    {service.features && (
                      <ul className="mt-4 space-y-2 pt-3 border-t border-neutral-800">
                        {service.features.map((feat, i) => (
                          <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                            <svg className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action CTA */}
                  <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => onOpenWizard && onOpenWizard(service.category, service.subType)}
                      className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-white font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition active:scale-95 border border-neutral-700 hover:border-transparent"
                    >
                      <span>Inquire / Get Quote</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

        {/* 50/50 Paint Correction Showcase Banner */}
        <div className="rounded-3xl border-2 border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900 to-black p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
                // OPTICAL LABORATORY PRECISION
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Why Arizona Heat Destroys Factory Paint
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Phoenix summer surface temps exceed 165°F on dark paint. Standard wax evaporates in 72 hours, leaving clear coat vulnerable to UV oxidation, mineral sprinkler etching, and abrasive haboob dust storms.
              </p>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Szine Detailing's ceramic matrix bonds at the molecular level, creating a permanent 10H sacrificial ceramic shield that never melts, beads water effortlessly, and preserves your vehicle's resale value.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onOpenWizard && onOpenWizard("Ceramic Coatings", "5-Year Graphene Ceramic Shield")}
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase font-mono tracking-wider transition active:scale-95 flex items-center gap-2"
                >
                  <span>Shield Your Paint Today</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs uppercase font-bold border border-neutral-700 transition active:scale-95 flex items-center gap-2"
                >
                  <span>Speak with Tomas: {BUSINESS_INFO.phone}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl">
              <img
                src={IMAGE_MANIFEST.paintCorrection || "/images/paint-correction.jpg"}
                alt="50 50 paint correction comparison"
                className="w-full h-72 sm:h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white uppercase">
                Swirl Damaged
              </div>
              <div className="absolute top-3 right-3 bg-emerald-500/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono font-bold text-white uppercase">
                Corrected Mirror Gloss
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-2.5 rounded-lg text-center text-xs text-neutral-300 font-mono">
                50/50 Multi-Stage Machine Polish by Szine Detailing
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
