import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.put('/users/:id/role', AdminController.updateUserRole);
router.get('/orders', AdminController.getOrders);
router.put('/orders/:id/status', AdminController.updateOrderStatus);
router.put('/orders/:id/payment-status', AdminController.updatePaymentStatus);

export default router;
