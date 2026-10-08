import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore, MockCart } from './mockStore';

export class CartService {
  static async getCart(userId: string) {
    if (isDatabaseConnected()) {
      let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
              },
              variant: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: { items: { include: { product: { include: { images: true } }, variant: true } } },
        });
      }

      return this.formatCartTotals(cart);
    }

    let cart = mockStore.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      mockStore.carts.push(cart);
    }

    return this.formatCartTotals(cart);
  }

  static async addItem(userId: string, productId: string, variantId?: string | null, quantity: number = 1) {
    if (isDatabaseConnected()) {
      let cart = await prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
      }

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || undefined,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId: variantId || null,
            quantity,
          },
        });
      }

      return this.getCart(userId);
    }

    let cart = mockStore.carts.find((c) => c.userId === userId);
    if (!cart) {
      cart = {
        id: `cart-${userId}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      };
      mockStore.carts.push(cart);
    }

    const existingItem = cart.items.find(
      (i) => i.productId === productId && (!variantId || i.variantId === variantId)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updatedAt = new Date();
    } else {
      const product = mockStore.products.find((p) => p.id === productId);
      const variant = product?.variants.find((v) => v.id === variantId) || null;

      cart.items.push({
        id: `ci-${Date.now()}`,
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
        product,
        variant,
      });
    }

    return this.getCart(userId);
  }

  static async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    if (isDatabaseConnected()) {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
      return this.getCart(userId);
    }

    const cart = mockStore.carts.find((c) => c.userId === userId);
    if (cart) {
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.updatedAt = new Date();
      }
    }

    return this.getCart(userId);
  }

  static async removeItem(userId: string, itemId: string) {
    if (isDatabaseConnected()) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return this.getCart(userId);
    }

    const cart = mockStore.carts.find((c) => c.userId === userId);
    if (cart) {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    }

    return this.getCart(userId);
  }

  static async clearCart(userId: string) {
    if (isDatabaseConnected()) {
      const cart = await prisma.cart.findUnique({ where: { userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
      return this.getCart(userId);
    }

    const cart = mockStore.carts.find((c) => c.userId === userId);
    if (cart) {
      cart.items = [];
    }

    return this.getCart(userId);
  }

  private static formatCartTotals(cart: any) {
    const items = cart.items || [];
    let subtotal = 0;

    for (const item of items) {
      const price = item.product?.discountPrice ?? item.product?.price ?? 0;
      subtotal += price * item.quantity;
    }

    const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 150;
    const total = subtotal + shipping;

    return {
      ...cart,
      items,
      subtotal,
      shipping,
      total,
      totalCount: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
    };
  }
}
