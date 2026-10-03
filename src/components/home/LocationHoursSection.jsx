import React from 'react';
import { BUSINESS_INFO, isOpenNow } from '../../data/businessData';

export default function LocationHoursSection({ onOpenWizard }) {
  const shopOpen = isOpenNow();
  const currentDayIndex = new Date().getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = dayNames[currentDayIndex];
  const { serviceAreas, formatted } = BUSINESS_INFO.address;

  return (
    <section id="location" className="py-20 lg:py-28 bg-neutral-950 text-white border-t border-neutral-900" aria-labelledby="location-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            // 06 DISPATCH COVERAGE & HOURS
          </div>
          <h2 id="location-heading" className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Phoenix Metro & East Valley Mobile Service
          </h2>
          <p className="text-neutral-400 mt-3 text-base sm:text-lg leading-relaxed">
            Our fully-equipped mobile detailing rig comes directly to your home or office, alongside our climate-controlled ceramic coating studio bay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Hours & Status (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900/90 border-2 border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div>
              {/* Live Status Badge */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-neutral-800 mb-6">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${shopOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div>
                    <span className={`font-bold text-sm sm:text-base block ${shopOpen ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {shopOpen ? 'Accepting Dispatches & Bookings' : 'Closed for Field Work'}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">Today is {currentDayName}</span>
                  </div>
                </div>

                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold"
                >
                  Call Now
                </a>
              </div>

              {/* Hours Table */}
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Weekly Operating Schedule
              </h3>
              <div className="divide-y divide-neutral-800/80 text-xs sm:text-sm font-mono">
                {BUSINESS_INFO.hours.map((h) => {
                  const isToday = h.day.toLowerCase() === currentDayName.toLowerCase();
                  return (
                    <div
                      key={h.day}
                      className={`py-2.5 px-3 flex justify-between items-center rounded-xl transition ${
                        isToday ? 'bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20' : 'text-neutral-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {isToday && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                        {h.day}
                      </span>
                      <span>
                        {h.open === "Closed" ? "Closed" : `${h.open} – ${h.close}`}
                        {h.note && <span className="text-neutral-500 text-[10px] ml-1">({h.note})</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Service Areas Tag Cloud */}
              <div className="mt-6 pt-5 border-t border-neutral-800">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Direct Mobile Service Cities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {serviceAreas.map((city) => (
                    <span 
                      key={city}
                      className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300"
                    >
                      {city}, AZ
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Booking Trigger */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={() => onOpenWizard && onOpenWizard()}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Request Service at Your Address</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Map Preview (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900/90 border-2 border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="p-6 sm:p-7 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  // PHOENIX REGION DISPATCH
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Mobile Unit Dispatched Directly to You
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  {formatted}
                </p>
              </div>

              <a
                href={BUSINESS_INFO.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono font-bold flex items-center gap-2 transition"
              >
                <span>Google Maps</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Map Frame */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-neutral-950">
              <iframe
                title="Szine Detailing Phoenix Service Area Map"
                src={BUSINESS_INFO.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Footer Strip */}
            <div className="p-4 sm:p-5 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-neutral-400">
                Call/Text for Dispatch: <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="text-cyan-400 font-bold hover:underline">{BUSINESS_INFO.phone}</a>
              </span>
              <span className="text-neutral-400">
                Email: <span className="text-white">{BUSINESS_INFO.email}</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
