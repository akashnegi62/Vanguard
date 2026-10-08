import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore } from './mockStore';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class AdminService {
  static async getDashboardStats() {
    if (isDatabaseConnected()) {
      const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.findMany({
          select: { totalAmount: true, paymentStatus: true },
        }),
      ]);

      const totalRevenue = orders
        .filter((o) => o.paymentStatus === PaymentStatus.COMPLETED)
        .reduce((acc, curr) => acc + curr.totalAmount, 0);

      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      });

      return {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      };
    }

    const totalUsers = mockStore.users.length;
    const totalProducts = mockStore.products.length;
    const totalOrders = mockStore.orders.length;
    const totalRevenue = mockStore.orders
      .filter((o) => o.paymentStatus === PaymentStatus.COMPLETED)
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const recentOrders = mockStore.orders.slice(0, 5);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
    };
  }

  static async getUsers() {
    if (isDatabaseConnected()) {
      return prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return mockStore.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      _count: {
        orders: mockStore.orders.filter((o) => o.userId === u.id).length,
      },
    }));
  }

  static async updateUserStatus(userId: string, isActive: boolean) {
    if (isDatabaseConnected()) {
      return prisma.user.update({
        where: { id: userId },
        data: { isActive },
        select: { id: true, name: true, email: true, isActive: true },
      });
    }

    const user = mockStore.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.isActive = isActive;
    user.updatedAt = new Date();
    return { id: user.id, name: user.name, email: user.email, isActive: user.isActive };
  }

  static async getOrders(query?: { status?: string }) {
    if (isDatabaseConnected()) {
      const where: any = {};
      if (query?.status) where.orderStatus = query.status as OrderStatus;

      return prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          shippingAddress: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    let list = mockStore.orders;
    if (query?.status) {
      list = list.filter((o) => o.orderStatus === query.status);
    }
    return list;
  }

  static async updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
    if (isDatabaseConnected()) {
      return prisma.order.update({
        where: { id: orderId },
        data: { orderStatus },
      });
    }

    const order = mockStore.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.orderStatus = orderStatus;
    order.updatedAt = new Date();
    return order;
  }

  static async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
    if (isDatabaseConnected()) {
      return prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus },
      });
    }

    const order = mockStore.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    return order;
  }
}
