import React from 'react';
import { BUSINESS_INFO } from '../../data/businessData';

export default function ReviewsSection({ onOpenWizard }) {
  const { reviews, stats, instagram } = BUSINESS_INFO;

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-neutral-900/40 text-white border-t border-neutral-900" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            // 05 SOCIAL PROOF & REPUTATION
          </div>
          <h2 id="reviews-heading" className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Over 300+ 5-Star Vehicle Transformations
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 text-sm sm:text-base">
            <div className="flex text-amber-400 text-lg">
              {'★★★★★'.split('').map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="font-bold text-white">5.0 Star Rating</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-300">Google Verified</span>
            <span className="text-neutral-500">•</span>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-mono font-medium underline underline-offset-4"
            >
              Follow 42.2K Community on Instagram
            </a>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((rev, idx) => (
            <article
              key={idx}
              className="bg-neutral-900/90 border-2 border-neutral-800 hover:border-cyan-500/40 rounded-3xl p-7 sm:p-9 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Stars + Vehicle Tag + Source */}
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <div className="flex text-amber-400 text-sm">
                    {'★★★★★'.split('').map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.vehicle && (
                      <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-md">
                        {rev.vehicle}
                      </span>
                    )}
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-2.5 py-0.5 rounded-md">
                      {rev.source}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-neutral-200 text-sm sm:text-base leading-relaxed mb-6 italic font-medium">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <span>{rev.author}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Verified Customer" />
                  </h3>
                  <span className="text-neutral-400 text-xs font-mono">{rev.location}</span>
                </div>
                <span className="text-neutral-400 text-xs font-mono">{rev.date}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Instagram Reel Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-white text-base">Watch Daily Transformations & Behind-The-Scenes</p>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">Over 29,600 detailing posts on Instagram @szinedetailing</p>
            </div>
          </div>

          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider border border-neutral-700 transition active:scale-95 shrink-0"
          >
            Open @szinedetailing →
          </a>
        </div>

      </div>
    </section>
  );
}
