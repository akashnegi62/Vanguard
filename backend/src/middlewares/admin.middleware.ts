import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
  }

  if (req.user.role !== Role.ADMIN) {
    return sendError(res, 'Admin privileges required', 403, 'FORBIDDEN');
  }

  next();
}
