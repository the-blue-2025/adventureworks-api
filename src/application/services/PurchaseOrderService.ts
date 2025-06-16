import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder } from '../../domain/entities/PurchaseOrder';
import { PurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { CreatePurchaseOrderDto, PurchaseOrderDto, UpdatePurchaseOrderDto } from '../dtos/PurchaseOrderDto';
import { ShipMethodDto } from '../dtos/ShipMethodDto';
import { PurchaseOrderDetailDto } from '../dtos/PurchaseOrderDetailDto';
import { BaseApplicationService } from './BaseApplicationService';

@injectable()
export class PurchaseOrderService extends BaseApplicationService<PurchaseOrder, PurchaseOrderDto, CreatePurchaseOrderDto, UpdatePurchaseOrderDto> {
  constructor(
    @inject(TYPES.IPurchaseOrderRepository)
    private purchaseOrderRepository: IPurchaseOrderRepository
  ) {
    super();
  }

  async findAll(): Promise<PurchaseOrderDto[]> {
    const purchaseOrders = await this.purchaseOrderRepository.findAll();
    return purchaseOrders.map(po => this.toDto(po));
  }

  async findById(id: number): Promise<PurchaseOrderDto | null> {
    const purchaseOrder = await this.purchaseOrderRepository.findById(id);
    return purchaseOrder ? this.toDto(purchaseOrder) : null;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrderDto> {
    const purchaseOrder = this.toEntity(dto);
    await this.purchaseOrderRepository.create(purchaseOrder);
    return this.toDto(purchaseOrder);
  }

  async update(id: number, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrderDto | null> {
    const existingPurchaseOrder = await this.purchaseOrderRepository.findById(id);
    if (!existingPurchaseOrder) {
      return null;
    }

    const updatedPurchaseOrder = this.toEntity({ ...dto, purchaseOrderId: id } as CreatePurchaseOrderDto);
    await this.purchaseOrderRepository.update(updatedPurchaseOrder);
    return this.toDto(updatedPurchaseOrder);
  }

  async delete(id: number): Promise<void> {
    await this.purchaseOrderRepository.delete(id);
  }

  protected toDto(purchaseOrder: PurchaseOrder): PurchaseOrderDto {
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

  protected toEntity(dto: CreatePurchaseOrderDto | UpdatePurchaseOrderDto): PurchaseOrder {
    const purchaseOrderDetails = dto.purchaseOrderDetails?.map(detail =>
      PurchaseOrderDetail.createNew({
        purchaseOrderId: 'purchaseOrderId' in dto ? (dto as any).purchaseOrderId : 0,
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

    const baseDto = {
      purchaseOrderId: 'purchaseOrderId' in dto ? (dto as any).purchaseOrderId : 0,
      status: dto.status || 1, // Default status
      vendorId: dto.vendorId,
      orderDate: dto.orderDate || new Date(),
      shipDate: dto.shipDate || null,
      subTotal: dto.subTotal || 0,
      taxAmt: dto.taxAmt || 0,
      freight: dto.freight || 0,
      totalDue: this.calculateTotalDue(
        dto.subTotal || 0,
        dto.taxAmt || 0,
        dto.freight || 0
      ),
      modifiedDate: new Date(),
      purchaseOrderDetails
    };

    return PurchaseOrder.create(baseDto);
  }

  private calculateTotalDue(subTotal: number, taxAmt: number, freight: number): number {
    return subTotal + taxAmt + freight;
  }
} 