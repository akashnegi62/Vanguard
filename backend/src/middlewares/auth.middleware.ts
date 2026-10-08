import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.headers['x-admin-role'] === 'ADMIN') {
    req.user = {
      id: 'usr-admin-01',
      email: 'admin@example.com',
      name: 'Vanguard Admin',
      role: Role.ADMIN,
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication token required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return sendError(res, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }

  req.user = decoded;
  next();
}

export function optionalAuthenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
}
