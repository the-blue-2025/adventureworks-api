import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { VendorService } from '../../application/services/VendorService';
import { CreateVendorDto, UpdateVendorDto } from '../../application/dtos/VendorDto';
import { HttpStatusCode } from '../constants/HttpStatusCodes';

@injectable()
export class VendorController {
  constructor(
    @inject(TYPES.VendorService)
    private vendorService: VendorService
  ) {}

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const vendors = await this.vendorService.findAll();
      res.status(HttpStatusCode.OK).json(vendors);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving vendors' });
    }
  }

  async getVendorById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const vendor = await this.vendorService.findById(id);
      
      if (vendor) {
        res.status(HttpStatusCode.OK).json(vendor);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Vendor not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving vendor' });
    }
  }

  async createVendor(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateVendorDto = req.body;
      const vendor = await this.vendorService.create(dto);
      res.status(HttpStatusCode.CREATED).json(vendor);
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error creating vendor' });
    }
  }

  async updateVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateVendorDto = req.body;
      const vendor = await this.vendorService.update(id, dto);
      
      if (vendor) {
        res.status(HttpStatusCode.OK).json(vendor);
      } else {
        res.status(HttpStatusCode.NOT_FOUND).json({ message: 'Vendor not found' });
      }
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating vendor' });
    }
  }

  async deleteVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.vendorService.delete(id);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting vendor' });
    }
  }
} 