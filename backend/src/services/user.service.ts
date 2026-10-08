import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore } from './mockStore';
import { hashPassword, comparePassword } from '../utils/password';

export class UserService {
  static async getProfile(userId: string) {
    if (isDatabaseConnected()) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          addresses: true,
        },
      });
      if (!user) throw new Error('User not found');
      return user;
    }

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const addresses = mockStore.addresses.filter((a) => a.userId === userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      addresses,
    };
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    if (isDatabaseConnected()) {
      return prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone }),
        },
        select: { id: true, name: true, email: true, phone: true, role: true, updatedAt: true },
      });
    }

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    if (data.name) user.name = data.name;
    if (data.phone !== undefined) user.phone = data.phone;
    user.updatedAt = new Date();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      updatedAt: user.updatedAt,
    };
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    if (isDatabaseConnected()) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      const matches = await comparePassword(currentPass, user.passwordHash);
      if (!matches) throw new Error('Current password does not match');

      const newHash = await hashPassword(newPass);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });
      return { message: 'Password updated successfully' };
    }

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const matches = await comparePassword(currentPass, user.passwordHash);
    if (!matches) throw new Error('Current password does not match');

    user.passwordHash = await hashPassword(newPass);
    user.updatedAt = new Date();
    return { message: 'Password updated successfully' };
  }
}
