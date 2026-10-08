import { isDatabaseConnected, prisma } from '../config/database';
import { mockStore, MockReview } from './mockStore';

export class ReviewService {
  static async getProductReviews(productId: string) {
    if (isDatabaseConnected()) {
      return prisma.review.findMany({
        where: { productId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      });
    }

    return mockStore.reviews.filter((r) => r.productId === productId);
  }

  static async addReview(userId: string, productId: string, rating: number, comment: string) {
    if (isDatabaseConnected()) {
      const existing = await prisma.review.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existing) {
        return prisma.review.update({
          where: { id: existing.id },
          data: { rating, comment },
          include: { user: { select: { id: true, name: true } } },
        });
      }

      return prisma.review.create({
        data: { userId, productId, rating, comment },
        include: { user: { select: { id: true, name: true } } },
      });
    }

    const existing = mockStore.reviews.find(
      (r) => r.userId === userId && r.productId === productId
    );

    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      existing.updatedAt = new Date();
      return existing;
    }

    const user = mockStore.users.find((u) => u.id === userId);
    const newRev: MockReview = {
      id: `rev-${Date.now()}`,
      userId,
      productId,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: user ? { id: user.id, name: user.name } : undefined,
    };
    mockStore.reviews.unshift(newRev);
    return newRev;
  }

  static async deleteReview(userId: string, reviewId: string, isAdmin: boolean = false) {
    if (isDatabaseConnected()) {
      const review = await prisma.review.findUnique({ where: { id: reviewId } });
      if (!review) throw new Error('Review not found');
      if (!isAdmin && review.userId !== userId) throw new Error('Unauthorized');
      await prisma.review.delete({ where: { id: reviewId } });
      return { id: reviewId };
    }

    const idx = mockStore.reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) throw new Error('Review not found');
    if (!isAdmin && mockStore.reviews[idx].userId !== userId) throw new Error('Unauthorized');
    mockStore.reviews.splice(idx, 1);
    return { id: reviewId };
  }
}
