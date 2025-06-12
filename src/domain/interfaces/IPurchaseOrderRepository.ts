import { PurchaseOrder } from '../entities/PurchaseOrder';
import { PurchaseOrderDetail } from '../entities/PurchaseOrderDetail';

export interface IPurchaseOrderRepository {
  create(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;
  findById(id: number): Promise<PurchaseOrder | null>;
  findAll(): Promise<PurchaseOrder[]>;
  update(purchaseOrder: PurchaseOrder): Promise<PurchaseOrder>;
  delete(id: number): Promise<void>;
  createDetail(detail: {
    purchaseOrderId: number;
    dueDate: Date;
    orderQty: number;
    productId: number;
    unitPrice: number;
    receivedQty?: number;
    rejectedQty?: number;
  }): Promise<{
    purchaseOrderDetailId: number;
    purchaseOrderId: number;
    dueDate: Date;
    orderQty: number;
    productId: number;
    unitPrice: number;
    receivedQty: number;
    rejectedQty: number;
    modifiedDate: Date;
  }>;
  findDetailsByPurchaseOrderId(purchaseOrderId: number): Promise<PurchaseOrderDetail[]>;
  updateDetail(detail: PurchaseOrderDetail): Promise<PurchaseOrderDetail>;
  deleteDetail(id: number): Promise<void>;
} 