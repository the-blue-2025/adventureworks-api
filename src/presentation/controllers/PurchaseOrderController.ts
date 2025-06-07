import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Router, Request, Response } from 'express';
import { TYPES } from '../../infrastructure/ioc/types';
import { PurchaseOrderService } from '../../application/services/PurchaseOrderService';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../../application/dtos/PurchaseOrderDto';

@injectable()
export class PurchaseOrderController {
  public router: Router;

  constructor(
    @inject(TYPES.PurchaseOrderService)
    private purchaseOrderService: PurchaseOrderService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getPurchaseOrders.bind(this));
    this.router.get('/:id', this.getPurchaseOrderById.bind(this));
    this.router.post('/', this.createPurchaseOrder.bind(this));
    this.router.put('/:id', this.updatePurchaseOrder.bind(this));
    this.router.delete('/:id', this.deletePurchaseOrder.bind(this));
  }

  private async getPurchaseOrders(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrders = await this.purchaseOrderService.findAll();
      res.json({
        success: true,
        data: purchaseOrders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async getPurchaseOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const purchaseOrder = await this.purchaseOrderService.findById(id);

      if (!purchaseOrder) {
        res.status(404).json({
          success: false,
          error: 'Purchase order not found'
        });
        return;
      }

      res.json({
        success: true,
        data: purchaseOrder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async createPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as CreatePurchaseOrderDto;
      const purchaseOrder = await this.purchaseOrderService.create(dto);

      res.status(201).json({
        success: true,
        data: purchaseOrder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto = req.body as UpdatePurchaseOrderDto;
      const purchaseOrder = await this.purchaseOrderService.update(id, dto);

      if (!purchaseOrder) {
        res.status(404).json({
          success: false,
          error: 'Purchase order not found'
        });
        return;
      }

      res.json({
        success: true,
        data: purchaseOrder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }

  private async deletePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.purchaseOrderService.delete(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Purchase order not found'
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