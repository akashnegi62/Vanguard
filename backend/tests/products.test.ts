import request from 'supertest';
import { app } from '../src/app';

describe('Products & Categories API (/api/products, /api/categories)', () => {
  it('GET /api/categories - should list all departments', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/products - should list paginated products', async () => {
    const res = await request(app).get('/api/products?page=1&limit=6');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty('totalPages');
  });

  it('GET /api/products/:id - should fetch a single product by slug', async () => {
    const res = await request(app).get('/api/products/heavyweight-boxy-t-shirt');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('heavyweight-boxy-t-shirt');
    expect(res.body.data.variants.length).toBeGreaterThan(0);
  });

  it('GET /api/products/non-existent-product - should return 404', async () => {
    const res = await request(app).get('/api/products/non-existent-product');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
