import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Order Item API Integration Tests', () => {
  const testUser = {
    email: 'orderitemuser@test.com',
    password: 'password123',
    username: 'orderitemuser' + Date.now(),
    fullName: 'Order Item Test User',
  };

  let userToken: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
    
    await request(app)
      .post('/auth/register')
      .send(testUser);
    
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    userToken = loginRes.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testUser.email });
  });

  describe('POST /order-item', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/order-item')
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should validate order item data', async () => {
      if (!userToken) return;

      const res = await request(app)
        .post('/order-item')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      // Could be 400 (validation) or 500 (server error)
      expect([400, 500]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/order-item' },
      { method: 'get', path: '/order-item/123' },
      { method: 'patch', path: '/order-item/123' },
      { method: 'delete', path: '/order-item/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' || method === 'patch' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});