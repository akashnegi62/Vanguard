'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/authStore';
import { User, ShieldCheck, ShoppingBag, KeyRound, Check } from 'lucide-react';

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
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto py-20 px-4 text-center">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-950 mb-2 uppercase">Please Sign In</h2>
          <p className="text-xs text-slate-500 mb-6">
            Sign in to view your profile and manage saved addresses.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full bg-slate-950 text-white font-bold text-xs uppercase"
            >
              Sign In
            </Link>
            <button
              onClick={quickLoginAsUser}
              className="px-6 py-2.5 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase"
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
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight font-display">
              Client Profile
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Manage your personal information, security preferences, and saved locations.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-900 border border-slate-200">
            Role: {user.role}
          </span>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center gap-4 transition-all shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Order Archives</h3>
              <p className="text-xs text-slate-500">View fulfillment history & receipts</p>
            </div>
          </Link>

          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="p-5 rounded-2xl bg-slate-900 text-white flex items-center gap-4 transition-all shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Admin Management Portal</h3>
                <p className="text-xs text-slate-300">Catalog, categories & order controls</p>
              </div>
            </Link>
          )}
        </div>

        {/* Edit Personal Information Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" /> Personal Details
          </h2>

          {profileNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600 block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-slate-700" /> Security & Password
          </h2>

          {passwordNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4" /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider transition-all border border-slate-300"
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
