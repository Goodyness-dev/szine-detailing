import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ClipboardList, MessageSquare, 
  Settings, LogOut, ExternalLink, Search, 
  Bell, Mail, Wrench, Menu, X, Plus, Calendar, ShieldCheck
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import OrdersView from './OrdersView';
import InboxView from './InboxView';
import AdminSettings from './AdminSettings';
import QuoteDetailModal from './QuoteDetailModal';
import NewOrderModal from './NewOrderModal';
import { authApi, quotesApi } from '../../services/api';
import { BUSINESS_INFO } from '../../data/businessData';

function getInitials(name) {
  if (!name) return 'AD';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminLayout({ user, onLogout, onBackToSite }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'inbox' | 'settings'
  const [modalQuote, setModalQuote] = useState(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, quoted: 0, completed: 0 });

  useEffect(() => {
    quotesApi.getStats().then(setStats).catch(() => {});
  }, [activeTab]);

  const handleLogout = async () => {
    await authApi.logout();
    onLogout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Quotes', icon: ClipboardList, badge: stats.total > 0 ? stats.total : null },
    { id: 'inbox', label: 'Customer Inbox', icon: MessageSquare, badge: stats.pending > 0 ? stats.pending : null },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans flex antialiased">
      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR (Desktop & Mobile Drawer)                        */}
      {/* ------------------------------------------------------------- */}
      {/* Backdrop for mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* Logo Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 shrink-0 rounded-2xl bg-shop-red text-white flex items-center justify-center shadow-md shadow-shop-red/30">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-heading font-black text-base tracking-tight text-slate-900 block leading-tight truncate" title={BUSINESS_INFO.name}>
                  {BUSINESS_INFO.name}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Shop Admin
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 block">
              Menu
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
                      isActive
                        ? 'bg-shop-red text-white shadow-md shadow-shop-red/25'
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-shop-light text-shop-red border border-shop-border'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* GENERAL Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 block">
              General
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
                  activeTab === 'settings'
                    ? 'bg-shop-red text-white shadow-md shadow-shop-red/25'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
                <span>Settings & Alerts</span>
              </button>

              <button
                onClick={onBackToSite}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>View Customer Site</span>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="p-4 m-4 rounded-2xl bg-gradient-to-br from-shop-red to-shop-redHover text-white space-y-2 shadow-lg shadow-shop-red/20">
          <div className="flex items-center space-x-2">
            <span className="text-base">📱</span>
            <h5 className="font-heading font-black text-xs truncate">{BUSINESS_INFO.name}</h5>
          </div>
          <p className="text-[11px] text-white/90 leading-snug">
            Manage customer quotes and communications directly on your phone from any browser.
          </p>
          <button
            onClick={onBackToSite}
            className="w-full py-2 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            Visit Customer Site
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CANVAS & TOP BAR                                 */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile hamburger & Search */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, customers, or services..."
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-shop-red focus:bg-white rounded-2xl pl-10 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition"
              />
              <span className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                ⌘F
              </span>
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Inbox Shortcut */}
            <button
              onClick={() => setActiveTab('inbox')}
              className="w-10 h-10 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition"
              title="Customer Inbox"
            >
              <Mail className="w-4 h-4" />
              {stats.pending > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-shop-red text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {stats.pending}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('orders')}
              className="w-10 h-10 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute 2.5 2.5 w-2 h-2 rounded-full bg-shop-red" />
            </button>

            {/* Admin Profile Card */}
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-shop-red to-shop-redHover text-white font-black text-sm flex items-center justify-center shadow-sm">
                {getInitials(BUSINESS_INFO.owner?.name || BUSINESS_INFO.name)}
              </div>
              <div className="hidden sm:block text-left">
                <h4 className="text-xs font-black text-slate-900 leading-tight truncate max-w-[130px]">
                  {BUSINESS_INFO.owner?.name || 'Shop Admin'}
                </h4>
                <span className="text-[11px] text-slate-400 block leading-tight truncate max-w-[130px]">
                  {BUSINESS_INFO.address?.city ? `${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.state || ''}` : 'Executive'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* BODY CANVAS */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview 
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectQuote={(q) => setModalQuote(q)}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
            />
          )}

          {activeTab === 'orders' && <OrdersView />}

          {activeTab === 'inbox' && (
            <InboxView onOpenFullQuote={(q) => setModalQuote(q)} />
          )}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Quote Detail Modal */}
      {modalQuote && (
        <QuoteDetailModal
          quote={modalQuote}
          onClose={() => setModalQuote(null)}
          onUpdate={(updated) => setModalQuote(updated)}
        />
      )}

      {/* New Manual Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        onCreated={() => {
          quotesApi.getStats().then(setStats).catch(() => {});
        }}
      />
    </div>
  );
}
