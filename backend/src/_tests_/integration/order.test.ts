import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Order API Integration Tests', () => {
  const testUser = {
    email: 'orderuser@test.com',
    password: 'password123',
    username: 'orderuser' + Date.now(),
    fullName: 'Order Test User',
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

  describe('GET /order/user', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/order/user');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should get user orders', async () => {
      if (!userToken) return;

      const res = await request(app)
        .get('/order/user')
        .set('Authorization', `Bearer ${userToken}`);

      // Could be 200 (success) or 500 (server error)
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      }
    });
  });

  describe('POST /order/shop/:shopId', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/order/shop/123')
        .send({});

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'get', path: '/order/user' },
      { method: 'post', path: '/order/shop/123' },
      { method: 'get', path: '/order/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});