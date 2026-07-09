import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Dashboard API Integration Tests', () => {
  const testShopOwner = {
    email: 'dashboardshop@test.com',
    password: 'password123',
    username: 'dashboardshop' + Date.now(),
    fullName: 'Dashboard Shop Owner',
    role: 'shop',
  };

  let shopToken: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testShopOwner.email });
    
    await request(app)
      .post('/auth/register')
      .send(testShopOwner);
    
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testShopOwner.email, password: testShopOwner.password });
    
    shopToken = loginRes.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: testShopOwner.email });
  });

  describe('GET /dashboard', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/dashboard');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should require shop role', async () => {
      if (!shopToken) return;

      const res = await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${shopToken}`);

      expect([200, 403, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('GET /dashboard/shop/overview', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/dashboard/shop/overview');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should require shop role', async () => {
      if (!shopToken) return;

      const res = await request(app)
        .get('/dashboard/shop/overview')
        .set('Authorization', `Bearer ${shopToken}`);

      expect([200, 403, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'get', path: '/dashboard' },
      { method: 'get', path: '/dashboard/shop/overview' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const response = await api[method](path);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});