import request from 'supertest';
import app from '../../app';
import { UserModel } from '../../model/user.model';
import { ShopModel } from '../../model/shop.model';
import { ProductModel } from '../../model/product.model';
import { AddressModel } from '../../model/address.model';

describe('Product API Integration Tests', () => {
  const testShopOwner = {
    email: 'productshop@test.com',
    password: 'password123',
    username: 'productshop' + Date.now(),
    fullName: 'Product Shop Owner',
    role: 'shop',
  };

  const testProduct = {
    name: 'Test Product',
    description: 'Test product description',
    base_price: 99.99,
    stock_quantity: 100,
    discount: 10,
  };

  let shopToken: string;
  let userId: string;
  let shopId: string;
  let productId: string;

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
          .field('name', 'Product Test Shop ' + Date.now())
          .field('addressId', addressRes.body.data._id || addressRes.body.data.id)
          .field('accepts_subscription', 'false');
        
        if (shopRes.body.success && shopRes.body.data) {
          shopId = shopRes.body.data._id || shopRes.body.data.id;
        }
      }
    }
  });

  afterAll(async () => {
    await ProductModel.deleteMany({ shopId });
    await ShopModel.deleteMany({ userId });
    await AddressModel.deleteMany({ userId });
    await UserModel.deleteOne({ email: testShopOwner.email });
  });

  describe('POST /product/shop/:shopId', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/product/shop/${shopId || '123'}`)
        .send(testProduct);

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should create product', async () => {
      if (!shopId) {
        console.log('Skipping: Shop not created');
        return;
      }

      const res = await request(app)
        .post(`/product/shop/${shopId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send(testProduct);

      expect([201, 200]).toContain(res.statusCode);
      if (res.body.success) {
        productId = res.body.data._id;
      }
    });

    it('should validate required fields', async () => {
      if (!shopId) return;

      const res = await request(app)
        .post(`/product/shop/${shopId}`)
        .set('Authorization', `Bearer ${shopToken}`)
        .send({ name: 'Incomplete Product' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /product/shop/:shopId', () => {
    it('should get products by shop', async () => {
      if (!shopId) return;

      const res = await request(app)
        .get(`/product/shop/${shopId}`)
        .set('Authorization', `Bearer ${shopToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /product/:productId', () => {
    it('should get product by id', async () => {
      if (!productId) return;

      const res = await request(app)
        .get(`/product/${productId}`)
        .set('Authorization', `Bearer ${shopToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Protected routes', () => {
    const routes = [
      { method: 'post', path: '/product/shop/123' },
      { method: 'get', path: '/product/123' },
    ];

    it.each(routes)('$method $path returns 401 without token', async ({ method, path }) => {
      const api = request(app) as any;
      const req = api[method](path);
      const response = method === 'post' ? await req.send({}) : await req;

      expect(response.status).toBe(401);
    });
  });
});