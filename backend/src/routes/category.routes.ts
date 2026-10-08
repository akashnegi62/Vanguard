import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

// Admin Category Management
router.post('/', authenticate, requireAdmin, validate(createCategorySchema), CategoryController.createCategory);
router.put('/:id', authenticate, requireAdmin, validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', authenticate, requireAdmin, CategoryController.deleteCategory);

export default router;
