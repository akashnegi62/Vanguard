import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, role, adminSecret } = req.body;
      const result = await AuthService.register(name, email, password, phone, role, adminSecret);
      return sendSuccess(res, 'User registered successfully', result, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Registration failed', 400);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return sendSuccess(res, 'Login successful', result, 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Invalid login credentials', 401);
    }
  }

  static async logout(req: Request, res: Response) {
    return sendSuccess(res, 'Logged out successfully', null, 200);
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401);
      }
      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, 'User profile fetched successfully', user, 200);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch user', 400);
    }
  }
}
