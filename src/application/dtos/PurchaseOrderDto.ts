import { ShipMethodDto } from './ShipMethodDto';
import { PurchaseOrderDetailDto, CreatePurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from './PurchaseOrderDetailDto';

export interface PurchaseOrderDto {
  purchaseOrderId: number;
  status: number;
  employeeId: number;
  vendorId: number;
  orderDate: Date;
  shipDate: Date | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  shipMethod?: ShipMethodDto;
  purchaseOrderDetails?: PurchaseOrderDetailDto[];
}

export interface CreatePurchaseOrderDto {
  status: number;
  employeeId: number;
  vendorId: number;
  shipMethodId: number;
  orderDate: Date;
  shipDate?: Date;
  subTotal: number;
  taxAmt: number;
  freight: number;
  purchaseOrderDetails?: CreatePurchaseOrderDetailDto[];
}

export interface UpdatePurchaseOrderDto {
  status?: number;
  employeeId?: number;
  vendorId?: number;
  shipMethodId?: number;
  orderDate?: Date;
  shipDate?: Date;
  subTotal?: number;
  taxAmt?: number;
  freight?: number;
  purchaseOrderDetails?: CreatePurchaseOrderDetailDto[];
} 