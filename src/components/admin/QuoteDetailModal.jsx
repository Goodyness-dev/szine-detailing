import React, { useState } from 'react';
import { 
  X, Phone, Mail, MapPin, Calendar, Clock, Truck, Bus, 
  CheckCircle2, Send, AlertCircle, Loader2, DollarSign, 
  ShieldCheck, Wrench, Trash2, ArrowUpRight, Check
} from 'lucide-react';
import { quotesApi } from '../../services/api';
import { BUSINESS_INFO } from '../../data/businessData';

export default function QuoteDetailModal({ quote, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('quote_studio'); // 'quote_studio' | 'full_details'
  const [status, setStatus] = useState(quote?.status || 'pending');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Quote Studio State
  const [price, setPrice] = useState(quote?.quotedPrice || '');
  const [turnaround, setTurnaround] = useState(quote?.estimatedTurnaround || 'Prompt scheduling / 24-48 hours');
  const [warranty, setWarranty] = useState(quote?.warrantyNote || '100% Workmanship & Parts Guarantee');
  const [message, setMessage] = useState(
    quote?.adminMessage || 
    (quote?.make
      ? `Hi ${quote?.name || 'Customer'}, thanks for reaching out to ${BUSINESS_INFO.name}! I reviewed your repair request for your ${quote?.make} ${quote?.modelAndYear || ''}. Give us a call at ${BUSINESS_INFO.phone} or reply here to confirm your appointment.`
      : `Hi ${quote?.name || 'Customer'}, thanks for reaching out to ${BUSINESS_INFO.name}! I reviewed your service request for "${quote?.serviceCategory || quote?.detailedService || 'your project'}". Give us a call at ${BUSINESS_INFO.phone} or reply here to confirm your appointment.`)
  );
  
  const [isSendingQuote, setIsSendingQuote] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!quote) return null;

  const handleStatusChange = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await quotesApi.updateStatus(quote.id, newStatus);
      setStatus(newStatus);
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendQuote = async (e) => {
    e.preventDefault();
    if (!price.trim()) {
      setSendError('Please enter a quote price before sending.');
      return;
    }

    setIsSendingQuote(true);
    setSendError('');
    setSendSuccess(false);

    try {
      const result = await quotesApi.sendQuote(quote.id, {
        price,
        turnaround,
        warranty,
        message
      });

      setSendSuccess(true);
      setStatus('quoted');
      if (onUpdate && result.quote) {
        onUpdate(result.quote);
      }
    } catch (err) {
      setSendError(err.data?.error || err.message || 'Failed to send quote email.');
    } finally {
      setIsSendingQuote(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete Quote #${quote.id}?`)) return;
    setIsDeleting(true);
    try {
      await quotesApi.deleteQuote(quote.id);
      if (onUpdate) onUpdate({ ...quote, _deleted: true });
      onClose();
    } catch (err) {
      alert('Error deleting quote: ' + err.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                  #{quote.id}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(quote.createdAt).toLocaleDateString()} at {new Date(quote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {quote.name} — {quote.make} {quote.modelAndYear}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Status Selector */}
            <select
              value={status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition outline-none cursor-pointer ${
                status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                status === 'quoted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <option value="pending">⏳ Pending (Needs Quote)</option>
              <option value="in_review">🔍 In Review</option>
              <option value="quoted">📧 Quoted (Sent to Customer)</option>
              <option value="completed">✅ Completed Repair</option>
              <option value="archived">📦 Archived</option>
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Contact & Info Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <a 
            href={`tel:${quote.phone?.replace(/[^0-9]/g, '')}`}
            className="flex items-center space-x-1.5 hover:text-slate-900 text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            <Phone className="w-3.5 h-3.5 text-red-600" />
            <span className="font-semibold">{quote.phone || 'No Phone'}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          <a 
            href={`mailto:${quote.email}`}
            className="flex items-center space-x-1.5 hover:text-slate-900 text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition"
          >
            <Mail className="w-3.5 h-3.5 text-red-600" />
            <span className="font-semibold">{quote.email}</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </a>

          {quote.location && (
            <div className="flex items-center space-x-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{quote.location}</span>
            </div>
          )}

          {quote.needsTowing && (
            <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center space-x-1">
              <Truck className="w-3 h-3" />
              <span>Towing Needed</span>
            </span>
          )}

          {quote.needsShuttle && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center space-x-1">
              <Bus className="w-3 h-3" />
              <span>Shuttle Requested</span>
            </span>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setActiveTab('quote_studio')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'quote_studio'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4 text-red-600" />
            <span>Send Quote to Customer</span>
          </button>
          <button
            onClick={() => setActiveTab('full_details')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'full_details'
                ? 'border-shop-red text-shop-red'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>{quote.make ? 'Full Vehicle & Issue Specs' : 'Full Service & Issue Specs'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/40">
          {activeTab === 'quote_studio' ? (
            /* TAB 1: Quote Dispatch Studio */
            <div className="space-y-6">
              {/* Previous Quote Alert Banner */}
              {quote.quotedPrice && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start space-x-3 text-xs sm:text-sm text-blue-800 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-900">Previous Quote Sent on {quote.quoteSentAt ? new Date(quote.quoteSentAt).toLocaleString() : 'N/A'}</div>
                    <div>Price: <strong className="text-blue-900 font-mono">${quote.quotedPrice}</strong> • Turnaround: {quote.estimatedTurnaround || 'N/A'}</div>
                    <div className="text-blue-600 text-xs mt-1">You can update the pricing below and re-send anytime.</div>
                  </div>
                </div>
              )}

              {/* Success Banner */}
              {sendSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-3 shadow-xs animate-fade-in">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block text-emerald-900 font-bold">Quote Successfully Dispatched to {quote.email}!</strong>
                    <span>An official branded breakdown email with your estimate has been delivered to the customer.</span>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {sendError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              <form onSubmit={handleSendQuote} className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                {/* Price & Turnaround Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Total Quoted Price ($ USD) <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="e.g. 450.00"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-base text-slate-900 placeholder-slate-400 outline-none font-bold font-mono transition"
                        required
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Includes parts, diagnostics, and shop labor.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Estimated Turnaround Time
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={turnaround}
                        onChange={(e) => setTurnaround(e.target.value)}
                        placeholder="e.g. Same Day (ready by 4:30 PM) or 1-2 Days"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Tells customer when vehicle will be ready.</span>
                  </div>
                </div>

                {/* Warranty Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Warranty & Guarantee Coverage
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      placeholder="e.g. 12-month / 12,000-mile parts & labor warranty"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition"
                    />
                  </div>
                </div>

                {/* Personal Message / Note to Customer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {BUSINESS_INFO.owner?.name ? `${BUSINESS_INFO.owner.name}'s Note to Customer` : 'Direct Message to Customer'}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a custom explanation, recommendations, or deposit instructions..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-shop-red focus:bg-white rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 outline-none leading-relaxed transition"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    This message is prominently highlighted in the customer's quote email.
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Recipient: <strong className="text-slate-800">{quote.email}</strong>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingQuote}
                    className="w-full sm:w-auto py-3 px-6 bg-shop-red hover:bg-shop-redHover disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-shop-red/20 flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                  >
                    {isSendingQuote ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Quote Email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Official Quote to Customer</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* TAB 2: Full Details */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request / Vehicle Specs */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {quote.make ? 'Vehicle Specifications' : 'Service & Property Details'}
                  </span>
                  {quote.make ? (
                    <>
                      <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Make:</span>
                        <span className="text-slate-900 font-bold">{quote.make}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Model & Year:</span>
                        <span className="text-slate-900 font-bold">{quote.modelAndYear}</span>
                      </div>
                      {quote.engineType && (
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Engine Type:</span>
                          <span className="text-shop-red font-bold">{quote.engineType}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {quote.propertyType && (
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Property / Location:</span>
                          <span className="text-slate-900 font-bold">{quote.propertyType}</span>
                        </div>
                      )}
                      {quote.modelAndYear && (
                        <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                          <span className="text-slate-500">Item / Equipment:</span>
                          <span className="text-slate-900 font-bold">{quote.modelAndYear}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Timeline:</span>
                    <span className="text-slate-900 font-medium">{quote.timeline || 'Prompt'} {quote.specificDate ? `(${quote.specificDate})` : ''}</span>
                  </div>
                </div>

                {/* Service Specs */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Service Requested</span>
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-900 font-bold">{quote.serviceCategory}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Detailed Service:</span>
                    <span className="text-slate-900 font-bold">{quote.detailedService}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Towing Needed:</span>
                    <span className={quote.needsTowing ? 'text-red-600 font-bold' : 'text-slate-500'}>
                      {quote.needsTowing ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shuttle Ride:</span>
                    <span className={quote.needsShuttle ? 'text-amber-600 font-bold' : 'text-slate-500'}>
                      {quote.needsShuttle ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              {quote.details && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 shadow-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customer Symptoms & Notes</span>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{quote.details}</p>
                </div>
              )}

              {/* Custom Issue Description if applicable */}
              {quote.customIssue && quote.customIssue !== 'N/A' && (
                <div className="bg-red-50/50 border border-red-200 rounded-2xl p-5 space-y-2">
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">Custom Issue Explanation</span>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{quote.customIssue}</p>
                </div>
              )}

              {/* Delete Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition flex items-center space-x-1.5 border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete Quote'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
