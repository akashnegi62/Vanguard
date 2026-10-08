import { create } from 'zustand';
import { User } from '@/types';
import { api } from '@/lib/api';
import { MOCK_USERS } from '@/lib/mockData';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'USER' | 'ADMIN',
    adminSecret?: string
  ) => Promise<boolean>;
  logout: () => void;
  quickLoginAsUser: () => void;
  quickLoginAsAdmin: () => void;
  updateProfile: (data: Partial<User>) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('mens_store_token');
    const storedUser = localStorage.getItem('mens_store_user');
    if (token && storedUser) {
      try {
        set({ token, user: JSON.parse(storedUser) });
      } catch {
        localStorage.removeItem('mens_store_token');
        localStorage.removeItem('mens_store_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.login(email, password);
      const { user, token } = res.data;
      localStorage.setItem('mens_store_token', token);
      localStorage.setItem('mens_store_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      return false;
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role?: 'USER' | 'ADMIN',
    adminSecret?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.register(name, email, password, phone, role, adminSecret);
      const { user, token } = res.data;
      localStorage.setItem('mens_store_token', token);
      localStorage.setItem('mens_store_user', JSON.stringify(user));
      set({ user, token, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('mens_store_token');
    localStorage.removeItem('mens_store_user');
    set({ user: null, token: null });
  },

  quickLoginAsUser: () => {
    const demoUser = MOCK_USERS[1]; // Vikram Mehta
    const token = `mock-token-${demoUser.id}`;
    localStorage.setItem('mens_store_token', token);
    localStorage.setItem('mens_store_user', JSON.stringify(demoUser));
    set({ user: demoUser, token, error: null });
  },

  quickLoginAsAdmin: () => {
    const adminUser = MOCK_USERS[0]; // Akash Admin
    const token = `mock-token-${adminUser.id}`;
    localStorage.setItem('mens_store_token', token);
    localStorage.setItem('mens_store_user', JSON.stringify(adminUser));
    set({ user: adminUser, token, error: null });
  },

  updateProfile: (data: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    localStorage.setItem('mens_store_user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
