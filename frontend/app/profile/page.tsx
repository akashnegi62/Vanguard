'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { User, ShieldCheck, ShoppingBag, MapPin, KeyRound, Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, quickLoginAsUser } = useAuthStore();

  const [name, setName] = useState(user?.name || 'Vikram Mehta');
  const [phone, setPhone] = useState(user?.phone || '+91 9811223344');
  const [passwordNotice, setPasswordNotice] = useState(false);
  const [profileNotice, setProfileNotice] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setProfileNotice(true);
    setTimeout(() => setProfileNotice(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordNotice(false), 2500);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto py-24 px-4 text-center">
          <User className="w-12 h-12 text-obsidian-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2 uppercase">Please Sign In</h2>
          <p className="text-xs text-obsidian-400 mb-6">
            Sign in to view your profile and manage saved addresses.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-brand-500 text-obsidian-950 font-bold text-xs uppercase"
            >
              Sign In
            </Link>
            <button
              onClick={quickLoginAsUser}
              className="px-6 py-2.5 rounded-full bg-obsidian-800 text-white font-bold text-xs uppercase"
            >
              Quick Demo Login
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-obsidian-950 text-obsidian-100">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="pb-4 border-b border-obsidian-800 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">
              Client Profile
            </h1>
            <p className="text-xs text-obsidian-400 mt-1">
              Manage your personal information, security preferences, and saved locations.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/40">
            Role: {user.role}
          </span>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="p-5 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 hover:border-obsidian-700 flex items-center gap-4 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Order Archives</h3>
              <p className="text-xs text-obsidian-400">View fulfillment history & receipts</p>
            </div>
          </Link>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="p-5 rounded-2xl bg-brand-950/40 border border-brand-800/80 hover:border-brand-700 flex items-center gap-4 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Admin Management Portal</h3>
                <p className="text-xs text-brand-300">Catalog, categories & order controls</p>
              </div>
            </Link>
          )}
        </div>

        {/* Edit Personal Information Form */}
        <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" /> Personal Details
          </h2>

          {profileNotice && (
            <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-obsidian-950 border border-obsidian-800 rounded-lg p-2.5 text-xs text-obsidian-500 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-obsidian-400 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-white hover:bg-brand-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-obsidian-800 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-400" /> Security & Password
          </h2>

          {passwordNotice && (
            <div className="p-3 bg-emerald-950 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-obsidian-400 block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="text-xs text-obsidian-400 block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Update Password
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
