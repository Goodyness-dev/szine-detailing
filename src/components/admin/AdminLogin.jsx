import React, { useState } from 'react';
import { authApi } from '../../services/api';
import { BUSINESS_INFO } from '../../data/businessData';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const DEFAULT_KEY = 'szine2026';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAutofill = () => {
    setPassword(DEFAULT_KEY);
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(DEFAULT_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keyToSubmit = password.trim() || DEFAULT_KEY;
    if (!keyToSubmit) {
      setError('Please enter your admin access key.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await authApi.login(keyToSubmit);
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError(err.data?.error || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Site Button */}
      <div className="w-full max-w-md mb-6 z-10">
        <button
          onClick={onBackToSite}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 hover:text-cyan-400 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>← Back to Public Website</span>
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-neutral-950 font-black font-mono text-lg mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            SZ
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Szine Detailing Portal
          </h1>
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider mt-1">
            Dispatch, Estimates & Client Orders
          </p>
        </div>

        {/* 1-Click Elevated Credential Badge */}
        <div className="mb-6 p-4 rounded-2xl bg-neutral-950 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
              // DEMO ACCESS KEY
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Owner Access</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-sm">
            <span className="text-cyan-300 font-bold tracking-wider">{DEFAULT_KEY}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAutofill}
                className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono transition"
              >
                Autofill
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-neutral-400 uppercase mb-1.5">
              Enter Access Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter or autofill key..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm font-mono focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs font-mono"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Enter Admin Dashboard →'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] font-mono text-neutral-500">
          Tomas Williams • Szine Detailing LLC • Phoenix Metro
        </p>

      </div>
    </div>
  );
}
