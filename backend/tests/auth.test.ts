import request from 'supertest';
import { app } from '../src/app';

describe('Auth API Endpoints (/api/auth)', () => {
  const testEmail = `test_${Date.now()}@example.com`;

  it('POST /api/auth/register - should register a new customer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'James Bond',
        email: testEmail,
        password: 'Password@123',
        phone: '+91 99999 88888',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it('POST /api/auth/login - should log in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin@123456',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.role).toBe('ADMIN');
  });

  it('POST /api/auth/login - should fail with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'WrongPassword999',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - should fail without auth token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
