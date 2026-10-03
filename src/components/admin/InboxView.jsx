import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Send, Phone, Mail, Clock, CheckCircle2, 
  Wrench, Truck, Bus, DollarSign, ArrowUpRight, 
  Loader2, MessageSquare, AlertCircle, User, ShieldCheck, ChevronRight
} from 'lucide-react';
import { quotesApi } from '../../services/api';
import { BUSINESS_INFO } from '../../data/businessData';

export default function InboxView({ onOpenFullQuote }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Reply Composer State
  const [replyText, setReplyText] = useState('');
  const [attachPrice, setAttachPrice] = useState(false);
  const [quotePrice, setQuotePrice] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadThreads();
    const interval = setInterval(loadThreads, 10000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadThreads = async () => {
    try {
      const res = await quotesApi.getInbox({ status: statusFilter, search: searchTerm });
      const threadList = res.threads || [];
      setThreads(threadList);

      // Default select first thread if none selected
      if (!selectedThread && threadList.length > 0) {
        selectThread(threadList[0]);
      } else if (selectedThread) {
        // Keep updated thread in sync
        const updated = threadList.find(t => t.id === selectedThread.id);
        if (updated) setSelectedThread(updated);
      }
    } catch (err) {
      console.warn('Error loading inbox threads:', err);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const selectThread = async (thread) => {
    setSelectedThread(thread);
    setIsLoadingMessages(true);
    setSendError('');
    try {
      const res = await quotesApi.getMessages(thread.id);
      setMessages(res.messages || []);
      scrollToBottom();
    } catch (err) {
      console.error('Error loading messages for thread:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!replyText.trim() && !quotePrice.trim()) return;

    setIsSending(true);
    setSendError('');

    try {
      const res = await quotesApi.sendMessage(selectedThread.id, {
        message: replyText.trim(),
        quotePrice: attachPrice && quotePrice ? quotePrice.trim() : null
      });

      if (res.message) {
        setMessages(prev => [...prev, res.message]);
        setReplyText('');
        if (attachPrice) {
          setQuotePrice('');
          setAttachPrice(false);
        }
        scrollToBottom();
        // Refresh threads list
        loadThreads();
      }
    } catch (err) {
      setSendError(err.data?.error || err.message || 'Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedThread) return;
    try {
      const updated = await quotesApi.updateStatus(selectedThread.id, newStatus);
      setSelectedThread(prev => ({ ...prev, status: newStatus }));
      setThreads(prev => prev.map(t => t.id === selectedThread.id ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredThreads = threads.filter(t => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      t.name?.toLowerCase().includes(s) ||
      t.email?.toLowerCase().includes(s) ||
      t.make?.toLowerCase().includes(s) ||
      t.modelAndYear?.toLowerCase().includes(s) ||
      t.id?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs flex flex-col md:flex-row h-[80vh] min-h-[580px]">
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANE: CONVERSATION LIST                                  */}
      {/* ------------------------------------------------------------- */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-white ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        {/* Search & Header */}
        <div className="p-4 border-b border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <h2 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900">
                Orders & Messages
              </h2>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {threads.length} orders
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, car, or #ID..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
            {['all', 'pending', 'quoted', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2.5 py-1 rounded-lg font-bold transition capitalize ${
                  statusFilter === f
                    ? 'bg-red-600 text-white shadow-xs shadow-red-600/20'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoadingThreads ? (
            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center space-y-2">
              <Loader2 className="w-5 h-5 animate-spin text-red-600" />
              <span>Loading messages...</span>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No orders found in inbox.
            </div>
          ) : (
            filteredThreads.map(thread => {
              const isSelected = selectedThread?.id === thread.id;
              const status = thread.status || 'pending';
              const initials = (thread.name || 'C')
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={thread.id}
                  onClick={() => selectThread(thread)}
                  className={`p-3.5 cursor-pointer transition flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-red-50/70 border-l-4 border-l-red-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Initials Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                        {thread.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {new Date(thread.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {thread.make} {thread.modelAndYear}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {thread.lastMessage ? thread.lastMessage.preview : (thread.detailedService || thread.serviceCategory)}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        status === 'quoted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {status === 'pending' ? 'Needs Quote' : status === 'quoted' ? 'Quoted' : status}
                      </span>

                      {thread.quotedPrice && (
                        <span className="font-mono text-[11px] font-bold text-emerald-600">
                          ${thread.quotedPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANE: ACTIVE THREAD & COMPOSER                          */}
      {/* ------------------------------------------------------------- */}
      {selectedThread ? (
        <div className="flex-1 flex flex-col bg-slate-50/60">
          {/* Thread Header */}
          <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
            {/* Back button for mobile */}
            <button
              onClick={() => setSelectedThread(null)}
              className="md:hidden text-xs text-slate-500 hover:text-slate-900 flex items-center space-x-1"
            >
              <span>← Back</span>
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-slate-900">
                  {selectedThread.name}
                </h3>
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  #{selectedThread.id}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="font-medium text-slate-700">{selectedThread.make} ({selectedThread.modelAndYear})</span>
                <span>•</span>
                <a href={`tel:${selectedThread.phone?.replace(/[^0-9]/g, '')}`} className="text-red-600 hover:underline flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{selectedThread.phone || 'No phone'}</span>
                </a>
                <span>•</span>
                <span className="truncate max-w-[180px]">{selectedThread.email}</span>
              </div>
            </div>

            {/* Status Control */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedThread.status || 'pending'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 outline-none cursor-pointer hover:border-slate-300 transition"
              >
                <option value="pending">⏳ Pending (Needs Quote)</option>
                <option value="in_review">🔍 In Review</option>
                <option value="quoted">📧 Quoted</option>
                <option value="completed">✅ Completed</option>
                <option value="archived">📦 Archived</option>
              </select>

              {onOpenFullQuote && (
                <button
                  onClick={() => onOpenFullQuote(selectedThread)}
                  className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-xs shadow-red-600/20"
                >
                  Quote Studio
                </button>
              )}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Customer Inquiry Summary Banner Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-700 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-red-600" />
                  <span>Customer Request Details</span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal">
                  {new Date(selectedThread.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Service</span>
                  <span className="text-slate-900 font-medium">{selectedThread.detailedService || selectedThread.serviceCategory}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Timeline</span>
                  <span className="text-slate-900 font-medium">{selectedThread.timeline} {selectedThread.specificDate ? `(${selectedThread.specificDate})` : ''}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span className="text-slate-900 font-medium">{selectedThread.location || 'Casa Grande area'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {selectedThread.needsTowing && (
                  <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Towing Needed</span>
                  </span>
                )}
                {selectedThread.needsShuttle && (
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1">
                    <Bus className="w-3 h-3" />
                    <span>Shuttle Requested</span>
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Messages */}
            {isLoadingMessages ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center space-y-2">
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                <span>Loading messages...</span>
              </div>
            ) : (
              messages.map(msg => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700">{isAdmin ? (msg.senderName || BUSINESS_INFO.owner?.name || BUSINESS_INFO.name) : selectedThread.name}</span>
                      <span>•</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className={`max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isAdmin
                        ? 'bg-shop-red text-white rounded-tr-xs shadow-md shadow-shop-red/15'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                    }`}>
                      {msg.isQuote && (
                        <div className={`inline-flex items-center space-x-1.5 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 ${
                          isAdmin ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <DollarSign className="w-3 h-3" />
                          <span>Official Quote Attached</span>
                        </div>
                      )}
                      <p>{msg.message}</p>
                    </div>

                    <span className="text-[10px] text-slate-400 px-1 mt-1">
                      {isAdmin ? `Delivered via Email to ${selectedThread.email}` : 'Received via Website'}
                    </span>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Composer Bar */}
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            {sendError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            {/* Quick Price Quote Tool Toggle */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-600 hover:text-slate-900 transition">
                <input
                  type="checkbox"
                  checked={attachPrice}
                  onChange={(e) => setAttachPrice(e.target.checked)}
                  className="rounded bg-slate-100 border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span className="font-bold flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Attach Official Quote Price ($)</span>
                </span>
              </label>

              {attachPrice && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-500 font-bold">$</span>
                  <input
                    type="text"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="e.g. 350.00"
                    className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-mono font-bold outline-none focus:border-red-600 focus:bg-white"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Composer Input Form */}
            <form onSubmit={handleSendReply} className="flex items-end space-x-2">
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSendReply(e);
                  }
                }}
                placeholder={`Reply to ${selectedThread.name}... (Press Ctrl+Enter to send)`}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-2xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none resize-none leading-relaxed transition"
              />

              <button
                type="submit"
                disabled={isSending || (!replyText.trim() && !quotePrice.trim())}
                className="py-3 px-5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-red-600/20 flex items-center space-x-2 shrink-0 active:scale-95 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Customer receives your reply directly in their email inbox.</span>
              <span className="hidden sm:inline font-mono">Ctrl + Enter to send</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 space-y-2 bg-slate-50/50">
          <MessageSquare className="w-10 h-10 text-slate-300" />
          <h4 className="text-sm font-bold text-slate-800">No Order Selected</h4>
          <p className="text-xs max-w-xs text-center text-slate-500">
            Pick an order from the list on the left to read customer details and send direct replies.
          </p>
        </div>
      )}
    </div>
  );
}
