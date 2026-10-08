import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { CartService } from '../services/cart.service';
import { sendSuccess, sendError } from '../utils/response';

export class CartController {
  static async getCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await CartService.getCart(req.user!.id);
      return sendSuccess(res, 'Cart fetched successfully', cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch cart', 500);
    }
  }

  static async addItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { productId, variantId, quantity } = req.body;
      const cart = await CartService.addItem(req.user!.id, productId, variantId, quantity);
      return sendSuccess(res, 'Item added to cart', cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to add item to cart', 400);
    }
  }

  static async updateItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const cart = await CartService.updateQuantity(req.user!.id, itemId, quantity);
      return sendSuccess(res, 'Cart item updated', cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update item', 400);
    }
  }

  static async removeItem(req: AuthenticatedRequest, res: Response) {
    try {
      const { itemId } = req.params;
      const cart = await CartService.removeItem(req.user!.id, itemId);
      return sendSuccess(res, 'Item removed from cart', cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to remove item', 400);
    }
  }

  static async clearCart(req: AuthenticatedRequest, res: Response) {
    try {
      const cart = await CartService.clearCart(req.user!.id);
      return sendSuccess(res, 'Cart cleared', cart);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to clear cart', 400);
    }
  }
}
