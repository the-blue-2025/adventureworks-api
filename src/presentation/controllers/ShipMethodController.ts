import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { ShipMethodService } from '../../application/services/ShipMethodService';
import { CreateShipMethodDto, UpdateShipMethodDto } from '../../application/dtos/ShipMethodDto';

@injectable()
export class ShipMethodController {
  constructor(
    @inject(TYPES.ShipMethodService)
    private shipMethodService: ShipMethodService
  ) {}

  async getShipMethods(req: Request, res: Response): Promise<void> {
    try {
      const shipMethods = await this.shipMethodService.findAll();
      res.json(shipMethods);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ship methods' });
    }
  }

  async getShipMethodById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const shipMethod = await this.shipMethodService.findById(id);
      
      if (shipMethod) {
        res.json(shipMethod);
      } else {
        res.status(404).json({ message: 'Ship method not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ship method' });
    }
  }

  async createShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateShipMethodDto = req.body;
      const shipMethod = await this.shipMethodService.create(dto);
      res.status(201).json(shipMethod);
    } catch (error) {
      res.status(500).json({ message: 'Error creating ship method' });
    }
  }

  async updateShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateShipMethodDto = req.body;
      const shipMethod = await this.shipMethodService.update(id, dto);
      
      if (shipMethod) {
        res.json(shipMethod);
      } else {
        res.status(404).json({ message: 'Ship method not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating ship method' });
    }
  }

  async deleteShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.shipMethodService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting ship method' });
    }
  }
} 