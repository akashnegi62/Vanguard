import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.delete('/:id', authenticate, ReviewController.deleteReview);

export default router;
