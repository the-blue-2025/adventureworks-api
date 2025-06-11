import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { ShipMethodService } from '../../application/services/ShipMethodService';
import { CreateShipMethodDto, UpdateShipMethodDto } from '../../application/dtos/ShipMethodDto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@injectable()
export class ShipMethodController {
  constructor(
    @inject(TYPES.ShipMethodService)
    private shipMethodService: ShipMethodService
  ) {}

  async getAllShipMethods(req: Request, res: Response): Promise<void> {
    try {
      const shipMethods = await this.shipMethodService.findAll();
      res.status(HttpStatusCode.OK).json(shipMethods);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving ship methods' });
    }
  }

  async getShipMethodById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const shipMethod = await this.shipMethodService.findById(id);
      
      if (shipMethod) {
        res.status(HttpStatusCode.OK).json(shipMethod);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Ship method not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving ship method' });
    }
  }

  async createShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateShipMethodDto = req.body;
      const shipMethod = await this.shipMethodService.create(dto);
      res.status(HttpStatusCode.CREATED).json(shipMethod);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error creating ship method' });
    }
  }

  async updateShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateShipMethodDto = req.body;
      const shipMethod = await this.shipMethodService.update(id, dto);
      
      if (shipMethod) {
        res.status(HttpStatusCode.OK).json(shipMethod);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Ship method not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating ship method' });
    }
  }

  async deleteShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.shipMethodService.delete(id);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting ship method' });
    }
  }
} 