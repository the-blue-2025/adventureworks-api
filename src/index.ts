import 'reflect-metadata';
import express from 'express';
import { configureContainer } from './ioc/inversify.config';
import sequelize from './infrastructure/database/config';

// Routes
import {
  registerPurchaseOrderRoutes,
  registerShipMethodRoutes,
  registerPersonRoutes,
  registerVendorRoutes,
  registerPurchaseOrderDetailRoutes
} from './presentation/routes';

async function bootstrap() {
  try {
    // Database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // IoC container setup
    const container = configureContainer();

    // Express app setup
    const app = express();
    app.use(express.json());

    // Register routes
    app.use('/api/v1/purchase-orders', registerPurchaseOrderRoutes(container));
    app.use('/api/v1/ship-methods', registerShipMethodRoutes(container));
    app.use('/api/v1/persons', registerPersonRoutes(container));
    app.use('/api/v1/vendors', registerVendorRoutes(container));
    app.use('/api/v1/purchase-order-details', registerPurchaseOrderDetailRoutes(container));

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start the application:', error);
    process.exit(1);
  }
}

bootstrap(); 