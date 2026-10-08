'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, initialize } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // If we're on the admin login/signup page, don't guard it
    if (pathname === '/admin/login') {
      setIsChecking(false);
      return;
    }

    // Give a brief tick for localStorage/authStore rehydration
    const checkTimer = setTimeout(() => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser || currentUser.role !== 'ADMIN') {
        router.replace('/admin/login');
      } else {
        setIsChecking(false);
      }
    }, 100);

    return () => clearTimeout(checkTimer);
  }, [pathname, user, router]);

  // If on admin login page, render directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Security check / loading state before rendering protected admin children
  if (isChecking || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
          <ShieldAlert className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Verifying Security Clearance
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Access to Vanguard Store Management is restricted to verified administrators. Redirecting to authorization portal...
        </p>
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full animate-indeterminate" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
