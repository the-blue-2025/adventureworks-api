import { Entity } from '../common/Entity';
import { PurchaseOrder } from './PurchaseOrder';

export interface PurchaseOrderDetailProps {
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  dueDate: Date;
  orderQty: number;
  productId: number;
  unitPrice: number;
  lineTotal: number;
  receivedQty: number;
  rejectedQty: number;
  stockedQty?: number;
  modifiedDate: Date;
  purchaseOrder?: PurchaseOrder;
}

export class PurchaseOrderDetail extends Entity<PurchaseOrderDetailProps> {
  get purchaseOrderDetailId(): number {
    return this.props.purchaseOrderDetailId;
  }

  get purchaseOrderId(): number {
    return this.props.purchaseOrderId;
  }

  get dueDate(): Date {
    return this.props.dueDate;
  }

  get orderQty(): number {
    return this.props.orderQty;
  }

  get productId(): number {
    return this.props.productId;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get lineTotal(): number {
    return this.props.lineTotal;
  }

  get receivedQty(): number {
    return this.props.receivedQty;
  }

  get rejectedQty(): number {
    return this.props.rejectedQty;
  }

  get stockedQty(): number | undefined {
    return this.props.stockedQty;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  get purchaseOrder(): PurchaseOrder | undefined {
    return this.props.purchaseOrder;
  }

  private constructor(props: PurchaseOrderDetailProps) {
    super(props);
  }

  public static create(props: PurchaseOrderDetailProps): PurchaseOrderDetail {
    // Calculate lineTotal if not provided
    if (!props.lineTotal) {
      props.lineTotal = props.orderQty * props.unitPrice;
    }
    return new PurchaseOrderDetail(props);
  }

  public static createNew(props: Omit<PurchaseOrderDetailProps, 'purchaseOrderDetailId' | 'lineTotal'>): PurchaseOrderDetail {
    return this.create({
      ...props,
      purchaseOrderDetailId: 0,
      lineTotal: props.orderQty * props.unitPrice
    });
  }
} 