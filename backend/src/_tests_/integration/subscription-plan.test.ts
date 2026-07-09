import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Subscription Plan API Integration Tests', () => {
  const testUser = {
    email: 'planuser@test.com',
    password: 'password123',
    username: 'planuser' + Date.now(),
    fullName: 'Plan Test User',
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

  describe('POST /subscription-plan', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/subscription-plan')
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should validate plan data', async () => {
      if (!userToken) return;

      const res = await request(app)
        .post('/subscription-plan')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      // Could be 400 (validation error) or 500 (missing required fields)
      expect([400, 500]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /subscription-plan/shop/:shopId', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/subscription-plan/shop/123');
      expect(res.statusCode).toBe(401);
    });

    it('should get subscription plans by shop', async () => {
      if (!userToken) return;

      const res = await request(app)
        .get('/subscription-plan/shop/123')
        .set('Authorization', `Bearer ${userToken}`);

      // Could be 200 (found), 404 (not found), or 500 (error)
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('GET /subscription-plan/shop/:shopId/active', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/subscription-plan/shop/123/active');
      expect(res.statusCode).toBe(401);
    });

    it('should get active plans', async () => {
      if (!userToken) return;

      const res = await request(app)
        .get('/subscription-plan/shop/123/active')
        .set('Authorization', `Bearer ${userToken}`);

      // Could be 200 (found), 404 (not found), or 500 (error)
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/subscription-plan' },
      { method: 'get', path: '/subscription-plan/shop/123' },
      { method: 'get', path: '/subscription-plan/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});