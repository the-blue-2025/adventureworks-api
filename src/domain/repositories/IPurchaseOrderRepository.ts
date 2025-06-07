import { PurchaseOrder } from '../entities/PurchaseOrder';
import { PurchaseOrderDetail } from '../entities/PurchaseOrderDetail';

export interface IPurchaseOrderRepository {
  findAll(): Promise<PurchaseOrder[]>;
  findById(id: number): Promise<PurchaseOrder | null>;
  findDetailById(id: number): Promise<PurchaseOrderDetail | null>;
  findDetailsByPurchaseOrderId(purchaseOrderId: number): Promise<PurchaseOrderDetail[]>;
  create(purchaseOrder: PurchaseOrder): Promise<void>;
  update(purchaseOrder: PurchaseOrder): Promise<void>;
  updateDetail(purchaseOrderDetail: PurchaseOrderDetail): Promise<void>;
  delete(id: number): Promise<void>;
  deleteDetail(id: number): Promise<void>;
} 