import React, { useState, useEffect } from 'react';
import { 
  Search, RefreshCw, Plus, Clock, CheckCircle2, 
  Send, AlertCircle, Phone, Mail, ArrowUpRight, 
  Filter, ChevronRight, Truck, Bus, Wrench, Loader2
} from 'lucide-react';
import { quotesApi } from '../../services/api';
import QuoteDetailModal from './QuoteDetailModal';
import NewOrderModal from './NewOrderModal';

export default function OrdersView() {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, quoted: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  useEffect(() => {
    loadData();
    // Auto-poll every 12 seconds for real-time order synchronization
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadData = async () => {
    try {
      const [quotesRes, statsRes] = await Promise.all([
        quotesApi.getQuotes({ status: statusFilter, search: searchTerm }),
        quotesApi.getStats()
      ]);
      setQuotes(quotesRes.quotes || []);
      setStats(statsRes || { total: 0, pending: 0, quoted: 0, completed: 0 });
    } catch (err) {
      console.warn('Error fetching quotes from backend (checking localStorage fallback):', err);
      try {
        const local = JSON.parse(localStorage.getItem('biz_quotes') || localStorage.getItem('tobys_quotes') || '[]');
        setQuotes(local);
        setStats({
          total: local.length,
          pending: local.filter(q => q.status === 'pending' || !q.status).length,
          quoted: local.filter(q => q.status === 'quoted').length,
          completed: local.filter(q => q.status === 'completed').length
        });
      } catch (e) {
        console.error(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleQuoteUpdated = (updatedQuote) => {
    if (updatedQuote._deleted) {
      setQuotes(prev => prev.filter(q => q.id !== updatedQuote.id));
    } else {
      setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
    }
    // Refresh stats
    quotesApi.getStats().then(setStats).catch(() => {});
  };

  const handleNewOrderCreated = (newQuote) => {
    setQuotes(prev => [newQuote, ...prev]);
    quotesApi.getStats().then(setStats).catch(() => {});
  };

  const filteredQuotes = quotes.filter(q => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (q.name && q.name.toLowerCase().includes(term)) ||
      (q.email && q.email.toLowerCase().includes(term)) ||
      (q.phone && q.phone.includes(term)) ||
      (q.make && q.make.toLowerCase().includes(term)) ||
      (q.modelAndYear && q.modelAndYear.toLowerCase().includes(term)) ||
      (q.detailedService && q.detailedService.toLowerCase().includes(term)) ||
      (q.id && q.id.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Quotes */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Requests</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-slate-900">{stats.total}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">All incoming quote orders</span>
        </div>

        {/* Pending Awaiting Quote */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Quote</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-amber-600">{stats.pending}</div>
          <span className="text-[11px] text-amber-600/80 mt-1 block font-medium">Needs shop price response</span>
        </div>

        {/* Quoted */}
        <div className="bg-white border border-blue-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-blue-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Quotes Sent</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-blue-600">{stats.quoted}</div>
          <span className="text-[11px] text-blue-600/80 mt-1 block font-medium">Estimate emailed to customer</span>
        </div>

        {/* Completed */}
        <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-emerald-600">{stats.completed}</div>
          <span className="text-[11px] text-emerald-600/80 mt-1 block font-medium">Vehicle serviced & closed</span>
        </div>
      </div>

      {/* Control Bar: Search, Filter Tabs, Action CTAs */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, vehicle, service, or #ID..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition"
            />
          </form>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setIsLoading(true); loadData(); }}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Refresh Quotes"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-red-600' : ''}`} />
            </button>

            <button
              onClick={() => setIsNewOrderOpen(true)}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-red-600/20 flex items-center space-x-1.5 active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Walk-In / Call</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: stats.total },
            { id: 'pending', label: '⏳ Needs Quote', count: stats.pending },
            { id: 'quoted', label: '📧 Quoted', count: stats.quoted },
            { id: 'completed', label: '✅ Completed', count: stats.completed },
            { id: 'archived', label: '📦 Archived' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
                statusFilter === tab.id
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/25'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  statusFilter === tab.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200/80 rounded-2xl text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="text-sm font-medium">Retrieving quote requests from database...</span>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white border border-slate-200/80 rounded-2xl text-slate-500 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Quote Requests Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm ? 'No results matched your search term.' : 'When customers submit quote requests on the website, they will appear here in real-time.'}
          </p>
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a manual quote entry</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Quote ID / Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Quote ($)</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((q) => {
                  const status = q.status || 'pending';
                  return (
                    <tr 
                      key={q.id}
                      onClick={() => setSelectedQuote(q)}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-red-600 text-xs block">#{q.id}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(q.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{q.name}</div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          {q.phone && <span>{q.phone}</span>}
                          {q.phone && q.email && <span>•</span>}
                          <span className="truncate max-w-[140px]">{q.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{q.make}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{q.modelAndYear}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium">{q.detailedService || q.serviceCategory}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {q.needsTowing && (
                            <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-bold">
                              Towing
                            </span>
                          )}
                          {q.needsShuttle && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-bold">
                              Shuttle
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          status === 'quoted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {status === 'pending' ? '⏳ Pending' :
                           status === 'quoted' ? '📧 Quoted' :
                           status === 'completed' ? '✅ Completed' : '📦 Archived'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        {q.quotedPrice ? (
                          <span className="text-emerald-600">${q.quotedPrice}</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuote(q);
                          }}
                          className="py-1.5 px-3.5 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-slate-200 text-xs font-bold transition text-slate-700"
                        >
                          {status === 'pending' ? 'Review & Quote' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block md:hidden divide-y divide-slate-100">
            {filteredQuotes.map((q) => {
              const status = q.status || 'pending';
              return (
                <div 
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className="p-4 active:bg-slate-50 transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-red-600 text-xs">#{q.id}</span>
                      <h4 className="font-bold text-slate-900 text-base mt-0.5">{q.name}</h4>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      status === 'quoted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {status === 'pending' ? 'Pending' : status === 'quoted' ? 'Quoted' : status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <strong className="text-slate-900">{q.make}</strong> • {q.modelAndYear}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span>{q.detailedService || q.serviceCategory}</span>
                    {q.quotedPrice ? (
                      <span className="font-mono font-bold text-emerald-600">${q.quotedPrice}</span>
                    ) : (
                      <span className="text-slate-400">Not quoted yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdate={handleQuoteUpdated}
        />
      )}

      {/* New Manual Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreated={handleNewOrderCreated}
      />
    </div>
  );
}
