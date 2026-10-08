import request from 'supertest';
import { app } from '../src/app';

describe('Cart & Orders API (/api/cart, /api/orders)', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login as demo customer
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'customer@example.com',
        password: 'Password@123456',
      });
    authToken = loginRes.body.data.token;
  });

  it('GET /api/cart - should retrieve authenticated user cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('items');
    expect(res.body.data).toHaveProperty('total');
  });

  it('POST /api/cart/items - should add an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        productId: 'prod-02',
        quantity: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/orders - should place an order from the cart', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        paymentMethod: 'COD',
        shippingAddress: {
          name: 'Alexander Wright',
          phone: '+91 98765 11111',
          addressLine1: '402 Regency Towers',
          city: 'Gurugram',
          state: 'Haryana',
          postalCode: '122002',
          country: 'India',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.orderStatus).toBe('PROCESSING');
  });

  it('GET /api/orders - should fetch user order history', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
