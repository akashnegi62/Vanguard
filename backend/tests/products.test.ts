import request from 'supertest';
import { app } from '../src/app';

describe('Products & Categories API (/api/products, /api/categories)', () => {
  let adminToken: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      });
    adminToken = loginRes.body.data.token;
  });

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

  it('POST /api/products - should create a new product from admin panel', async () => {
    const newProductPayload = {
      name: 'Luxury Cashmere Crewneck',
      slug: `luxury-cashmere-crewneck-${Date.now()}`,
      description: 'Hand-combed Mongolian cashmere sweater with seamless circular knit.',
      price: 11999,
      discountPrice: 9999,
      categoryId: 'cat-tshirts',
      brand: 'Vanguard Atelier',
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      variants: [
        { size: 'M', color: 'Oatmeal', stock: 15, sku: `CASH-M-${Date.now()}` },
        { size: 'L', color: 'Oatmeal', stock: 20, sku: `CASH-L-${Date.now()}` },
      ],
    };

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newProductPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Luxury Cashmere Crewneck');
    expect(res.body.data.price).toBe(11999);
  });

  it('POST /api/products - should fail without admin credentials', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Unauthenticated Test',
        price: 1000,
        categoryId: 'cat-1',
        description: 'Test description',
        images: ['https://example.com/test.jpg'],
        variants: [{ size: 'M', color: 'Black', stock: 5 }],
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/products/non-existent-product - should return 404', async () => {
    const res = await request(app).get('/api/products/non-existent-product');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
