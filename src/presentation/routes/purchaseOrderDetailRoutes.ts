import { Router } from 'express';
import { Container } from 'inversify';
import { PurchaseOrderDetailController } from '../controllers/PurchaseOrderDetailController';

export function registerPurchaseOrderDetailRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<PurchaseOrderDetailController>(PurchaseOrderDetailController);

  router.get('/', controller.getAllPurchaseOrderDetails.bind(controller));
  router.get('/:id', controller.getPurchaseOrderDetailById.bind(controller));
  router.post('/', controller.createPurchaseOrderDetail.bind(controller));
  router.put('/:id', controller.updatePurchaseOrderDetail.bind(controller));
  router.delete('/:id', controller.deletePurchaseOrderDetail.bind(controller));

  return router;
} 