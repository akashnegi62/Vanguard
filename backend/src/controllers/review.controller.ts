import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { ReviewService } from '../services/review.service';
import { sendSuccess, sendError } from '../utils/response';

export class ReviewController {
  static async getProductReviews(req: Request, res: Response) {
    try {
      const reviews = await ReviewService.getProductReviews(req.params.id);
      return sendSuccess(res, 'Reviews fetched successfully', reviews);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch reviews', 500);
    }
  }

  static async addReview(req: AuthenticatedRequest, res: Response) {
    try {
      const { rating, comment } = req.body;
      const review = await ReviewService.addReview(req.user!.id, req.params.id, rating, comment);
      return sendSuccess(res, 'Review submitted successfully', review, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to submit review', 400);
    }
  }

  static async deleteReview(req: AuthenticatedRequest, res: Response) {
    try {
      const isAdmin = req.user?.role === 'ADMIN';
      const result = await ReviewService.deleteReview(req.user!.id, req.params.id, isAdmin);
      return sendSuccess(res, 'Review deleted successfully', result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete review', 400);
    }
  }
}
