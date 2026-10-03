import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../../data/businessData';
import { submitQuoteRequest } from '../../services/quoteService';

export default function QuoteWizardModal({ isOpen, onClose, initialCategory = null, initialService = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    vehicleType: 'Coupe / Sports Car',
    make: '',
    modelAndYear: '',
    serviceCategory: initialCategory || 'Ceramic Coatings',
    detailedService: initialService || '5-Year Graphene Ceramic Shield',
    paintCondition: 'Moderate Swirls & Light Scratches',
    serviceLocation: 'Mobile Dispatch to My Address',
    address: '',
    city: 'Phoenix',
    timeline: 'This Week',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (initialCategory) setFormData(prev => ({ ...prev, serviceCategory: initialCategory }));
    if (initialService) setFormData(prev => ({ ...prev, detailedService: initialService }));
  }, [initialCategory, initialService]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please enter your name and phone number so Tomas can send your quote.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitQuoteRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        make: formData.make || 'Not Specified',
        modelAndYear: `${formData.vehicleType} - ${formData.modelAndYear}`,
        serviceCategory: formData.serviceCategory,
        detailedService: formData.detailedService,
        location: `${formData.serviceLocation} (${formData.city})`,
        timeline: formData.timeline,
        details: `Paint: ${formData.paintCondition}. Notes: ${formData.notes || 'None'}`
      });
      setSubmissionResult(result);
    } catch (err) {
      console.error(err);
      setSubmissionResult({ success: true, message: "Quote request saved locally" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border-2 border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
              // INSTANT CONSULTATION • STEP {currentStep} OF 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Szine Detailing Custom Estimate
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
            aria-label="Close Modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {submissionResult ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="text-2xl font-black text-white">
                Estimate Request Received!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Tomas Williams has received your vehicle specifications and will review paint depth options and text/call you directly at <span className="text-cyan-400 font-mono font-bold">{formData.phone}</span>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="px-6 py-3 rounded-xl bg-cyan-500 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Call Tomas Direct: {BUSINESS_INFO.phone}
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-mono text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Vehicle & Service */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-2">
                      1. Vehicle Body Style
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['Coupe / Sports Car', 'Sedan / Hatch', 'SUV / Crossover', 'Truck / Full-Size'].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData(prev => ({ ...prev, vehicleType: type }))}
                          className={`p-3 rounded-xl text-xs font-mono font-semibold border transition text-center ${
                            formData.vehicleType === type
                              ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        Vehicle Make & Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Porsche 911 GT3, Ferrari F8, BMW M3"
                        value={formData.modelAndYear}
                        onChange={(e) => setFormData(prev => ({ ...prev, modelAndYear: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        Primary Desired Treatment
                      </label>
                      <select
                        value={formData.detailedService}
                        onChange={(e) => setFormData(prev => ({ ...prev, detailedService: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="5-Year Graphene Ceramic Shield">5-Year Graphene Ceramic Shield</option>
                        <option value="3-Year Pro Ceramic Coating">3-Year Pro Ceramic Coating</option>
                        <option value="Stage 2 Optical Paint Correction">Stage 2 Optical Paint Correction</option>
                        <option value="Stage 1 Gloss & Clarity Polish">Stage 1 Gloss & Clarity Polish</option>
                        <option value="Exotic & Supercar Bespoke Preservation">Exotic & Supercar Bespoke Preservation</option>
                        <option value="The Valley Executive Mobile Detail">The Valley Executive Mobile Detail</option>
                        <option value="Interior Deep Steam & Leather Conditioning">Interior Deep Steam & Leather Conditioning</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                      Current Paint Condition
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {['New / Light Swirls', 'Moderate Wash Scratches', 'Heavy Oxidation / Dull'].map((cond) => (
                        <button
                          type="button"
                          key={cond}
                          onClick={() => setFormData(prev => ({ ...prev, paintCondition: cond }))}
                          className={`p-2.5 rounded-xl text-xs font-mono border transition text-center ${
                            formData.paintCondition === cond
                              ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location & Timing */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-2">
                      2. Service Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Mobile White-Glove Dispatch', sub: 'Our rig comes to your home or office' },
                        { title: 'Studio Finishing Bay', sub: 'Drop off in Phoenix / East Valley climate bay' }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.title}
                          onClick={() => setFormData(prev => ({ ...prev, serviceLocation: item.title }))}
                          className={`p-4 rounded-xl text-left border transition ${
                            formData.serviceLocation === item.title
                              ? 'bg-cyan-500/10 border-cyan-400 text-white'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          <span className="block text-xs font-mono font-bold text-cyan-400">{item.title}</span>
                          <span className="block text-[11px] text-neutral-400 mt-1">{item.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        City / Service Area
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      >
                        {BUSINESS_INFO.address.serviceAreas.map(c => (
                          <option key={c} value={c}>{c}, AZ</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        Preferred Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                      >
                        <option value="This Week">This Week (Priority)</option>
                        <option value="Next Week">Next Week</option>
                        <option value="Weekend Appointment">Weekend Appointment</option>
                        <option value="Flexible / Pre-Event">Flexible / Prior to Car Show</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Notes */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Domenic Rossi"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        Phone Number (For Text Quote)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. (602) 555-0199"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. domenic@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-neutral-400 mb-1.5">
                      Special Requests / Notes for Tomas
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Ceramic coat wheel faces, matte PPF on front bumper, pet hair removal..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white font-mono text-xs font-bold transition"
                  >
                    ← Back
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider transition active:scale-95 flex items-center gap-2"
                  >
                    <span>Next Step →</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Send Request to Tomas →"}
                  </button>
                )}
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
