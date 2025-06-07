import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { VendorService } from '../../application/services/VendorService';
import { CreateVendorDto, UpdateVendorDto } from '../../application/dtos/VendorDto';

@injectable()
export class VendorController {
  constructor(
    @inject(TYPES.VendorService)
    private vendorService: VendorService
  ) {}

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const vendors = await this.vendorService.findAll();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving vendors' });
    }
  }

  async getVendorById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const vendor = await this.vendorService.findById(id);
      
      if (vendor) {
        res.json(vendor);
      } else {
        res.status(404).json({ message: 'Vendor not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving vendor' });
    }
  }

  async createVendor(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateVendorDto = req.body;
      const vendor = await this.vendorService.create(dto);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating vendor' });
    }
  }

  async updateVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdateVendorDto = req.body;
      const vendor = await this.vendorService.update(id, dto);
      
      if (vendor) {
        res.json(vendor);
      } else {
        res.status(404).json({ message: 'Vendor not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating vendor' });
    }
  }

  async deleteVendor(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.vendorService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting vendor' });
    }
  }
} 