import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Subscription API Integration Tests', () => {
  const testUser = {
    email: 'subuser@test.com',
    password: 'password123',
    username: 'subuser' + Date.now(),
    fullName: 'Subscription Test User',
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

  describe('GET /subscription/user', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/subscription/user');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should get user subscriptions', async () => {
      const res = await request(app)
        .get('/subscription/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /subscription/user/status', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/subscription/user/status');
      expect(res.statusCode).toBe(401);
    });

    it('should get subscriptions by status', async () => {
      const res = await request(app)
        .get('/subscription/user/status')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /subscription/shop/:shopId', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/subscription/shop/123')
        .send({});

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/subscription/shop/123' },
      { method: 'get', path: '/subscription/user' },
      { method: 'get', path: '/subscription/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});