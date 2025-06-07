import { injectable } from 'inversify';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder as DomainPurchaseOrder, PurchaseOrderProps } from '../../domain/entities/PurchaseOrder';
import { PurchaseOrder } from '../database/models/PurchaseOrderModel';
import { ShipMethod as DomainShipMethod } from '../../domain/entities/ShipMethod';

@injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
  async findAll(): Promise<DomainPurchaseOrder[]> {
    const purchaseOrders = await PurchaseOrder.findAll({
      include: ['shipMethod']
    });
    return purchaseOrders.map((po: PurchaseOrder) => this.toDomain(po));
  }

  async findById(id: number): Promise<DomainPurchaseOrder | null> {
    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: ['shipMethod']
    });
    return purchaseOrder ? this.toDomain(purchaseOrder) : null;
  }

  async create(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    await PurchaseOrder.create(this.toPersistence(purchaseOrder));
  }

  async update(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    await PurchaseOrder.update(
      this.toPersistence(purchaseOrder),
      {
        where: { purchaseOrderId: purchaseOrder.purchaseOrderId }
      }
    );
  }

  async delete(id: number): Promise<void> {
    await PurchaseOrder.destroy({
      where: { purchaseOrderId: id }
    });
  }

  private toDomain(model: PurchaseOrder): DomainPurchaseOrder {
    const props: PurchaseOrderProps = {
      purchaseOrderId: model.purchaseOrderId,
      status: model.status,
      employeeId: model.employeeId,
      vendorId: model.vendorId,
      orderDate: model.orderDate,
      shipDate: model.shipDate,
      subTotal: model.subTotal,
      taxAmt: model.taxAmt,
      freight: model.freight,
      totalDue: model.totalDue,
      modifiedDate: model.modifiedDate
    };

    if (model.shipMethod) {
      props.shipMethod = DomainShipMethod.create({
        shipMethodId: model.shipMethod.shipMethodId,
        name: model.shipMethod.name,
        shipBase: model.shipMethod.shipBase,
        shipRate: model.shipMethod.shipRate,
        modifiedDate: model.shipMethod.modifiedDate
      });
    }

    return DomainPurchaseOrder.create(props);
  }

  private toPersistence(domain: DomainPurchaseOrder): any {
    return {
      purchaseOrderId: domain.purchaseOrderId,
      status: domain.status,
      employeeId: domain.employeeId,
      vendorId: domain.vendorId,
      shipMethodId: domain.shipMethod?.shipMethodId,
      orderDate: domain.orderDate,
      shipDate: domain.shipDate,
      subTotal: domain.subTotal,
      taxAmt: domain.taxAmt,
      freight: domain.freight,
      totalDue: domain.totalDue,
      modifiedDate: domain.modifiedDate
    };
  }
} 