import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrder } from '../../domain/entities/PurchaseOrder';
import { CreatePurchaseOrderDto, PurchaseOrderDto, UpdatePurchaseOrderDto } from '../dtos/PurchaseOrderDto';
import { ShipMethodDto } from '../dtos/ShipMethodDto';

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
    const purchaseOrder = PurchaseOrder.create({
      ...dto,
      purchaseOrderId: 0, // Will be set by database
      totalDue: this.calculateTotalDue(dto.subTotal, dto.taxAmt, dto.freight),
      modifiedDate: new Date(),
      shipDate: dto.shipDate || null
    });

    await this.purchaseOrderRepository.create(purchaseOrder);
    return this.toDto(purchaseOrder);
  }

  async update(id: number, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrderDto | null> {
    const existingPurchaseOrder = await this.purchaseOrderRepository.findById(id);
    if (!existingPurchaseOrder) {
      return null;
    }

    const updatedPurchaseOrder = PurchaseOrder.create({
      purchaseOrderId: existingPurchaseOrder.purchaseOrderId,
      status: dto.status ?? existingPurchaseOrder.status,
      employeeId: dto.employeeId ?? existingPurchaseOrder.employeeId,
      vendorId: dto.vendorId ?? existingPurchaseOrder.vendorId,
      orderDate: dto.orderDate ?? existingPurchaseOrder.orderDate,
      shipDate: dto.shipDate ?? existingPurchaseOrder.shipDate,
      subTotal: dto.subTotal ?? existingPurchaseOrder.subTotal,
      taxAmt: dto.taxAmt ?? existingPurchaseOrder.taxAmt,
      freight: dto.freight ?? existingPurchaseOrder.freight,
      modifiedDate: new Date(),
      totalDue: this.calculateTotalDue(
        dto.subTotal ?? existingPurchaseOrder.subTotal,
        dto.taxAmt ?? existingPurchaseOrder.taxAmt,
        dto.freight ?? existingPurchaseOrder.freight
      )
    });

    await this.purchaseOrderRepository.update(updatedPurchaseOrder);
    return this.toDto(updatedPurchaseOrder);
  }

  async delete(id: number): Promise<boolean> {
    const purchaseOrder = await this.purchaseOrderRepository.findById(id);
    if (!purchaseOrder) {
      return false;
    }

    await this.purchaseOrderRepository.delete(id);
    return true;
  }

  private toDto(purchaseOrder: PurchaseOrder): PurchaseOrderDto {
    const dto: PurchaseOrderDto = {
      purchaseOrderId: purchaseOrder.purchaseOrderId,
      status: purchaseOrder.status,
      employeeId: purchaseOrder.employeeId,
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

    return dto;
  }

  private calculateTotalDue(subTotal: number, taxAmt: number, freight: number): number {
    return subTotal + taxAmt + freight;
  }
} 