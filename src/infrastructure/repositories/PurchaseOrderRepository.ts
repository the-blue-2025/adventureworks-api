import { injectable } from 'inversify';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder as DomainPurchaseOrder, PurchaseOrderProps } from '../../domain/entities/PurchaseOrder';
import { PurchaseOrderDetail as DomainPurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { PurchaseOrder, PurchaseOrderInstance } from '../database/models/PurchaseOrderModel';
import { PurchaseOrderDetail } from '../database/models/PurchaseOrderDetailModel';
import { ShipMethod as DomainShipMethod } from '../../domain/entities/ShipMethod';
import { Transaction } from 'sequelize';
import sequelize from '../database/config';

@injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
  async findAll(): Promise<DomainPurchaseOrder[]> {
    const purchaseOrders = await PurchaseOrder.findAll({
      include: ['shipMethod', 'purchaseOrderDetails']
    });
    return purchaseOrders.map((po: PurchaseOrderInstance) => this.toDomain(po));
  }

  async findById(id: number): Promise<DomainPurchaseOrder | null> {
    const purchaseOrder = await PurchaseOrder.findByPk(id, {
      include: ['shipMethod', 'purchaseOrderDetails']
    });
    return purchaseOrder ? this.toDomain(purchaseOrder) : null;
  }

  async create(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const createdPO = await PurchaseOrder.create(this.toPersistence(purchaseOrder), { transaction: t });
      
      if (purchaseOrder.purchaseOrderDetails) {
        const details = purchaseOrder.purchaseOrderDetails.map(detail => ({
          ...this.toPersistenceDetail(detail),
          purchaseOrderId: createdPO.purchaseOrderId
        }));
        await PurchaseOrderDetail.bulkCreate(details, { transaction: t });
      }
      
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async update(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    const t = await sequelize.transaction();
    try {
      await PurchaseOrder.update(
        this.toPersistence(purchaseOrder),
        {
          where: { purchaseOrderId: purchaseOrder.purchaseOrderId },
          transaction: t
        }
      );

      if (purchaseOrder.purchaseOrderDetails) {
        // Delete existing details
        await PurchaseOrderDetail.destroy({
          where: { purchaseOrderId: purchaseOrder.purchaseOrderId },
          transaction: t
        });

        // Create new details
        const details = purchaseOrder.purchaseOrderDetails.map(detail => ({
          ...this.toPersistenceDetail(detail),
          purchaseOrderId: purchaseOrder.purchaseOrderId
        }));
        await PurchaseOrderDetail.bulkCreate(details, { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const t = await sequelize.transaction();
    try {
      // Delete details first due to foreign key constraint
      await PurchaseOrderDetail.destroy({
        where: { purchaseOrderId: id },
        transaction: t
      });

      await PurchaseOrder.destroy({
        where: { purchaseOrderId: id },
        transaction: t
      });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  private toDomain(model: PurchaseOrderInstance): DomainPurchaseOrder {
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

    if (model.purchaseOrderDetails) {
      props.purchaseOrderDetails = model.purchaseOrderDetails.map(detail => 
        DomainPurchaseOrderDetail.create({
          purchaseOrderDetailId: detail.purchaseOrderDetailId,
          purchaseOrderId: detail.purchaseOrderId,
          dueDate: detail.dueDate,
          orderQty: detail.orderQty,
          productId: detail.productId,
          unitPrice: detail.unitPrice,
          lineTotal: detail.lineTotal,
          receivedQty: detail.receivedQty,
          rejectedQty: detail.rejectedQty,
          stockedQty: detail.stockedQty,
          modifiedDate: detail.modifiedDate
        })
      );
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

  private toPersistenceDetail(domain: DomainPurchaseOrderDetail): any {
    return {
      purchaseOrderDetailId: domain.purchaseOrderDetailId,
      dueDate: domain.dueDate,
      orderQty: domain.orderQty,
      productId: domain.productId,
      unitPrice: domain.unitPrice,
      lineTotal: domain.lineTotal,
      receivedQty: domain.receivedQty,
      rejectedQty: domain.rejectedQty,
      stockedQty: domain.stockedQty,
      modifiedDate: domain.modifiedDate
    };
  }
} 