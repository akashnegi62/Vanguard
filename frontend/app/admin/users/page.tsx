'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { api } from '@/lib/api';
import { User, UserRole } from '@/types';
import { formatDate } from '@/lib/utils';
import { Search, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .getAdminUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateUserStatus(id, !currentStatus);
      setUsers(
        users.map((u) => (u.id === id ? { ...u, isActive: !currentStatus } : u))
      );
      setFeedback({ type: 'success', message: 'User account status updated successfully.' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update user status.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(id, newRole);
      setUsers(
        users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      setFeedback({ type: 'success', message: `User role updated to ${newRole}.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change user role.' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Client Accounts"
          subtitle="Directory of customer accounts, administrator roles, and access credentials"
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-950 block">{usr.name}</span>
                          <span className="text-[10px] text-slate-400">{usr.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {usr.phone || 'Not provided'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(usr.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleChange(usr.id, e.target.value as UserRole)}
                        className="bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 text-[11px] font-mono focus:outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {usr.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {usr.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(usr.id, usr.isActive)}
                        className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                          usr.isActive
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {usr.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
