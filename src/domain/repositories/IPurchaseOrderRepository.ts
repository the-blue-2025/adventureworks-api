import { PurchaseOrder } from '../entities/PurchaseOrder';

export interface IPurchaseOrderRepository {
  findAll(): Promise<PurchaseOrder[]>;
  findById(id: number): Promise<PurchaseOrder | null>;
  create(purchaseOrder: PurchaseOrder): Promise<void>;
  update(purchaseOrder: PurchaseOrder): Promise<void>;
  delete(id: number): Promise<void>;
} 