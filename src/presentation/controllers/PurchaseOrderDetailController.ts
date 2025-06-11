import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { PurchaseOrderDetailService } from '../../application/services/PurchaseOrderDetailService';
import { CreatePurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from '../../application/dtos/PurchaseOrderDetailDto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@injectable()
export class PurchaseOrderDetailController {
  constructor(
    @inject(TYPES.PurchaseOrderDetailService)
    private purchaseOrderDetailService: PurchaseOrderDetailService
  ) {}

  async getAllDetails(req: Request, res: Response): Promise<void> {
    try {
      const details = await this.purchaseOrderDetailService.findAll();
      res.status(HttpStatusCode.OK).json(details);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving purchase order details' });
    }
  }

  async getDetailById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detail = await this.purchaseOrderDetailService.findById(id);
      
      if (detail) {
        res.status(HttpStatusCode.OK).json(detail);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Purchase order detail not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving purchase order detail' });
    }
  }

  async getPurchaseOrderDetailsByPurchaseOrderId(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrderId = parseInt(req.params.purchaseOrderId);
      const details = await this.purchaseOrderDetailService.findByPurchaseOrderId(purchaseOrderId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving purchase order details' });
    }
  }

  async createDetail(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreatePurchaseOrderDetailDto = req.body;
      const detail = await this.purchaseOrderDetailService.create(dto);
      res.status(HttpStatusCode.CREATED).json(detail);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error creating purchase order detail' });
    }
  }

  async updateDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdatePurchaseOrderDetailDto = req.body;
      const detail = await this.purchaseOrderDetailService.update(id, dto);
      
      if (detail) {
        res.status(HttpStatusCode.OK).json(detail);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Purchase order detail not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating purchase order detail' });
    }
  }

  async deleteDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.purchaseOrderDetailService.delete(id);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting purchase order detail' });
    }
  }
} 