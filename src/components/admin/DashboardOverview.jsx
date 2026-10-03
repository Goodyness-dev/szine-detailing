import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, Plus, Clock, CheckCircle2, 
  Wrench, Send, Truck, Bus, Calendar, 
  Play, Pause, RotateCcw, ChevronRight, Phone, Mail, User
} from 'lucide-react';
import { quotesApi } from '../../services/api';

export default function DashboardOverview({ onNavigateTab, onSelectQuote, onOpenNewOrder }) {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, quoted: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Shop Live Timer State (Like the Time Tracker widget in the reference)
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08 initial
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadData = async () => {
    try {
      const [quotesRes, statsRes] = await Promise.all([
        quotesApi.getQuotes({ limit: 10 }),
        quotesApi.getStats()
      ]);
      setQuotes(quotesRes.quotes || []);
      setStats(statsRes || { total: 0, pending: 0, quoted: 0, completed: 0 });
    } catch (err) {
      console.warn('Dashboard load note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const urgentOrder = quotes.find(q => q.status === 'pending') || quotes[0];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* HEADER: Title & Quick Actions                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Plan, prioritize, and manage customer repair orders with ease.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenNewOrder}
            className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-red-600/20 flex items-center space-x-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Order</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm active:scale-95"
          >
            All Orders Table
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4 STAT CARDS (Card 1: Solid Red Hero, Cards 2-4: Clean White)  */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Solid Shop Red Fill (Matches Donezo Hero Card) */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 shadow-lg shadow-red-600/20 cursor-pointer transition hover:scale-[1.01] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Total Repair Orders</span>
            <div className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl font-black font-heading tracking-tight">{stats.total}</div>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-red-100 bg-white/15 px-2.5 py-1 rounded-full w-max font-medium">
            <span>↑ 14%</span>
            <span>increased from last month</span>
          </div>
        </div>

        {/* Card 2: Completed Repairs (White Card) */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Jobs</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl font-black font-heading text-slate-900">{stats.completed}</div>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full w-max font-medium">
            <span>✓ 100%</span>
            <span>on-time customer pickup</span>
          </div>
        </div>

        {/* Card 3: Quotes Sent (White Card) */}
        <div 
          onClick={() => onNavigateTab('inbox')}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quotes Sent</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition">
              <ArrowUpRight className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl font-black font-heading text-slate-900">{stats.quoted}</div>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full w-max font-medium">
            <span>📧 In discussion</span>
            <span>with customers</span>
          </div>
        </div>

        {/* Card 4: Pending Needs Quote (White Card with Red Accent) */}
        <div 
          onClick={() => onNavigateTab('inbox')}
          className="bg-white border border-shop-border rounded-3xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-shop-red">Pending Quotes</span>
            <div className="w-8 h-8 rounded-full border border-shop-border bg-shop-light flex items-center justify-center hover:opacity-80 transition">
              <ArrowUpRight className="w-4 h-4 text-shop-red" />
            </div>
          </div>
          <div className="my-4">
            <div className="text-4xl font-black font-heading text-shop-red">{stats.pending}</div>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full w-max font-medium">
            <span>⏳ Needs Price</span>
            <span>awaiting shop response</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECOND ROW: Weekly Analytics + Active Bay Reminder + Quick Projects */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Weekly Repair Volume (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900">
              Shop Repair Analytics
            </h3>
            <span className="text-xs text-slate-400 font-bold">This Week</span>
          </div>

          {/* Bar Chart Visual (Matching reference pill bar graph) */}
          <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
            {[
              { day: 'S', height: '45%', count: 3, solid: false },
              { day: 'M', height: '80%', count: 8, solid: true },
              { day: 'T', height: '65%', count: 6, solid: true, highlight: '34%' },
              { day: 'W', height: '95%', count: 11, solid: true },
              { day: 'T', height: '55%', count: 5, solid: false },
              { day: 'F', height: '70%', count: 7, solid: false },
              { day: 'S', height: '35%', count: 2, solid: false }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {bar.highlight && (
                  <span className="absolute -top-7 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full shadow-xs">
                    {bar.highlight}
                  </span>
                )}
                <div 
                  className={`w-full max-w-[36px] rounded-full transition-all duration-300 ${
                    bar.solid 
                      ? 'bg-gradient-to-t from-red-700 to-red-500 shadow-sm' 
                      : 'bg-slate-100 border border-slate-200/80'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-[11px] font-bold text-slate-400 mt-2">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-100 mt-2 text-xs">
            <span className="flex items-center space-x-2 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Completed Jobs</span>
            </span>
            <span className="flex items-center space-x-2 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span>In Queue</span>
            </span>
          </div>
        </div>

        {/* Middle: Priority Bay Reminder (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              <span>Priority Bay</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>

            {urgentOrder ? (
              <div className="space-y-2">
                <h4 className="text-base font-black font-heading text-slate-900 leading-tight">
                  {urgentOrder.make} {urgentOrder.modelAndYear}
                </h4>
                <div className="text-xs text-red-600 font-bold">
                  {urgentOrder.detailedService || urgentOrder.serviceCategory}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {urgentOrder.details || urgentOrder.customIssue || 'Customer requested service estimate.'}
                </p>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline: {urgentOrder.timeline || 'ASAP'}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-6">No priority orders currently waiting.</div>
            )}
          </div>

          <button
            onClick={() => urgentOrder && onSelectQuote(urgentOrder)}
            className="w-full mt-4 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-red-600/20 flex items-center justify-center space-x-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Open Work Order</span>
          </button>
        </div>

        {/* Right: Quick Recent Orders List (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900">
              Active Orders
            </h3>
            <button
              onClick={onOpenNewOrder}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-lg"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {quotes.slice(0, 4).map(q => (
              <div 
                key={q.id}
                onClick={() => onSelectQuote(q)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 -mx-2 transition cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {q.make} {q.modelAndYear}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {q.name} • {q.detailedService || q.serviceCategory}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  q.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  q.status === 'quoted' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  q.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {q.status || 'Pending'}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="w-full text-center text-xs font-bold text-red-600 hover:text-red-700 pt-3 border-t border-slate-100 mt-2 flex items-center justify-center space-x-1"
          >
            <span>View all {quotes.length} repair orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THIRD ROW: Customer Inquiries + Progress Arc + Live Bay Timer */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customer Inquiries (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900">
              Customer Leads & Quotes
            </h3>
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-bold text-slate-600 hover:text-red-600 flex items-center space-x-1 border border-slate-200 px-2.5 py-1 rounded-xl"
            >
              <span>Open Inbox</span>
            </button>
          </div>

          <div className="space-y-3">
            {quotes.slice(0, 4).map(q => {
              const initials = (q.name || 'Customer').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div 
                  key={q.id}
                  onClick={() => onSelectQuote(q)}
                  className="p-3 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 rounded-2xl flex items-center justify-between transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 truncate">{q.name}</h5>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {q.make} ({q.modelAndYear})
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    q.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    q.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {q.status === 'completed' ? 'Completed' : q.status === 'quoted' ? 'Quoted' : 'Needs Price'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle: Shop Turnaround Gauge (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider text-slate-900 mb-2">
            Turnaround Rate
          </h3>

          <div className="relative flex flex-col items-center justify-center py-2">
            {/* SVG Arc Gauge */}
            <svg className="w-36 h-20" viewBox="0 0 100 50">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 75 20"
                fill="none"
                stroke="#dc2626"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center -mt-6">
              <div className="text-3xl font-black font-heading text-slate-900">82%</div>
              <span className="text-[11px] font-bold text-slate-400">Same-Day Pickup</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Completed</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              <span>Scheduled</span>
            </span>
          </div>
        </div>

        {/* Right: Live Shop Bay Timer (4 Cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-black text-white border border-slate-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Shop Bay Timer</span>
            <span className="text-emerald-400 font-mono text-[11px]">● ACTIVE</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-white">
              {formatTimer(timerSeconds)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block">Current Diagnostic & Labor Clock</span>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-10 h-10 rounded-2xl bg-white text-slate-900 flex items-center justify-center hover:bg-slate-200 transition active:scale-95"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="w-10 h-10 rounded-2xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center hover:bg-slate-700 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
