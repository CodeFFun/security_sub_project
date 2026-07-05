import express, {Request, Response} from 'express';
import cors from 'cors';
import { PORT, CLIENT_URL } from './config';
import { connectDatabase } from './database/mongodb';
import { securityHeaders } from './middleware/security.middleware';
import { activityLogger } from './middleware/activity-logger.middleware';
import { warnIfDemoTogglesEnabled } from './config/security-demo';
import authRoutes from './routes/auth.routes';
import shopRoutes from './routes/shop.routes';
import addressRoutes from './routes/address.routes';
import path from 'path';
import productRoutes from './routes/product.routes';
import deliveryRoutes from './routes/delivery.routes';
import orderItemRoutes from './routes/order-item.routes';
import orderRoutes from './routes/order.routes';
import subscriptionRoutes from './routes/subscription.routes';
import subscriptionPlanRoutes from './routes/subscription-plan.routes';
import paymentRoutes from './routes/payment.routes';
import shopCategoryRoutes from './routes/shop-category.routes';
import productCategoryRoutes from './routes/product-category.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
app.disable('x-powered-by');
const allowedOrigins = CLIENT_URL.split(',').map((o) => o.trim());
const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(activityLogger);

app.use('/auth', authRoutes);
app.use('/shop-category', shopCategoryRoutes)
app.use('/address', addressRoutes);
app.use('/product-category', productCategoryRoutes)
app.use('/shops', shopRoutes);
app.use('/product', productRoutes);
app.use('/order-item', orderItemRoutes);
app.use('/order', orderRoutes);
app.use('/delivery', deliveryRoutes);
app.use('/payment', paymentRoutes);
app.use('/subscription-plan', subscriptionPlanRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req:Request, res:Response) => {
  return res.status(200).json({ sucess: true, message: 'Welcome to the api' });
});

async function startServer() {
    warnIfDemoTogglesEnabled();
    await connectDatabase();

    app.listen(
        PORT,
        () => {
            console.log(`Server: http://localhost:${PORT}`);
        }
    );
}

startServer();