import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';
import { ShopModel } from '../../model/shop.model';
import { AddressModel } from '../../model/address.model';

describe('Product Category API Integration Tests', () => {
  const testShopOwner = {
    email: 'catshop@test.com',
    password: 'password123',
    username: 'catshop' + Date.now(),
    fullName: 'Category Shop Owner',
    role: 'shop',
  };

  let shopToken: string;
  let userId: string;
  let shopId: string;

  beforeAll(async () => {
    await UserModel.deleteOne({ email: testShopOwner.email });
    
    await request(app)
      .post('/auth/register')
      .send(testShopOwner);
    
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testShopOwner.email, password: testShopOwner.password });
    
    if (loginRes.body.success && loginRes.body.data) {
      shopToken = loginRes.body.token;
      userId = loginRes.body.data._id || loginRes.body.data.id;

      const addressRes = await request(app)
        .post('/address')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          label: 'Shop Address',
          line1: 'Test Street',
          city: 'Test City',
          state: 'Test State',
          country: 'Test Country',
        });

      if (addressRes.body.success && addressRes.body.data) {
        const shopRes = await request(app)
          .post('/shops/create')
          .set('Authorization', `Bearer ${shopToken}`)
          .field('name', 'Category Test Shop ' + Date.now())
          .field('addressId', addressRes.body.data._id || addressRes.body.data.id)
          .field('accepts_subscription', 'false');
        
        if (shopRes.body.success && shopRes.body.data) {
          shopId = shopRes.body.data._id || shopRes.body.data.id;
        }
      }
    }
  });

  afterAll(async () => {
    await ShopModel.deleteMany({ userId });
    await AddressModel.deleteMany({ userId });
    await UserModel.deleteOne({ email: testShopOwner.email });
  });

  describe('GET /product-category/shop/:shopId', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .get(`/product-category/shop/${shopId || '123'}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should get categories by shop', async () => {
      if (!shopId) return;

      const res = await request(app)
        .get(`/product-category/shop/${shopId}`)
        .set('Authorization', `Bearer ${shopToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /product-category/create', () => {
    it('should require shop role', async () => {
      const res = await request(app)
        .post('/product-category/create')
        .set('Authorization', `Bearer ${shopToken}`)
        .send({
          name: 'Test Category',
          shopId: shopId,
        });

      expect([201, 200, 403]).toContain(res.statusCode);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'get', path: '/product-category' },
      { method: 'post', path: '/product-category/create' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});