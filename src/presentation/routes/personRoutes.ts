import { Router } from 'express';
import { Container } from 'inversify';
import { PersonController } from '../controllers/PersonController';

export function registerPersonRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<PersonController>(PersonController);

  router.get('/', controller.getAllPersons.bind(controller));
  router.get('/:id', controller.getPersonById.bind(controller));
  router.post('/', controller.createPerson.bind(controller));
  router.put('/:id', controller.updatePerson.bind(controller));
  router.delete('/:id', controller.deletePerson.bind(controller));

  return router;
} 