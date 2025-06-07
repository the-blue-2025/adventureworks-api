import { ShipMethodDto } from './ShipMethodDto';

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
} 