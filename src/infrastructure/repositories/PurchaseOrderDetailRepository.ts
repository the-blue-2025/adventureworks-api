import { injectable } from 'inversify';
import { IPurchaseOrderDetailRepository } from '../../domain/repositories/IPurchaseOrderDetailRepository';
import { PurchaseOrderDetail as DomainPurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { PurchaseOrderDetail, PurchaseOrderDetailInstance } from '../database/models/PurchaseOrderDetailModel';

@injectable()
export class PurchaseOrderDetailRepository implements IPurchaseOrderDetailRepository {
  async findAll(): Promise<DomainPurchaseOrderDetail[]> {
    const purchaseOrderDetails = await PurchaseOrderDetail.findAll({
      include: ['purchaseOrder']
    });
    return purchaseOrderDetails.map((pod: PurchaseOrderDetailInstance) => this.toDomain(pod));
  }

  async findById(id: number): Promise<DomainPurchaseOrderDetail | null> {
    const purchaseOrderDetail = await PurchaseOrderDetail.findByPk(id, {
      include: ['purchaseOrder']
    });
    return purchaseOrderDetail ? this.toDomain(purchaseOrderDetail) : null;
  }

  async create(purchaseOrderDetail: DomainPurchaseOrderDetail): Promise<DomainPurchaseOrderDetail> {
    const created = await PurchaseOrderDetail.create({
      purchaseOrderId: purchaseOrderDetail.purchaseOrderId,
      dueDate: purchaseOrderDetail.dueDate,
      orderQty: purchaseOrderDetail.orderQty,
      productId: purchaseOrderDetail.productId,
      unitPrice: purchaseOrderDetail.unitPrice,
      lineTotal: purchaseOrderDetail.lineTotal,
      receivedQty: purchaseOrderDetail.receivedQty,
      rejectedQty: purchaseOrderDetail.rejectedQty,
      stockedQty: purchaseOrderDetail.stockedQty,
      modifiedDate: new Date()
    });
    return this.toDomain(created);
  }

  async update(purchaseOrderDetail: DomainPurchaseOrderDetail): Promise<void> {
    await PurchaseOrderDetail.update(
      {
        dueDate: purchaseOrderDetail.dueDate,
        orderQty: purchaseOrderDetail.orderQty,
        productId: purchaseOrderDetail.productId,
        unitPrice: purchaseOrderDetail.unitPrice,
        lineTotal: purchaseOrderDetail.lineTotal,
        receivedQty: purchaseOrderDetail.receivedQty,
        rejectedQty: purchaseOrderDetail.rejectedQty,
        stockedQty: purchaseOrderDetail.stockedQty,
        modifiedDate: new Date()
      },
      {
        where: { purchaseOrderDetailId: purchaseOrderDetail.purchaseOrderDetailId }
      }
    );
  }

  async delete(id: number): Promise<void> {
    await PurchaseOrderDetail.destroy({
      where: { purchaseOrderDetailId: id }
    });
  }

  private toDomain(model: PurchaseOrderDetailInstance): DomainPurchaseOrderDetail {
    return DomainPurchaseOrderDetail.create({
      purchaseOrderDetailId: model.purchaseOrderDetailId,
      purchaseOrderId: model.purchaseOrderId,
      dueDate: model.dueDate,
      orderQty: model.orderQty,
      productId: model.productId,
      unitPrice: model.unitPrice,
      lineTotal: model.lineTotal,
      receivedQty: model.receivedQty,
      rejectedQty: model.rejectedQty,
      stockedQty: model.stockedQty,
      modifiedDate: model.modifiedDate,
      purchaseOrder: model.purchaseOrder ? undefined : undefined // Add proper mapping if needed
    });
  }
} 