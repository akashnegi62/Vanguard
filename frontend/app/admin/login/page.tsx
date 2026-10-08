'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, register, logout, isLoading, error } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('admin@example.com');
  const [loginPassword, setLoginPassword] = useState('Admin@123456');

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAdminKey, setRegAdminKey] = useState('VANGUARD_ADMIN_2026');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    const success = await login(loginEmail, loginPassword);
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role !== 'ADMIN') {
        logout();
        setLocalError('Access Denied: This account does not possess Administrator clearance. Standard client accounts cannot access the admin portal.');
        return;
      }
      router.push('/admin');
    }
  };

  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (regPassword.length < 6) {
      setLocalError('Admin password must be at least 6 characters long.');
      return;
    }

    const success = await register(
      regName,
      regEmail,
      regPassword,
      regPhone || undefined,
      'ADMIN',
      regAdminKey
    );

    if (success) {
      setSuccessMessage('Administrator account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    }
  };

  const fillMasterCredentials = () => {
    setLoginEmail('admin@example.com');
    setLoginPassword('Admin@123456');
    setLocalError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Store Return */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Storefront
        </Link>
        <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
          SECURE PROTOCOL v2.6
        </span>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-display">
            Vanguard Admin Console
          </h1>
          <p className="text-xs text-slate-400">
            Administrative Clearance & Operations Portal
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setLocalError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'signin'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setLocalError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Alert Notifications */}
        {(error || localError) && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 text-red-200 text-xs rounded-2xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error || localError}</div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs rounded-2xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {activeTab === 'signin' ? (
          /* Sign In Form */
          <form onSubmit={handleAdminSignIn} className="space-y-4">
            {/* Quick Fill Box for Admin */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200 text-[11px]">Primary Store Admin</p>
                <p className="text-[11px] font-mono text-slate-500">admin@example.com</p>
              </div>
              <button
                type="button"
                onClick={fillMasterCredentials}
                className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-700 transition-colors"
              >
                Auto Fill
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <span className="text-[10px] font-mono text-slate-500">Encrypted</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying Authorization...' : 'Authenticate & Enter'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleAdminSignUp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Administrator Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Akash Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Official Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="ops@vanguard.store"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Create Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/80"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Admin Authorization Key
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Required</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regAdminKey}
                  onChange={(e) => setRegAdminKey(e.target.value)}
                  placeholder="VANGUARD_ADMIN_2026"
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
                <Key className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[10px] text-slate-500">
                Default authorization key is <code className="text-amber-400 font-mono">VANGUARD_ADMIN_2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating Admin Record...' : 'Complete Admin Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer System Status */}
      <div className="max-w-md mx-auto w-full text-center py-4 text-[11px] text-slate-500">
        Vanguard Enterprise Commerce • Node Singapore (Supabase)
      </div>
    </div>
  );
}
