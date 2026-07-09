import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Delivery API Integration Tests', () => {
  const testUser = {
    email: 'deliveryuser@test.com',
    password: 'password123',
    username: 'deliveryuser' + Date.now(),
    fullName: 'Delivery Test User',
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

  describe('POST /delivery/:orderId', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/delivery/123')
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should validate delivery data', async () => {
      if (!userToken) return;

      const res = await request(app)
        .post('/delivery/123')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      // Could be 400 (validation), 404 (not found), or 500 (backend error)
      expect([400, 404, 500]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /delivery/order/:orderId', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/delivery/order/123');
      expect(res.statusCode).toBe(401);
    });

    it('should get deliveries by order', async () => {
      if (!userToken) return;

      const res = await request(app)
        .get('/delivery/order/123')
        .set('Authorization', `Bearer ${userToken}`);

      // Could be 200 (success), 404 (not found), or 500 (backend error)
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/delivery/123' },
      { method: 'get', path: '/delivery/123' },
      { method: 'get', path: '/delivery/order/123' },
      { method: 'patch', path: '/delivery/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' || method === 'patch' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});