'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    const success = await register(name, email, password, phone);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-obsidian-900/60 p-8 rounded-3xl border border-obsidian-800 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
              Create Client Account
            </h1>
            <p className="text-xs text-obsidian-400">
              Join the guild to unlock tailored garments and priority drops.
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-obsidian-400 block mb-1 font-medium">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Vikram Mehta"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-600 focus:outline-none focus:border-brand-500"
                />
                <User className="w-4 h-4 text-obsidian-500 absolute left-3.5 top-3" />
              </div>
            </div>

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
              <label className="text-xs text-obsidian-400 block mb-1 font-medium">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-600 focus:outline-none focus:border-brand-500"
                />
                <Phone className="w-4 h-4 text-obsidian-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-obsidian-400 block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
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
              className="w-full py-3.5 rounded-xl bg-brand-400 hover:bg-brand-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-500/10"
            >
              {isLoading ? 'Creating Account...' : 'Complete Registration'}{' '}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-obsidian-400">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-300 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
