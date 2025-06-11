import { injectable } from 'inversify';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder as DomainPurchaseOrder, PurchaseOrderProps } from '../../domain/entities/PurchaseOrder';
import { PurchaseOrderDetail as DomainPurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { PurchaseOrder, PurchaseOrderInstance } from '../database/models/PurchaseOrderModel';
import { PurchaseOrderDetail, PurchaseOrderDetailInstance } from '../database/models/PurchaseOrderDetailModel';
import { ShipMethod as DomainShipMethod } from '../../domain/entities/ShipMethod';
import { Transaction, WhereOptions } from 'sequelize';
import sequelize from '../database/config';
import { BaseRepository } from './BaseRepository';
import { RepositoryError } from '../../domain/errors/RepositoryError';

@injectable()
export class PurchaseOrderRepository extends BaseRepository<DomainPurchaseOrder, PurchaseOrderInstance, number> implements IPurchaseOrderRepository {
  protected readonly model = PurchaseOrder;

  protected getIdField(): string {
    return 'purchaseOrderId';
  }

  protected getEntityName(): string {
    return 'PurchaseOrder';
  }

  // Override base methods to include relationships
  async findAll(): Promise<DomainPurchaseOrder[]> {
    try {
      const purchaseOrders = await this.model.findAll({
        include: ['shipMethod', 'purchaseOrderDetails', 'employee', 'vendor']
      });
      return purchaseOrders.map((po: PurchaseOrderInstance) => this.toDomain(po));
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch all purchase orders with relationships`,
        'findAll',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  async findById(id: number): Promise<DomainPurchaseOrder | null> {
    try {
      const purchaseOrder = await this.model.findByPk(id, {
        include: ['shipMethod', 'purchaseOrderDetails', 'employee', 'vendor']
      });
      return purchaseOrder ? this.toDomain(purchaseOrder) : null;
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch purchase order with ID ${id} and its relationships`,
        'findById',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  // Override create to handle details in transaction
  async create(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const createdPO = await this.model.create(this.toPersistence(purchaseOrder), { transaction: t });
      
      if (purchaseOrder.purchaseOrderDetails) {
        const details = purchaseOrder.purchaseOrderDetails.map(detail => ({
          ...this.toDetailPersistence(detail),
          purchaseOrderId: createdPO.purchaseOrderId
        }));
        await PurchaseOrderDetail.bulkCreate(details, { transaction: t });
      }
      
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RepositoryError(
        `Failed to create purchase order with its details`,
        'create',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  // Override update to handle details in transaction
  async update(purchaseOrder: DomainPurchaseOrder): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const where = { purchaseOrderId: purchaseOrder.purchaseOrderId } as WhereOptions<PurchaseOrderInstance>;
      await this.model.update(
        this.toPersistence(purchaseOrder),
        { where, transaction: t }
      );

      if (purchaseOrder.purchaseOrderDetails) {
        const detailsWhere = { purchaseOrderId: purchaseOrder.purchaseOrderId } as WhereOptions<PurchaseOrderDetailInstance>;
        await PurchaseOrderDetail.destroy({
          where: detailsWhere,
          transaction: t
        });

        const details = purchaseOrder.purchaseOrderDetails.map(detail => ({
          ...this.toDetailPersistence(detail),
          purchaseOrderId: purchaseOrder.purchaseOrderId
        }));
        await PurchaseOrderDetail.bulkCreate(details, { transaction: t });
      }

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RepositoryError(
        `Failed to update purchase order with ID ${purchaseOrder.purchaseOrderId} and its details`,
        'update',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  // Override delete to handle details in transaction
  async delete(id: number): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const detailsWhere = { purchaseOrderId: id } as WhereOptions<PurchaseOrderDetailInstance>;
      await PurchaseOrderDetail.destroy({
        where: detailsWhere,
        transaction: t
      });

      const where = { purchaseOrderId: id } as WhereOptions<PurchaseOrderInstance>;
      await this.model.destroy({
        where,
        transaction: t
      });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw new RepositoryError(
        `Failed to delete purchase order with ID ${id} and its details`,
        'delete',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  // Additional methods specific to PurchaseOrder
  async findDetailById(id: number): Promise<DomainPurchaseOrderDetail | null> {
    try {
      const detail = await PurchaseOrderDetail.findByPk(id, {
        include: ['purchaseOrder']
      });
      return detail ? this.toDetailDomain(detail) : null;
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch purchase order detail with ID ${id}`,
        'findDetailById',
        'PurchaseOrderDetail',
        error instanceof Error ? error : undefined
      );
    }
  }

  async findDetailsByPurchaseOrderId(purchaseOrderId: number): Promise<DomainPurchaseOrderDetail[]> {
    try {
      const where = { purchaseOrderId } as WhereOptions<PurchaseOrderDetailInstance>;
      const details = await PurchaseOrderDetail.findAll({
        where,
        include: ['purchaseOrder']
      });
      return details.map(detail => this.toDetailDomain(detail));
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch purchase order details for purchase order ID ${purchaseOrderId}`,
        'findDetailsByPurchaseOrderId',
        'PurchaseOrderDetail',
        error instanceof Error ? error : undefined
      );
    }
  }

  async updateDetail(purchaseOrderDetail: DomainPurchaseOrderDetail): Promise<void> {
    try {
      const where = { purchaseOrderDetailId: purchaseOrderDetail.purchaseOrderDetailId } as WhereOptions<PurchaseOrderDetailInstance>;
      await PurchaseOrderDetail.update(
        this.toDetailPersistence(purchaseOrderDetail),
        { where }
      );
    } catch (error) {
      throw new RepositoryError(
        `Failed to update purchase order detail with ID ${purchaseOrderDetail.purchaseOrderDetailId}`,
        'updateDetail',
        'PurchaseOrderDetail',
        error instanceof Error ? error : undefined
      );
    }
  }

  async deleteDetail(id: number): Promise<void> {
    try {
      const where = { purchaseOrderDetailId: id } as WhereOptions<PurchaseOrderDetailInstance>;
      await PurchaseOrderDetail.destroy({ where });
    } catch (error) {
      throw new RepositoryError(
        `Failed to delete purchase order detail with ID ${id}`,
        'deleteDetail',
        'PurchaseOrderDetail',
        error instanceof Error ? error : undefined
      );
    }
  }

  async createDetail(purchaseOrderDetail: DomainPurchaseOrderDetail): Promise<void> {
    try {
      await PurchaseOrderDetail.create(this.toDetailPersistence(purchaseOrderDetail));
    } catch (error) {
      throw new RepositoryError(
        `Failed to create purchase order detail for purchase order ID ${purchaseOrderDetail.purchaseOrderId}`,
        'createDetail',
        'PurchaseOrderDetail',
        error instanceof Error ? error : undefined
      );
    }
  }

  protected toDomain(model: PurchaseOrderInstance): DomainPurchaseOrder {
    const props: PurchaseOrderProps = {
      purchaseOrderId: model.purchaseOrderId,
      status: model.status,
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
        modifiedDate: model.modifiedDate
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

    if (model.employee) {
      props.employee = {
        businessEntityId: model.employee.businessEntityId,
        firstName: model.employee.firstName,
        middleName: model.employee.middleName,
        lastName: model.employee.lastName
      };
    }

    if (model.vendor) {
      props.vendor = {
        businessEntityId: model.vendor.businessEntityId,
        name: model.vendor.name,
        accountNumber: model.vendor.accountNumber
      };
    }

    return DomainPurchaseOrder.create(props);
  }

  protected toPersistence(domain: DomainPurchaseOrder): any {
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

  private toDetailDomain(model: PurchaseOrderDetailInstance): DomainPurchaseOrderDetail {
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
      modifiedDate: model.modifiedDate
    });
  }

  private toDetailPersistence(domain: DomainPurchaseOrderDetail): any {
    return {
      purchaseOrderDetailId: domain.purchaseOrderDetailId,
      purchaseOrderId: domain.purchaseOrderId,
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