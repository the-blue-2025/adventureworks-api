import { Router } from 'express';
import { Container } from 'inversify';
import { VendorController } from '../controllers/VendorController';

export function registerVendorRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<VendorController>(VendorController);

  router.get('/', controller.getAllVendors.bind(controller));
  router.get('/:id', controller.getVendorById.bind(controller));
  router.post('/', controller.createVendor.bind(controller));
  router.put('/:id', controller.updateVendor.bind(controller));
  router.delete('/:id', controller.deleteVendor.bind(controller));

  return router;
} 