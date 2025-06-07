import { Router, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { VendorService } from '../../application/services/VendorService';
import { CreateVendorDto, UpdateVendorDto } from '../../application/dtos/VendorDto';

@injectable()
export class VendorController {
  public router: Router;

  constructor(
    @inject(TYPES.VendorService)
    private vendorService: VendorService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getAllVendors.bind(this));
    this.router.get('/:id', this.getVendorById.bind(this));
    this.router.post('/', this.createVendor.bind(this));
    this.router.put('/:id', this.updateVendor.bind(this));
    this.router.delete('/:id', this.deleteVendor.bind(this));
  }

  private async getAllVendors(_req: Request, res: Response) {
    try {
      const vendors = await this.vendorService.findAll();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving vendors' });
    }
  }

  private async getVendorById(req: Request, res: Response) {
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

  private async createVendor(req: Request, res: Response) {
    try {
      const dto: CreateVendorDto = req.body;
      const vendor = await this.vendorService.create(dto);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating vendor' });
    }
  }

  private async updateVendor(req: Request, res: Response) {
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

  private async deleteVendor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.vendorService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting vendor' });
    }
  }
} 