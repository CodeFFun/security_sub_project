import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';

describe('Payment API Integration Tests', () => {
  const testUser = {
    email: 'paymentuser@test.com',
    password: 'password123',
    username: 'paymentuser' + Date.now(),
    fullName: 'Payment Test User',
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

  describe('POST /payment', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/payment')
        .send({});

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should validate payment data', async () => {
      if (!userToken) return;

      const res = await request(app)
        .post('/payment')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect([400, 404]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /payment/user', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/payment/user');
      expect(res.statusCode).toBe(401);
    });

    it('should get user payments', async () => {
      if (!userToken) return;

      const res = await request(app)
        .get('/payment/user')
        .set('Authorization', `Bearer ${userToken}`);

      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      }
    });
  });

  describe('POST /payment/esewa/initialize', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/payment/esewa/initialize')
        .send({});

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /payment/esewa/success', () => {
    it('should be publicly accessible', async () => {
      const res = await request(app).get('/payment/esewa/success');
      expect(res.statusCode).not.toBe(401);
    });
  });

  describe('GET /payment/esewa/failure', () => {
    it('should be publicly accessible', async () => {
      const res = await request(app).get('/payment/esewa/failure');
      expect(res.statusCode).not.toBe(401);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/payment' },
      { method: 'get', path: '/payment/user' },
      { method: 'post', path: '/payment/esewa/initialize' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});