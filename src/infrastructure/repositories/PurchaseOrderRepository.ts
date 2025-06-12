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
import { IPurchaseOrderRepository as IPurchaseOrderRepositoryInterface } from '../../domain/interfaces/IPurchaseOrderRepository';

@injectable()
export class PurchaseOrderRepository extends BaseRepository<DomainPurchaseOrder, PurchaseOrderInstance, number> implements IPurchaseOrderRepositoryInterface {
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
  async create(purchaseOrder: DomainPurchaseOrder): Promise<DomainPurchaseOrder> {
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

      return this.toDomain(createdPO);
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
  async update(purchaseOrder: DomainPurchaseOrder): Promise<DomainPurchaseOrder> {
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

      // Fetch the updated purchase order with all its relationships
      const updatedPO = await this.model.findByPk(purchaseOrder.purchaseOrderId, {
        include: ['shipMethod', 'purchaseOrderDetails', 'employee', 'vendor']
      });

      if (!updatedPO) {
        throw new RepositoryError(
          `Failed to fetch updated purchase order with ID ${purchaseOrder.purchaseOrderId}`,
          'update',
          this.getEntityName()
        );
      }

      return this.toDomain(updatedPO);
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

  async updateDetail(purchaseOrderDetail: DomainPurchaseOrderDetail): Promise<DomainPurchaseOrderDetail> {
    try {
      const where = { purchaseOrderDetailId: purchaseOrderDetail.purchaseOrderDetailId } as WhereOptions<PurchaseOrderDetailInstance>;
      await PurchaseOrderDetail.update(
        this.toDetailPersistence(purchaseOrderDetail),
        { 
          where,
          returning: false
        }
      );

      // Fetch the updated detail with its relationships
      const updatedDetail = await PurchaseOrderDetail.findByPk(purchaseOrderDetail.purchaseOrderDetailId, {
        include: ['purchaseOrder']
      });

      if (!updatedDetail) {
        throw new RepositoryError(
          `Failed to fetch updated purchase order detail with ID ${purchaseOrderDetail.purchaseOrderDetailId}`,
          'updateDetail',
          'PurchaseOrderDetail'
        );
      }

      return this.toDetailDomain(updatedDetail);
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

  async createDetail(detail: {
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
  }> {
    const t = await sequelize.transaction();
    try {
      if (!detail.purchaseOrderId) {
        throw new Error('PurchaseOrderId is required');
      }

      if (!detail.dueDate) {
        throw new Error('DueDate is required');
      }

      const persistenceData = {
        purchaseOrderId: detail.purchaseOrderId,
        dueDate: detail.dueDate,
        orderQty: detail.orderQty,
        productId: detail.productId,
        unitPrice: Number(detail.unitPrice.toFixed(4)),
        receivedQty: Number((detail.receivedQty || 0).toFixed(2)),
        rejectedQty: Number((detail.rejectedQty || 0).toFixed(2)),
        modifiedDate: new Date()
      };

      // Create the record without using OUTPUT clause
      await PurchaseOrderDetail.create(persistenceData, { transaction: t });

      // Get the created record using a separate query
      const createdDetail = await PurchaseOrderDetail.findOne({
        where: {
          purchaseOrderId: detail.purchaseOrderId,
          productId: detail.productId,
          orderQty: detail.orderQty,
          unitPrice: persistenceData.unitPrice
        },
        order: [['modifiedDate', 'DESC']],
        transaction: t
      });

      if (!createdDetail) {
        throw new Error('Failed to retrieve created purchase order detail');
      }

      await t.commit();

      return {
        purchaseOrderDetailId: createdDetail.purchaseOrderDetailId,
        purchaseOrderId: createdDetail.purchaseOrderId,
        dueDate: createdDetail.dueDate,
        orderQty: createdDetail.orderQty,
        productId: createdDetail.productId,
        unitPrice: Number(createdDetail.unitPrice),
        receivedQty: Number(createdDetail.receivedQty),
        rejectedQty: Number(createdDetail.rejectedQty),
        modifiedDate: createdDetail.modifiedDate
      };
    } catch (error) {
      await t.rollback();
      console.error('Error creating purchase order detail:', error);
      throw error;
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
          lineTotal: detail.lineTotal ?? detail.orderQty * detail.unitPrice,
          receivedQty: detail.receivedQty,
          rejectedQty: detail.rejectedQty,
          stockedQty: detail.stockedQty ?? detail.receivedQty - detail.rejectedQty,
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
    const now = new Date();
    return {
      purchaseOrderId: domain.purchaseOrderId,
      status: domain.status,
      employeeId: domain.employeeId,
      vendorId: domain.vendorId,
      shipMethodId: domain.shipMethod?.shipMethodId,
      orderDate: domain.orderDate ? new Date(domain.orderDate) : null,
      shipDate: domain.shipDate ? new Date(domain.shipDate) : null,
      subTotal: domain.subTotal,
      taxAmt: domain.taxAmt,
      freight: domain.freight,
      totalDue: domain.totalDue,
      modifiedDate: now
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
      lineTotal: model.lineTotal ?? model.orderQty * model.unitPrice,
      receivedQty: model.receivedQty,
      rejectedQty: model.rejectedQty,
      stockedQty: model.stockedQty ?? model.receivedQty - model.rejectedQty,
      modifiedDate: model.modifiedDate
    });
  }

  private toDetailPersistence(domain: DomainPurchaseOrderDetail): any {
    const { lineTotal, stockedQty, ...rest } = domain;
    const now = new Date();
    return {
      purchaseOrderId: domain.purchaseOrderId,
      purchaseOrderDetailId: domain.purchaseOrderDetailId,
      dueDate: domain.dueDate ? new Date(domain.dueDate) : null,
      orderQty: domain.orderQty,
      productId: domain.productId,
      unitPrice: domain.unitPrice,
      receivedQty: domain.receivedQty,
      rejectedQty: domain.rejectedQty,
      modifiedDate: now
    };
  }
} 