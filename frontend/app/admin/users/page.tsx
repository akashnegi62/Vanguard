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

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-obsidian-950 text-obsidian-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Client Accounts"
          subtitle="Directory of customer accounts, administrator roles, and access credentials"
        />

        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-obsidian-900 border border-obsidian-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-obsidian-500 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-obsidian-400 absolute left-3.5 top-3" />
          </div>

          <div className="bg-obsidian-900/40 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-obsidian-900/90 text-obsidian-400 uppercase tracking-wider font-bold border-b border-obsidian-800">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800/60">
                {filtered.map((usr) => (
                  <tr key={usr.id} className="hover:bg-obsidian-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center shrink-0">
                          {usr.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{usr.name}</span>
                          <span className="text-[10px] text-obsidian-500">{usr.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-obsidian-400">
                      {usr.phone || 'Not provided'}
                    </td>
                    <td className="py-3.5 px-4 text-obsidian-400">
                      {formatDate(usr.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={usr.role}
                        onChange={(e) => handleRoleChange(usr.id, e.target.value as UserRole)}
                        className="bg-obsidian-950 border border-obsidian-800 text-white rounded px-2 py-1 text-[11px] font-mono focus:outline-none"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {usr.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {usr.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(usr.id)}
                        className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                          usr.isActive
                            ? 'border-red-800/80 text-red-400 hover:bg-red-950'
                            : 'border-emerald-800/80 text-emerald-400 hover:bg-emerald-950'
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
