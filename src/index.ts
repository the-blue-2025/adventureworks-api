import 'reflect-metadata';
import { Container } from 'inversify';
import express from 'express';
import { TYPES } from './infrastructure/ioc/types';
import { IPurchaseOrderRepository } from './domain/repositories/IPurchaseOrderRepository';
import { IShipMethodRepository } from './domain/repositories/IShipMethodRepository';
import { IPersonRepository } from './domain/repositories/IPersonRepository';
import { IVendorRepository } from './domain/repositories/IVendorRepository';
import { PurchaseOrderRepository } from './infrastructure/repositories/PurchaseOrderRepository';
import { ShipMethodRepository } from './infrastructure/repositories/ShipMethodRepository';
import { PersonRepository } from './infrastructure/repositories/PersonRepository';
import { VendorRepository } from './infrastructure/repositories/VendorRepository';
import { PurchaseOrderService } from './application/services/PurchaseOrderService';
import { ShipMethodService } from './application/services/ShipMethodService';
import { PersonService } from './application/services/PersonService';
import { VendorService } from './application/services/VendorService';
import { PurchaseOrderController } from './presentation/controllers/PurchaseOrderController';
import { ShipMethodController } from './presentation/controllers/ShipMethodController';
import { PersonController } from './presentation/controllers/PersonController';
import { VendorController } from './presentation/controllers/VendorController';
import sequelize from './infrastructure/database/config';
import { initializeAssociations } from './infrastructure/database/associations';

async function bootstrap() {
  try {
    // Database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Initialize database associations
    initializeAssociations();
    console.log('Database associations have been initialized successfully.');

    // IoC container setup
    const container = new Container();

    // Register repositories
    container.bind<IPurchaseOrderRepository>(TYPES.IPurchaseOrderRepository)
      .to(PurchaseOrderRepository);
    container.bind<IShipMethodRepository>(TYPES.IShipMethodRepository)
      .to(ShipMethodRepository);
    container.bind<IPersonRepository>(TYPES.IPersonRepository)
      .to(PersonRepository);
    container.bind<IVendorRepository>(TYPES.IVendorRepository)
      .to(VendorRepository);

    // Register services
    container.bind<PurchaseOrderService>(TYPES.PurchaseOrderService)
      .to(PurchaseOrderService);
    container.bind<ShipMethodService>(TYPES.ShipMethodService)
      .to(ShipMethodService);
    container.bind<PersonService>(TYPES.PersonService)
      .to(PersonService);
    container.bind<VendorService>(TYPES.VendorService)
      .to(VendorService);

    // Register controllers
    container.bind<PurchaseOrderController>(PurchaseOrderController)
      .toSelf();
    container.bind<ShipMethodController>(ShipMethodController)
      .toSelf();
    container.bind<PersonController>(PersonController)
      .toSelf();
    container.bind<VendorController>(VendorController)
      .toSelf();

    // Express app setup
    const app = express();
    app.use(express.json());

    // Initialize controllers
    const purchaseOrderController = container.get<PurchaseOrderController>(PurchaseOrderController);
    const shipMethodController = container.get<ShipMethodController>(ShipMethodController);
    const personController = container.get<PersonController>(PersonController);
    const vendorController = container.get<VendorController>(VendorController);

    // Register routes
    app.use('/api/v1/purchase-orders', purchaseOrderController.router);
    app.use('/api/v1/ship-methods', shipMethodController.router);
    app.use('/api/v1/persons', personController.router);
    app.use('/api/v1/vendors', vendorController.router);

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