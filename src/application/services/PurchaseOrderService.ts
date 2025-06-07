import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder } from '../../domain/entities/PurchaseOrder';
import { PurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { CreatePurchaseOrderDto, PurchaseOrderDto, UpdatePurchaseOrderDto } from '../dtos/PurchaseOrderDto';
import { ShipMethodDto } from '../dtos/ShipMethodDto';
import { PurchaseOrderDetailDto } from '../dtos/PurchaseOrderDetailDto';

@injectable()
export class PurchaseOrderService {
  constructor(
    @inject(TYPES.IPurchaseOrderRepository)
    private purchaseOrderRepository: IPurchaseOrderRepository
  ) {}

  async findAll(): Promise<PurchaseOrderDto[]> {
    const purchaseOrders = await this.purchaseOrderRepository.findAll();
    return purchaseOrders.map(po => this.toDto(po));
  }

  async findById(id: number): Promise<PurchaseOrderDto | null> {
    const purchaseOrder = await this.purchaseOrderRepository.findById(id);
    return purchaseOrder ? this.toDto(purchaseOrder) : null;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderDto> {
    const purchaseOrderDetails = dto.purchaseOrderDetails?.map(detail =>
      PurchaseOrderDetail.createNew({
        purchaseOrderId: 0, // Will be set by database
        dueDate: detail.dueDate,
        orderQty: detail.orderQty,
        productId: detail.productId,
        unitPrice: detail.unitPrice,
        receivedQty: detail.receivedQty || 0,
        rejectedQty: detail.rejectedQty || 0,
        stockedQty: detail.stockedQty || 0,
        modifiedDate: new Date()
      })
    );

    const purchaseOrder = PurchaseOrder.create({
      ...dto,
      purchaseOrderId: 0, // Will be set by database
      totalDue: this.calculateTotalDue(dto.subTotal, dto.taxAmt, dto.freight),
      modifiedDate: new Date(),
      shipDate: dto.shipDate || null,
      purchaseOrderDetails
    });

    await this.purchaseOrderRepository.create(purchaseOrder);
    return this.toDto(purchaseOrder);
  }

  async update(id: number, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrderDto | null> {
    const existingPurchaseOrder = await this.purchaseOrderRepository.findById(id);
    if (!existingPurchaseOrder) {
      return null;
    }

    const purchaseOrderDetails = dto.purchaseOrderDetails?.map(detail =>
      PurchaseOrderDetail.createNew({
        purchaseOrderId: id,
        dueDate: detail.dueDate,
        orderQty: detail.orderQty,
        productId: detail.productId,
        unitPrice: detail.unitPrice,
        receivedQty: detail.receivedQty || 0,
        rejectedQty: detail.rejectedQty || 0,
        stockedQty: detail.stockedQty || 0,
        modifiedDate: new Date()
      })
    );

    const updatedPurchaseOrder = PurchaseOrder.create({
      purchaseOrderId: id,
      status: dto.status ?? existingPurchaseOrder.status,
      vendorId: dto.vendorId ?? existingPurchaseOrder.vendorId,
      orderDate: dto.orderDate ?? existingPurchaseOrder.orderDate,
      shipDate: dto.shipDate ?? existingPurchaseOrder.shipDate,
      subTotal: dto.subTotal ?? existingPurchaseOrder.subTotal,
      taxAmt: dto.taxAmt ?? existingPurchaseOrder.taxAmt,
      freight: dto.freight ?? existingPurchaseOrder.freight,
      totalDue: this.calculateTotalDue(
        dto.subTotal ?? existingPurchaseOrder.subTotal,
        dto.taxAmt ?? existingPurchaseOrder.taxAmt,
        dto.freight ?? existingPurchaseOrder.freight
      ),
      modifiedDate: new Date(),
      purchaseOrderDetails: purchaseOrderDetails || existingPurchaseOrder.purchaseOrderDetails
    });

    await this.purchaseOrderRepository.update(updatedPurchaseOrder);
    return this.toDto(updatedPurchaseOrder);
  }

  async delete(id: number): Promise<void> {
    await this.purchaseOrderRepository.delete(id);
  }

  private toDto(purchaseOrder: PurchaseOrder): PurchaseOrderDto {
    const dto: PurchaseOrderDto = {
      purchaseOrderId: purchaseOrder.purchaseOrderId,
      status: purchaseOrder.status,
      vendorId: purchaseOrder.vendorId,
      orderDate: purchaseOrder.orderDate,
      shipDate: purchaseOrder.shipDate,
      subTotal: purchaseOrder.subTotal,
      taxAmt: purchaseOrder.taxAmt,
      freight: purchaseOrder.freight,
      totalDue: purchaseOrder.totalDue
    };

    if (purchaseOrder.shipMethod) {
      dto.shipMethod = {
        shipMethodId: purchaseOrder.shipMethod.shipMethodId,
        name: purchaseOrder.shipMethod.name,
        shipBase: purchaseOrder.shipMethod.shipBase,
        shipRate: purchaseOrder.shipMethod.shipRate
      };
    }

    if (purchaseOrder.purchaseOrderDetails) {
      dto.purchaseOrderDetails = purchaseOrder.purchaseOrderDetails.map(detail => ({
        purchaseOrderDetailId: detail.purchaseOrderDetailId,
        purchaseOrderId: detail.purchaseOrderId,
        dueDate: detail.dueDate,
        orderQty: detail.orderQty,
        productId: detail.productId,
        unitPrice: detail.unitPrice,
        lineTotal: detail.lineTotal,
        receivedQty: detail.receivedQty,
        rejectedQty: detail.rejectedQty,
        stockedQty: detail.stockedQty
      }));
    }

    if (purchaseOrder.employee) {
      dto.employee = {
        businessEntityId: purchaseOrder.employee.businessEntityId,
        firstName: purchaseOrder.employee.firstName,
        middleName: purchaseOrder.employee.middleName,
        lastName: purchaseOrder.employee.lastName
      };
    }

    if (purchaseOrder.vendor) {
      dto.vendor = {
        businessEntityId: purchaseOrder.vendor.businessEntityId,
        name: purchaseOrder.vendor.name,
        accountNumber: purchaseOrder.vendor.accountNumber
      };
    }

    return dto;
  }

  private calculateTotalDue(subTotal: number, taxAmt: number, freight: number): number {
    return subTotal + taxAmt + freight;
  }
} 