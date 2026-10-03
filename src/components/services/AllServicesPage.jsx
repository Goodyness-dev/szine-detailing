import React, { useState, useEffect } from 'react';
import { SERVICES, SERVICE_CATEGORIES } from '../../data/servicesData';
import { BUSINESS_INFO } from '../../data/businessData';

export default function AllServicesPage({ onOpenWizard, onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'All Services' || service.category === selectedCategory;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.subType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-neutral-950 text-white min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider mb-6 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
                // SERVICE CATALOG & SPECIFICATIONS
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                All Detailing & Coating Programs
              </h1>
              <p className="text-neutral-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                Explore our full spectrum of automotive optical restoration, Graphene & Ceramic coatings, and mobile white-glove maintenance packages.
              </p>
            </div>

            {/* Quick Consultation CTA */}
            <button
              onClick={() => onOpenWizard && onOpenWizard()}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider transition active:scale-95 shrink-0"
            >
              Get Custom Quote
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 pb-6 border-b border-neutral-900">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 flex-1">
            {SERVICE_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/20'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search treatments or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400 text-sm font-mono">No matching services found.</p>
            <button
              onClick={() => { setSelectedCategory('All Services'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 text-cyan-400 text-xs font-mono font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="p-7 rounded-3xl bg-neutral-900/90 border-2 border-neutral-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-md">
                      {service.category}
                    </span>
                    {service.warranty && (
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-bold">
                        {service.warranty}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400 mb-3">
                    // {service.subType}
                  </p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {service.description}
                  </p>

                  {service.features && (
                    <ul className="mt-4 space-y-2 pt-3 border-t border-neutral-800/80">
                      {service.features.map((feat, i) => (
                        <li key={i} className="text-xs text-neutral-400 flex items-start gap-2 font-sans">
                          <span className="text-cyan-400 text-sm leading-none">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => onOpenWizard && onOpenWizard(service.category, service.subType)}
                    className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-cyan-500 hover:text-neutral-950 text-white font-mono text-xs font-bold uppercase tracking-wider transition active:scale-95"
                  >
                    Select This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
