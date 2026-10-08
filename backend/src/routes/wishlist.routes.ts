import { Router } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', WishlistController.getWishlist);
router.post('/items', WishlistController.addItem);
router.delete('/items/:productId', WishlistController.removeItem);

export default router;
