import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore, MockOrder, MockOrderItem } from './mockStore';
import { CartService } from './cart.service';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

export class OrderService {
  static async createOrder(userId: string, data: { paymentMethod: PaymentMethod; shippingAddress: any }) {
    const cart = await CartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Your cart is empty. Please add items before placing an order.');
    }

    if (isDatabaseConnected()) {
      return prisma.$transaction(async (tx) => {
        // Create or get shipping address
        const address = await tx.address.create({
          data: {
            userId,
            name: data.shippingAddress.name,
            phone: data.shippingAddress.phone,
            addressLine1: data.shippingAddress.addressLine1,
            addressLine2: data.shippingAddress.addressLine2,
            city: data.shippingAddress.city,
            state: data.shippingAddress.state,
            postalCode: data.shippingAddress.postalCode,
            country: data.shippingAddress.country || 'India',
          },
        });

        // Create Order
        const order = await tx.order.create({
          data: {
            userId,
            totalAmount: cart.total,
            shippingAmount: cart.shipping,
            discountAmount: 0,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.COMPLETED,
            orderStatus: OrderStatus.PROCESSING,
            shippingAddressId: address.id,
            items: {
              create: cart.items.map((i: any) => ({
                productId: i.productId,
                variantId: i.variantId,
                productName: i.product.name,
                size: i.variant?.size || 'Standard',
                color: i.variant?.color || 'Standard',
                quantity: i.quantity,
                unitPrice: i.product.discountPrice ?? i.product.price,
                subtotal: (i.product.discountPrice ?? i.product.price) * i.quantity,
              })),
            },
          },
          include: {
            items: true,
            shippingAddress: true,
          },
        });

        // Deduct variant stock
        for (const item of cart.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // Clear cart
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;
      });
    }

    // Mock store implementation
    const addr = {
      id: `addr-${Date.now()}`,
      userId,
      name: data.shippingAddress.name,
      phone: data.shippingAddress.phone,
      addressLine1: data.shippingAddress.addressLine1,
      addressLine2: data.shippingAddress.addressLine2 || null,
      city: data.shippingAddress.city,
      state: data.shippingAddress.state,
      postalCode: data.shippingAddress.postalCode,
      country: data.shippingAddress.country || 'India',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStore.addresses.push(addr);

    const orderId = `ord-${Date.now().toString().slice(-6)}`;
    const items: MockOrderItem[] = cart.items.map((i: any) => ({
      id: `oi-${Date.now()}-${Math.random()}`,
      orderId,
      productId: i.productId,
      variantId: i.variantId,
      productName: i.product?.name || 'Garment',
      size: i.variant?.size || 'M',
      color: i.variant?.color || 'Black',
      quantity: i.quantity,
      unitPrice: i.product?.discountPrice ?? i.product?.price ?? 1999,
      subtotal: (i.product?.discountPrice ?? i.product?.price ?? 1999) * i.quantity,
      createdAt: new Date(),
    }));

    const user = mockStore.users.find((u) => u.id === userId);

    const newOrder: MockOrder = {
      id: orderId,
      userId,
      totalAmount: cart.total,
      shippingAmount: cart.shipping,
      discountAmount: 0,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.COMPLETED,
      orderStatus: OrderStatus.PROCESSING,
      shippingAddressId: addr.id,
      shippingAddress: addr,
      items,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user ? { id: user.id, name: user.name, email: user.email } : undefined,
    };

    mockStore.orders.unshift(newOrder);

    // Clear cart items
    await CartService.clearCart(userId);

    return newOrder;
  }

  static async getOrders(userId: string) {
    if (isDatabaseConnected()) {
      return prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return mockStore.orders.filter((o) => o.userId === userId);
  }

  static async getOrderById(userId: string, orderId: string, isAdmin: boolean = false) {
    if (isDatabaseConnected()) {
      const where: any = { id: orderId };
      if (!isAdmin) where.userId = userId;

      const order = await prisma.order.findFirst({
        where,
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
              },
            },
          },
          shippingAddress: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });

      if (!order) throw new Error('Order not found');
      return order;
    }

    const order = mockStore.orders.find((o) => o.id === orderId && (isAdmin || o.userId === userId));
    if (!order) throw new Error('Order not found');
    return order;
  }
}
