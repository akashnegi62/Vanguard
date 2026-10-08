import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { WishlistService } from '../services/wishlist.service';
import { sendSuccess, sendError } from '../utils/response';

export class WishlistController {
  static async getWishlist(req: AuthenticatedRequest, res: Response) {
    try {
      const items = await WishlistService.getWishlist(req.user!.id);
      return sendSuccess(res, 'Wishlist fetched successfully', items);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch wishlist', 500);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId } = req.body;
      const items = await WishlistService.addItem(req.user!.id, productId);
      return sendSuccess(res, 'Product added to wishlist', items);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to add to wishlist', 400);
    }
  }

  static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId } = req.params;
      const items = await WishlistService.removeItem(req.user!.id, productId);
      return sendSuccess(res, 'Product removed from wishlist', items);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to remove from wishlist', 400);
    }
  }
}
