import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../infrastructure/ioc/types';
import { PurchaseOrderDetailService } from '../../application/services/PurchaseOrderDetailService';
import { CreatePurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from '../../application/dtos/PurchaseOrderDetailDto';

@injectable()
export class PurchaseOrderDetailController {
  constructor(
    @inject(TYPES.PurchaseOrderDetailService)
    private purchaseOrderDetailService: PurchaseOrderDetailService
  ) {}

  async getAllPurchaseOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrderDetails = await this.purchaseOrderDetailService.findAll();
      res.json(purchaseOrderDetails);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchase order details' });
    }
  }

  async getPurchaseOrderDetailById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const purchaseOrderDetail = await this.purchaseOrderDetailService.findById(id);
      
      if (purchaseOrderDetail) {
        res.json(purchaseOrderDetail);
      } else {
        res.status(404).json({ message: 'Purchase order detail not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchase order detail' });
    }
  }

  async createPurchaseOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreatePurchaseOrderDetailDto = req.body;
      const purchaseOrderDetail = await this.purchaseOrderDetailService.create(dto);
      res.status(201).json(purchaseOrderDetail);
    } catch (error) {
      res.status(500).json({ message: 'Error creating purchase order detail' });
    }
  }

  async updatePurchaseOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdatePurchaseOrderDetailDto = req.body;
      const purchaseOrderDetail = await this.purchaseOrderDetailService.update(id, dto);
      
      if (purchaseOrderDetail) {
        res.json(purchaseOrderDetail);
      } else {
        res.status(404).json({ message: 'Purchase order detail not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating purchase order detail' });
    }
  }

  async deletePurchaseOrderDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.purchaseOrderDetailService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting purchase order detail' });
    }
  }
} 