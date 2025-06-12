import { Vendor } from '../entities/Vendor';

export interface IVendorRepository {
  findAll(): Promise<Vendor[]>;
  findById(id: number): Promise<Vendor | null>;
  create(vendor: Vendor): Promise<Vendor>;
  update(vendor: Vendor): Promise<Vendor>;
  delete(id: number): Promise<void>;
} 