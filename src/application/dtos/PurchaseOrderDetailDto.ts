export interface PurchaseOrderDetailDto {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  dueDate: Date;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty: number;
}

export interface CreatePurchaseOrderDetailDto {
  dueDate: Date;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty: number;
}

export interface UpdatePurchaseOrderDetailDto {
  dueDate?: Date;
  orderQty?: number;
  productId?: number;
  unitPrice?: number;
  lineTotal?: number;
  receivedQty?: number;
  rejectedQty?: number;
  stockedQty?: number;
} 