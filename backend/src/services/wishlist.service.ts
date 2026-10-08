import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore } from './mockStore';

export class WishlistService {
  static async getWishlist(userId: string) {
    if (isDatabaseConnected()) {
      let wl = await prisma.wishlist.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, variants: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!wl) {
        wl = await prisma.wishlist.create({
          data: { userId },
          include: { items: { include: { product: { include: { images: true, variants: true } } } } },
        });
      }

      return wl.items.map((i) => i.product);
    }

    let wl = mockStore.wishlists.find((w) => w.userId === userId);
    if (!wl) {
      wl = { id: `wl-${userId}`, userId, productIds: [], createdAt: new Date() };
      mockStore.wishlists.push(wl);
    }

    return mockStore.products.filter((p) => wl!.productIds.includes(p.id));
  }

  static async addItem(userId: string, productId: string) {
    if (isDatabaseConnected()) {
      let wl = await prisma.wishlist.findUnique({ where: { userId } });
      if (!wl) {
        wl = await prisma.wishlist.create({ data: { userId } });
      }

      await prisma.wishlistItem.upsert({
        where: { wishlistId_productId: { wishlistId: wl.id, productId } },
        create: { wishlistId: wl.id, productId },
        update: {},
      });

      return this.getWishlist(userId);
    }

    let wl = mockStore.wishlists.find((w) => w.userId === userId);
    if (!wl) {
      wl = { id: `wl-${userId}`, userId, productIds: [], createdAt: new Date() };
      mockStore.wishlists.push(wl);
    }

    if (!wl.productIds.includes(productId)) {
      wl.productIds.push(productId);
    }

    return this.getWishlist(userId);
  }

  static async removeItem(userId: string, productId: string) {
    if (isDatabaseConnected()) {
      const wl = await prisma.wishlist.findUnique({ where: { userId } });
      if (wl) {
        await prisma.wishlistItem.deleteMany({
          where: { wishlistId: wl.id, productId },
        });
      }
      return this.getWishlist(userId);
    }

    const wl = mockStore.wishlists.find((w) => w.userId === userId);
    if (wl) {
      wl.productIds = wl.productIds.filter((id) => id !== productId);
    }

    return this.getWishlist(userId);
  }
}
