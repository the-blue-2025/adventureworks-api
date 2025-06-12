import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IPurchaseOrderRepository } from '../../domain/repositories/IPurchaseOrderRepository';
import { PurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { PurchaseOrderDetailDto, CreatePurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from '../dtos/PurchaseOrderDetailDto';

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

  async create(dto: CreatePurchaseOrderDetailDto): Promise<PurchaseOrderDetailDto> {
    // Calculate lineTotal based on orderQty and unitPrice
    const lineTotal = dto.orderQty * dto.unitPrice;

    const detail = PurchaseOrderDetail.create({
      purchaseOrderDetailId: 0, // This will be set by the database
      purchaseOrderId: dto.purchaseOrderId,
      dueDate: dto.dueDate,
      orderQty: dto.orderQty,
      productId: dto.productId,
      unitPrice: dto.unitPrice,
      lineTotal: lineTotal,
      receivedQty: dto.receivedQty ?? 0,
      rejectedQty: dto.rejectedQty ?? 0,
      stockedQty: dto.stockedQty ?? 0,
      modifiedDate: new Date()
    });

    const createdDetail = await this.purchaseOrderRepository.createDetail({
      purchaseOrderId: dto.purchaseOrderId,
      dueDate: dto.dueDate,
      orderQty: dto.orderQty,
      productId: dto.productId,
      unitPrice: dto.unitPrice,
      receivedQty: dto.receivedQty ?? 0,
      rejectedQty: dto.rejectedQty ?? 0
    });

    // Convert the repository response to a domain entity
    const domainDetail = PurchaseOrderDetail.create({
      purchaseOrderDetailId: createdDetail.purchaseOrderDetailId,
      purchaseOrderId: createdDetail.purchaseOrderId,
      dueDate: createdDetail.dueDate,
      orderQty: createdDetail.orderQty,
      productId: createdDetail.productId,
      unitPrice: createdDetail.unitPrice,
      lineTotal: createdDetail.orderQty * createdDetail.unitPrice,
      receivedQty: createdDetail.receivedQty,
      rejectedQty: createdDetail.rejectedQty,
      stockedQty: createdDetail.receivedQty - createdDetail.rejectedQty,
      modifiedDate: createdDetail.modifiedDate
    });

    return this.toDto(domainDetail);
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