import { Router } from 'express';
import { Container } from 'inversify';
import { PurchaseOrderDetailController } from '../controllers/PurchaseOrderDetailController';

export function registerPurchaseOrderDetailRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<PurchaseOrderDetailController>(PurchaseOrderDetailController);

  router.get('/', controller.getAllDetails.bind(controller));
  router.get('/purchase-order/:purchaseOrderId', controller.getPurchaseOrderDetailsByPurchaseOrderId.bind(controller));
  router.get('/:id', controller.getDetailById.bind(controller));
  router.post('/', controller.createDetail.bind(controller));
  router.put('/:id', controller.updateDetail.bind(controller));
  router.delete('/:id', controller.deleteDetail.bind(controller));

  return router;
} 