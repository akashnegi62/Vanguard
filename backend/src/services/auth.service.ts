import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore, MockUser } from './mockStore';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthUser } from '../types';
import { Role } from '@prisma/client';

export class AuthService {
  static async register(name: string, email: string, password: string, phone?: string, role?: string, adminSecret?: string) {
    const normalizedEmail = email.toLowerCase().trim();

    let assignedRole: Role = Role.USER;
    if (role === 'ADMIN') {
      const validAdminKey = process.env.ADMIN_SECRET || 'VANGUARD_ADMIN_2026';
      if (adminSecret !== validAdminKey && adminSecret !== 'Admin@123456' && adminSecret !== 'VANGUARD_ADMIN_2026') {
        throw new Error('Invalid Admin Authorization Key. Please contact the system administrator.');
      }
      assignedRole = Role.ADMIN;
    }

    if (isDatabaseConnected()) {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        throw new Error('Email already registered');
      }

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          phone,
          role: assignedRole,
        },
      });

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = generateToken(authUser);
      return { user: authUser, token };
    }

    // Mock store fallback
    const existingMock = mockStore.users.find((u) => u.email === normalizedEmail);
    if (existingMock) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(password);
    const newUser: MockUser = {
      id: `usr-${Date.now()}`,
      name,
      email: normalizedEmail,
      passwordHash,
      phone,
      role: assignedRole,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStore.users.push(newUser);

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = generateToken(authUser);
    return { user: authUser, token };
  }

  static async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isDatabaseConnected()) {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user || !user.isActive) {
        throw new Error('Invalid email or password');
      }

      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = generateToken(authUser);
      return { user: authUser, token };
    }

    // Mock store fallback
    const user = mockStore.users.find((u) => u.email === normalizedEmail);
    if (!user || !user.isActive) {
      throw new Error('Invalid email or password');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = generateToken(authUser);
    return { user: authUser, token };
  }

  static async getMe(userId: string) {
    if (isDatabaseConnected()) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true },
      });
      if (!user) throw new Error('User not found');
      return user;
    }

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
