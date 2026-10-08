'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  return (
    <header className="h-20 px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between">
      <div>
        <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight font-display">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {action}

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-900 block">{user?.name || 'Admin User'}</span>
            <span className="text-[10px] text-slate-500 font-mono font-bold">ADMINISTRATOR</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
