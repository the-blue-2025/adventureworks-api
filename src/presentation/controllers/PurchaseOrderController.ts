import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { PurchaseOrderService } from '../../application/services/PurchaseOrderService';
import { CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../../application/dtos/PurchaseOrderDto';

@injectable()
export class PurchaseOrderController {
  constructor(
    @inject(TYPES.PurchaseOrderService)
    private purchaseOrderService: PurchaseOrderService
  ) {}

  async getAllPurchaseOrders(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrders = await this.purchaseOrderService.findAll();
      res.json(purchaseOrders);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchase orders' });
    }
  }

  async getPurchaseOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const purchaseOrder = await this.purchaseOrderService.findById(id);
      
      if (purchaseOrder) {
        res.json(purchaseOrder);
      } else {
        res.status(404).json({ message: 'Purchase order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchase order' });
    }
  }

  async createPurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreatePurchaseOrderDto = req.body;
      const purchaseOrder = await this.purchaseOrderService.create(dto);
      res.status(201).json(purchaseOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error creating purchase order' });
    }
  }

  async updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdatePurchaseOrderDto = req.body;
      const purchaseOrder = await this.purchaseOrderService.update(id, dto);
      
      if (purchaseOrder) {
        res.json(purchaseOrder);
      } else {
        res.status(404).json({ message: 'Purchase order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating purchase order' });
    }
  }

  async deletePurchaseOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.purchaseOrderService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting purchase order' });
    }
  }
} 