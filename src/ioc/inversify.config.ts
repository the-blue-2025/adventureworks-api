import { Container } from 'inversify';
import { TYPES } from './types';

// Repositories
import { IPurchaseOrderRepository } from '../domain/interfaces/IPurchaseOrderRepository';
import { IShipMethodRepository } from '../domain/repositories/IShipMethodRepository';
import { IPersonRepository } from '../domain/repositories/IPersonRepository';
import { IVendorRepository } from '../domain/repositories/IVendorRepository';

import { PurchaseOrderRepository } from '../infrastructure/repositories/PurchaseOrderRepository';
import { ShipMethodRepository } from '../infrastructure/repositories/ShipMethodRepository';
import { PersonRepository } from '../infrastructure/repositories/PersonRepository';
import { VendorRepository } from '../infrastructure/repositories/VendorRepository';

// Services
import { PurchaseOrderService } from '../application/services/PurchaseOrderService';
import { ShipMethodService } from '../application/services/ShipMethodService';
import { PersonService } from '../application/services/PersonService';
import { VendorService } from '../application/services/VendorService';
import { PurchaseOrderDetailService } from '../application/services/PurchaseOrderDetailService';

// Controllers
import { PurchaseOrderController } from '../presentation/controllers/PurchaseOrderController';
import { ShipMethodController } from '../presentation/controllers/ShipMethodController';
import { PersonController } from '../presentation/controllers/PersonController';
import { VendorController } from '../presentation/controllers/VendorController';
import { PurchaseOrderDetailController } from '../presentation/controllers/PurchaseOrderDetailController';

export function configureContainer(): Container {
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
  container.bind<PurchaseOrderDetailService>(TYPES.PurchaseOrderDetailService)
    .to(PurchaseOrderDetailService);

  // Register controllers
  container.bind<PurchaseOrderController>(PurchaseOrderController)
    .toSelf();
  container.bind<ShipMethodController>(ShipMethodController)
    .toSelf();
  container.bind<PersonController>(PersonController)
    .toSelf();
  container.bind<VendorController>(VendorController)
    .toSelf();
  container.bind<PurchaseOrderDetailController>(PurchaseOrderDetailController)
    .toSelf();

  return container;
} 