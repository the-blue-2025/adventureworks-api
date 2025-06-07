import { Entity } from '../common/Entity';
import { AggregateRoot } from '../common/AggregateRoot';
import { ShipMethod } from './ShipMethod';
import { PurchaseOrderDetail } from './PurchaseOrderDetail';

interface Employee {
  businessEntityId: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
}

interface Vendor {
  businessEntityId: number;
  name: string;
  accountNumber: string;
}

export interface PurchaseOrderProps {
  purchaseOrderId: number;
  status: number;
  vendorId: number;
  orderDate: Date;
  shipDate: Date | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  modifiedDate: Date;
  shipMethod?: ShipMethod;
  purchaseOrderDetails?: PurchaseOrderDetail[];
  employee?: Employee;
  vendor?: Vendor;
}

export class PurchaseOrder extends Entity<PurchaseOrderProps> implements AggregateRoot<PurchaseOrderProps> {
  get purchaseOrderId(): number {
    return this.props.purchaseOrderId;
  }

  get status(): number {
    return this.props.status;
  }

  get employeeId(): number | undefined {
    return this.props.employee?.businessEntityId;
  }

  get vendorId(): number {
    return this.props.vendorId;
  }

  get orderDate(): Date {
    return this.props.orderDate;
  }

  get shipDate(): Date | null {
    return this.props.shipDate;
  }

  get subTotal(): number {
    return this.props.subTotal;
  }

  get taxAmt(): number {
    return this.props.taxAmt;
  }

  get freight(): number {
    return this.props.freight;
  }

  get totalDue(): number {
    return this.props.totalDue;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  get shipMethod(): ShipMethod | undefined {
    return this.props.shipMethod;
  }

  get purchaseOrderDetails(): PurchaseOrderDetail[] | undefined {
    return this.props.purchaseOrderDetails;
  }

  get employee(): Employee | undefined {
    return this.props.employee;
  }

  get vendor(): Vendor | undefined {
    return this.props.vendor;
  }

  private constructor(props: PurchaseOrderProps) {
    super(props);
  }

  public static create(props: PurchaseOrderProps): PurchaseOrder {
    return new PurchaseOrder(props);
  }
} 