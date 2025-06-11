import { Router } from 'express';
import { Container } from 'inversify';
import { ShipMethodController } from '../controllers/ShipMethodController';

export function registerShipMethodRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<ShipMethodController>(ShipMethodController);

  router.get('/', controller.getAllShipMethods.bind(controller));
  router.get('/:id', controller.getShipMethodById.bind(controller));
  router.post('/', controller.createShipMethod.bind(controller));
  router.put('/:id', controller.updateShipMethod.bind(controller));
  router.delete('/:id', controller.deleteShipMethod.bind(controller));

  return router;
} 