'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-20 px-8 border-b border-obsidian-900 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-between">
      <div>
        <h1 className="text-xl font-extrabold text-white uppercase tracking-tight font-display">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-obsidian-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {action}

        <div className="flex items-center gap-3 pl-4 border-l border-obsidian-800">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block">{user?.name || 'Admin User'}</span>
            <span className="text-[10px] text-brand-400 font-mono">ADMINISTRATOR</span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-lg bg-obsidian-900 text-obsidian-400 hover:text-red-400 hover:bg-obsidian-800 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
