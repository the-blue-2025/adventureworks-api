import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { PersonService } from '../../application/services/PersonService';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

@injectable()
export class PersonAggregateController {
  constructor(
    @inject(TYPES.PersonService)
    private personService: PersonService
  ) {}

  /**
   * Get a person with all their related data
   */
  async getPersonWithAllDetails(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      const result = await this.personService.getPersonWithAllDetails(personId);
      
      if (!result) {
        res.status(HttpStatusCodes.NOT_FOUND).json({
          error: 'Person not found'
        });
        return;
      }

      res.status(HttpStatusCodes.OK).json(result);
    } catch (error) {
      console.error('Error getting person with all details:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Add an email address to a person
   */
  async addEmailAddress(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      const { emailAddress } = req.body;
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      if (!emailAddress) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Email address is required'
        });
        return;
      }

      const result = await this.personService.addEmailAddress(personId, emailAddress);
      
      res.status(HttpStatusCodes.CREATED).json({
        businessEntityId: result.businessEntityId,
        emailAddressId: result.emailAddressId,
        emailAddress: result.emailAddress,
        rowguid: result.rowguid,
        modifiedDate: result.modifiedDate
      });
    } catch (error) {
      console.error('Error adding email address:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Add a phone number to a person
   */
  async addPhoneNumber(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      const { phoneNumber, phoneNumberTypeId } = req.body;
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      if (!phoneNumber || !phoneNumberTypeId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Phone number and phone number type ID are required'
        });
        return;
      }

      const result = await this.personService.addPhoneNumber(personId, phoneNumber, phoneNumberTypeId);
      
      res.status(HttpStatusCodes.CREATED).json({
        businessEntityId: result.businessEntityId,
        phoneNumber: result.phoneNumber,
        phoneNumberTypeId: result.phoneNumberTypeId,
        modifiedDate: result.modifiedDate
      });
    } catch (error) {
      console.error('Error adding phone number:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Remove a phone number from a person
   */
  async removePhoneNumber(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      const { phoneNumber } = req.params;
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      if (!phoneNumber) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Phone number is required'
        });
        return;
      }

      await this.personService.removePhoneNumber(personId, phoneNumber);
      
      res.status(HttpStatusCodes.NO_CONTENT).send();
    } catch (error) {
      console.error('Error removing phone number:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all email addresses for a person
   */
  async getPersonEmailAddresses(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      const emailAddresses = await this.personService.getPersonEmailAddresses(personId);
      
      res.status(HttpStatusCodes.OK).json(emailAddresses.map(email => ({
        businessEntityId: email.businessEntityId,
        emailAddressId: email.emailAddressId,
        emailAddress: email.emailAddress,
        rowguid: email.rowguid,
        modifiedDate: email.modifiedDate
      })));
    } catch (error) {
      console.error('Error getting person email addresses:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all phone numbers for a person
   */
  async getPersonPhoneNumbers(req: Request, res: Response): Promise<void> {
    try {
      const personId = parseInt(req.params.id);
      
      if (isNaN(personId)) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          error: 'Invalid person ID'
        });
        return;
      }

      const phoneNumbers = await this.personService.getPersonPhoneNumbers(personId);
      
      res.status(HttpStatusCodes.OK).json(phoneNumbers.map(phone => ({
        businessEntityId: phone.businessEntityId,
        phoneNumber: phone.phoneNumber,
        phoneNumberTypeId: phone.phoneNumberTypeId,
        modifiedDate: phone.modifiedDate
      })));
    } catch (error) {
      console.error('Error getting person phone numbers:', error);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error'
      });
    }
  }
}
