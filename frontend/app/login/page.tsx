'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLoginAsUser, quickLoginAsAdmin, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const success = await login(email, password);
    if (success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  };

  const handleDemoUser = () => {
    quickLoginAsUser();
    router.push('/');
  };

  const handleDemoAdmin = () => {
    quickLoginAsAdmin();
    router.push('/admin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-obsidian-900/60 p-8 rounded-3xl border border-obsidian-800 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
              Client Sign In
            </h1>
            <p className="text-xs text-obsidian-400">
              Access your personal wardrobe, order archives, and wishlist.
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
              {error || localError}
            </div>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="p-4 bg-obsidian-950/80 rounded-2xl border border-obsidian-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block text-center">
              Evaluation & Demo Instant Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoUser}
                className="py-2 px-3 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-obsidian-700"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Customer
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-2 px-3 rounded-lg bg-brand-900/80 hover:bg-brand-800 text-brand-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-brand-700/60"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-300" /> Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-obsidian-400 block mb-1 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-600 focus:outline-none focus:border-brand-500"
                />
                <Mail className="w-4 h-4 text-obsidian-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-obsidian-400 font-medium">Password</label>
                <span className="text-[11px] text-brand-400 hover:underline cursor-pointer">
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
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-600 focus:outline-none focus:border-brand-500"
                />
                <Lock className="w-4 h-4 text-obsidian-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5"
            >
              {isLoading ? 'Verifying...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-obsidian-400">
            Do not have an account?{' '}
            <Link href="/register" className="text-brand-300 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
