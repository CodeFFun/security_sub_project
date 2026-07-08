import request from 'supertest';
import bcryptjs from 'bcryptjs';
import app from '../../app';
import { UserModel } from '../../model/user.model';
import { ShopCategoryModel } from '../../model/shop-category.model';

describe('Shop Category API Integration Tests', () => {
  const testAdmin = {
    email: 'admin@example.com',
    password: 'password123',
    username: 'admin' + Date.now(),
    fullName: 'Admin User',
    role: 'admin',
  };

  const testCategory = {
    name: 'Test Category ' + Date.now(),
    description: 'Test category description',
  };

  let adminToken: string;
  let categoryId: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testAdmin.email });

    // Admin accounts cannot be created via public /auth/register (privilege
    // escalation is blocked by design). Provision the admin directly in the
    // DB — the same way real admins are seeded — then log in for a token.
    const hashedPassword = await bcryptjs.hash(testAdmin.password, 10);
    await UserModel.create({ ...testAdmin, password: hashedPassword });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });

    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    if (categoryId) {
      await ShopCategoryModel.findByIdAndDelete(categoryId);
    }
    await UserModel.deleteOne({ email: testAdmin.email });
  });

  describe('POST /shop-category/create', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post('/shop-category/create')
        .send(testCategory);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create shop category (admin only)', async () => {
      const res = await request(app)
        .post('/shop-category/create')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testCategory);

      expect([201, 200]).toContain(res.statusCode);
      if (res.body.success) {
        categoryId = res.body.data._id;
      }
    });
  });

  describe('GET /shop-category', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/shop-category');
      expect(res.statusCode).toBe(401);
    });

    it('should get all categories', async () => {
      const res = await request(app)
        .get('/shop-category')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'get', path: '/shop-category' },
      { method: 'post', path: '/shop-category/create' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});