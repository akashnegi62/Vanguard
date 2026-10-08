import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { OrderService } from '../services/order.service';
import { sendSuccess, sendError } from '../utils/response';

export class OrderController {
  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderService.createOrder(req.user!.id, req.body);
      return sendSuccess(res, 'Order placed successfully', order, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to place order', 400);
    }
  }

  static async getOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const orders = await OrderService.getOrders(req.user!.id);
      return sendSuccess(res, 'Orders fetched successfully', orders);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch orders', 500);
    }
  }

  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderService.getOrderById(req.user!.id, req.params.id);
      return sendSuccess(res, 'Order details fetched successfully', order);
    } catch (error: any) {
      return sendError(res, error.message || 'Order not found', 404, 'ORDER_NOT_FOUND');
    }
  }
}
