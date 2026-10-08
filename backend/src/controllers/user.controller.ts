import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await UserService.getProfile(req.user!.id);
      return sendSuccess(res, 'Profile fetched successfully', user);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch profile', 400);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await UserService.updateProfile(req.user!.id, req.body);
      return sendSuccess(res, 'Profile updated successfully', user);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update profile', 400);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(req.user!.id, currentPassword, newPassword);
      return sendSuccess(res, result.message, null);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to change password', 400);
    }
  }
}
