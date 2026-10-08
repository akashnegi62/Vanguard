import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';

export class AdminController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      return sendSuccess(res, 'Admin dashboard stats fetched successfully', stats);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch dashboard stats', 500);
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await AdminService.getUsers();
      return sendSuccess(res, 'Users fetched successfully', users);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch users', 500);
    }
  }

  static async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const user = await AdminService.updateUserStatus(id, isActive);
      return sendSuccess(res, 'User status updated successfully', user);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update user', 400);
    }
  }

  static async getOrders(req: Request, res: Response) {
    try {
      const orders = await AdminService.getOrders(req.query);
      return sendSuccess(res, 'Orders fetched successfully', orders);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch orders', 500);
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await AdminService.updateOrderStatus(id, status);
      return sendSuccess(res, 'Order status updated successfully', order);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update order status', 400);
    }
  }

  static async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      const order = await AdminService.updatePaymentStatus(id, paymentStatus);
      return sendSuccess(res, 'Payment status updated successfully', order);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update payment status', 400);
    }
  }
}
