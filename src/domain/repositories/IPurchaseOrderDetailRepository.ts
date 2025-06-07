import { PurchaseOrderDetail } from '../entities/PurchaseOrderDetail';

export interface IPurchaseOrderDetailRepository {
  findAll(): Promise<PurchaseOrderDetail[]>;
  findById(id: number): Promise<PurchaseOrderDetail | null>;
  create(purchaseOrderDetail: PurchaseOrderDetail): Promise<PurchaseOrderDetail>;
  update(purchaseOrderDetail: PurchaseOrderDetail): Promise<void>;
  delete(id: number): Promise<void>;
} 