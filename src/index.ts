import 'reflect-metadata';
import express from 'express';
import { configureContainer } from './infrastructure/ioc/inversify.config';
import { initializeAssociations } from './infrastructure/database/associations';
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

    // Initialize database associations
    initializeAssociations();
    console.log('Database associations have been initialized successfully.');

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