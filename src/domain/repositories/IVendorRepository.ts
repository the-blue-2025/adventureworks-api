import { Vendor } from '../entities/Vendor';

export interface IVendorRepository {
  findAll(): Promise<Vendor[]>;
  findById(id: number): Promise<Vendor | null>;
  create(vendor: Vendor): Promise<void>;
  update(vendor: Vendor): Promise<void>;
  delete(id: number): Promise<void>;
} 