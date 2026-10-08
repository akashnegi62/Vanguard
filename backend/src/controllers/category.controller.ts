import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { sendSuccess, sendError } from '../utils/response';

export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getCategories();
      return sendSuccess(res, 'Categories fetched successfully', categories);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch categories', 500);
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      return sendSuccess(res, 'Category fetched successfully', category);
    } catch (error: any) {
      return sendError(res, error.message || 'Category not found', 404, 'CATEGORY_NOT_FOUND');
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return sendSuccess(res, 'Category created successfully', category, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create category', 400);
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return sendSuccess(res, 'Category updated successfully', category);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update category', 400);
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      const result = await CategoryService.deleteCategory(req.params.id);
      return sendSuccess(res, 'Category deleted successfully', result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete category', 400);
    }
  }
}
