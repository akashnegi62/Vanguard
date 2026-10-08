import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { createReviewSchema } from '../validators/order.validator';

const router = Router();

router.get('/', ProductController.getProducts);
router.get('/slug/:slug', ProductController.getProductById);
router.get('/:id', ProductController.getProductById);

// Reviews on product
router.get('/:id/reviews', ReviewController.getProductReviews);
router.post('/:id/reviews', authenticate, validate(createReviewSchema), ReviewController.addReview);

// Admin Product Management
router.post('/', authenticate, requireAdmin, validate(createProductSchema), ProductController.createProduct);
router.put('/:id', authenticate, requireAdmin, validate(updateProductSchema), ProductController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, ProductController.deleteProduct);

export default router;
