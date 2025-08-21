import { Router } from 'express';
import { container } from '../../ioc/inversify.config';
import { PersonAggregateController } from '../controllers/PersonAggregateController';

const router = Router();
const personAggregateController = container.get<PersonAggregateController>(PersonAggregateController);

// Get person with all details (addresses, emails, phones)
router.get('/:id/details', (req, res) => personAggregateController.getPersonWithAllDetails(req, res));

// Email address routes
router.get('/:id/emails', (req, res) => personAggregateController.getPersonEmailAddresses(req, res));
router.post('/:id/emails', (req, res) => personAggregateController.addEmailAddress(req, res));

// Phone number routes
router.get('/:id/phones', (req, res) => personAggregateController.getPersonPhoneNumbers(req, res));
router.post('/:id/phones', (req, res) => personAggregateController.addPhoneNumber(req, res));
router.delete('/:id/phones/:phoneNumber', (req, res) => personAggregateController.removePhoneNumber(req, res));

export default router;
