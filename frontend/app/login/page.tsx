'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAsUser, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const success = await login(email, password);
    if (success) {
      router.push('/');
    }
  };

  const handleDemoUser = () => {
    quickLoginAsUser();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight font-display">
              Client Sign In
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Access your personal wardrobe, order archives, and wishlist.
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error || localError}
            </div>
          )}

          {/* Quick Demo Customer Sign In */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900">Testing as a customer?</p>
              <p className="text-[11px] text-slate-500">Vikram Mehta (user@example.com)</p>
            </div>
            <button
              type="button"
              onClick={handleDemoUser}
              className="py-1.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-300 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-700" /> Instant Access
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-600 font-semibold">Password</label>
                <span className="text-[11px] text-slate-500 hover:text-slate-900 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {isLoading ? 'Verifying...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Do not have an account?{' '}
            <Link href="/register" className="text-slate-950 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
