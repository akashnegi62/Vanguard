import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess, sendError } from '../utils/response';

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const result = await ProductService.getProducts(req.query);
      return sendSuccess(res, 'Products fetched successfully', result.products, 200, result.meta);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch products', 500);
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return sendSuccess(res, 'Product fetched successfully', product);
    } catch (error: any) {
      return sendError(res, error.message || 'Product not found', 404, 'PRODUCT_NOT_FOUND');
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      return sendSuccess(res, 'Product created successfully', product, 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create product', 400);
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);
      return sendSuccess(res, 'Product updated successfully', product);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update product', 400);
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const result = await ProductService.deleteProduct(req.params.id);
      return sendSuccess(res, 'Product deleted successfully', result);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to delete product', 400);
    }
  }
}
