import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { PurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from '../dtos/PurchaseOrderDetailDto';

@injectable()
export class PurchaseOrderDetailService {
  constructor(
    @inject(TYPES.IPurchaseOrderRepository)
    private purchaseOrderRepository: IPurchaseOrderRepository
  ) {}

  async findAll(): Promise<PurchaseOrderDetailDto[]> {
    const purchaseOrder = await this.purchaseOrderRepository.findAll();
    const details: PurchaseOrderDetail[] = [];
    purchaseOrder.forEach(po => {
      if (po.purchaseOrderDetails) {
        details.push(...po.purchaseOrderDetails);
      }
    });
    return details.map(detail => this.toDto(detail));
  }

  async findById(id: number): Promise<PurchaseOrderDetailDto | null> {
    const detail = await this.purchaseOrderRepository.findDetailById(id);
    return detail ? this.toDto(detail) : null;
  }

  async findByPurchaseOrderId(purchaseOrderId: number): Promise<PurchaseOrderDetailDto[]> {
    const details = await this.purchaseOrderRepository.findDetailsByPurchaseOrderId(purchaseOrderId);
    return details.map(detail => this.toDto(detail));
  }

  async update(id: number, dto: UpdatePurchaseOrderDetailDto): Promise<PurchaseOrderDetailDto | null> {
    const existingDetail = await this.purchaseOrderRepository.findDetailById(id);
    if (!existingDetail) {
      return null;
    }

    const updatedDetail = PurchaseOrderDetail.create({
      purchaseOrderDetailId: id,
      purchaseOrderId: existingDetail.purchaseOrderId,
      dueDate: dto.dueDate ?? existingDetail.dueDate,
      orderQty: dto.orderQty ?? existingDetail.orderQty,
      productId: dto.productId ?? existingDetail.productId,
      unitPrice: dto.unitPrice ?? existingDetail.unitPrice,
      lineTotal: (dto.orderQty ?? existingDetail.orderQty) * (dto.unitPrice ?? existingDetail.unitPrice),
      receivedQty: dto.receivedQty ?? existingDetail.receivedQty,
      rejectedQty: dto.rejectedQty ?? existingDetail.rejectedQty,
      stockedQty: dto.stockedQty ?? existingDetail.stockedQty,
      modifiedDate: new Date()
    });

    await this.purchaseOrderRepository.updateDetail(updatedDetail);
    return this.toDto(updatedDetail);
  }

  async delete(id: number): Promise<void> {
    await this.purchaseOrderRepository.deleteDetail(id);
  }

  private toDto(detail: PurchaseOrderDetail): PurchaseOrderDetailDto {
    return {
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
    };
  }
} 