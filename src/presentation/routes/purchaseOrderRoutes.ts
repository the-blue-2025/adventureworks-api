import { Router } from 'express';
import { Container } from 'inversify';
import { PurchaseOrderController } from '../controllers/PurchaseOrderController';

export function registerPurchaseOrderRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<PurchaseOrderController>(PurchaseOrderController);

  router.get('/', controller.getAllPurchaseOrders.bind(controller));
  router.get('/:id', controller.getPurchaseOrderById.bind(controller));
  router.post('/', controller.createPurchaseOrder.bind(controller));
  router.put('/:id', controller.updatePurchaseOrder.bind(controller));
  router.delete('/:id', controller.deletePurchaseOrder.bind(controller));

  return router;
} 