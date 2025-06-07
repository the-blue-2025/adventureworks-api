import { injectable, inject } from 'inversify';
import { Router, Request, Response } from 'express';
import { TYPES } from '../../infrastructure/ioc/types';
import { ShipMethodService } from '../../application/services/ShipMethodService';
import { CreateShipMethodDto, UpdateShipMethodDto } from '../../application/dtos/ShipMethodDto';

@injectable()
export class ShipMethodController {
  public router: Router;

  constructor(
    @inject(TYPES.ShipMethodService)
    private shipMethodService: ShipMethodService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getShipMethods.bind(this));
    this.router.get('/:id', this.getShipMethodById.bind(this));
    this.router.post('/', this.createShipMethod.bind(this));
    this.router.put('/:id', this.updateShipMethod.bind(this));
    this.router.delete('/:id', this.deleteShipMethod.bind(this));
  }

  private async getShipMethods(req: Request, res: Response): Promise<void> {
    try {
      const shipMethods = await this.shipMethodService.findAll();
      res.json({
        success: true,
        data: shipMethods
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async getShipMethodById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const shipMethod = await this.shipMethodService.findById(id);

      if (!shipMethod) {
        res.status(404).json({
          success: false,
          error: 'Ship method not found'
        });
        return;
      }

      res.json({
        success: true,
        data: shipMethod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async createShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as CreateShipMethodDto;
      const shipMethod = await this.shipMethodService.create(dto);

      res.status(201).json({
        success: true,
        data: shipMethod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async updateShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto = req.body as UpdateShipMethodDto;
      const shipMethod = await this.shipMethodService.update(id, dto);

      if (!shipMethod) {
        res.status(404).json({
          success: false,
          error: 'Ship method not found'
        });
        return;
      }

      res.json({
        success: true,
        data: shipMethod
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async deleteShipMethod(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.shipMethodService.delete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Ship method not found'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }
} 