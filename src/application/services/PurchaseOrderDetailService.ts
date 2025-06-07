import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { IPurchaseOrderDetailRepository } from '../../domain/repositories/IPurchaseOrderDetailRepository';
import { PurchaseOrderDetail } from '../../domain/entities/PurchaseOrderDetail';
import { 
  PurchaseOrderDetailDto, 
  CreatePurchaseOrderDetailDto, 
  UpdatePurchaseOrderDetailDto 
} from '../dtos/PurchaseOrderDetailDto';

@injectable()
export class PurchaseOrderDetailService {
  constructor(
    @inject(TYPES.IPurchaseOrderDetailRepository)
    private purchaseOrderDetailRepository: IPurchaseOrderDetailRepository
  ) {}

  async findAll(): Promise<PurchaseOrderDetailDto[]> {
    const purchaseOrderDetails = await this.purchaseOrderDetailRepository.findAll();
    return purchaseOrderDetails.map(pod => this.toDto(pod));
  }

  async findById(id: number): Promise<PurchaseOrderDetailDto | null> {
    const purchaseOrderDetail = await this.purchaseOrderDetailRepository.findById(id);
    return purchaseOrderDetail ? this.toDto(purchaseOrderDetail) : null;
  }

  async create(dto: CreatePurchaseOrderDetailDto): Promise<PurchaseOrderDetailDto> {
    const purchaseOrderDetail = PurchaseOrderDetail.createNew({
      purchaseOrderId: dto.purchaseOrderId,
      dueDate: dto.dueDate,
      orderQty: dto.orderQty,
      productId: dto.productId,
      unitPrice: dto.unitPrice,
      receivedQty: dto.receivedQty || 0,
      rejectedQty: dto.rejectedQty || 0,
      stockedQty: dto.stockedQty || 0,
      modifiedDate: new Date()
    });

    const created = await this.purchaseOrderDetailRepository.create(purchaseOrderDetail);
    return this.toDto(created);
  }

  async update(id: number, dto: UpdatePurchaseOrderDetailDto): Promise<PurchaseOrderDetailDto | null> {
    const existingPurchaseOrderDetail = await this.purchaseOrderDetailRepository.findById(id);
    if (!existingPurchaseOrderDetail) {
      return null;
    }

    const orderQty = dto.orderQty ?? existingPurchaseOrderDetail.orderQty;
    const unitPrice = dto.unitPrice ?? existingPurchaseOrderDetail.unitPrice;

    const updatedPurchaseOrderDetail = PurchaseOrderDetail.create({
      purchaseOrderDetailId: id,
      purchaseOrderId: existingPurchaseOrderDetail.purchaseOrderId,
      dueDate: dto.dueDate ?? existingPurchaseOrderDetail.dueDate,
      orderQty: orderQty,
      productId: dto.productId ?? existingPurchaseOrderDetail.productId,
      unitPrice: unitPrice,
      lineTotal: orderQty * unitPrice,
      receivedQty: dto.receivedQty ?? existingPurchaseOrderDetail.receivedQty,
      rejectedQty: dto.rejectedQty ?? existingPurchaseOrderDetail.rejectedQty,
      stockedQty: dto.stockedQty ?? existingPurchaseOrderDetail.stockedQty,
      modifiedDate: new Date()
    });

    await this.purchaseOrderDetailRepository.update(updatedPurchaseOrderDetail);
    return this.toDto(updatedPurchaseOrderDetail);
  }

  async delete(id: number): Promise<void> {
    await this.purchaseOrderDetailRepository.delete(id);
  }

  private toDto(purchaseOrderDetail: PurchaseOrderDetail): PurchaseOrderDetailDto {
    return {
      purchaseOrderDetailId: purchaseOrderDetail.purchaseOrderDetailId,
      purchaseOrderId: purchaseOrderDetail.purchaseOrderId,
      dueDate: purchaseOrderDetail.dueDate,
      orderQty: purchaseOrderDetail.orderQty,
      productId: purchaseOrderDetail.productId,
      unitPrice: purchaseOrderDetail.unitPrice,
      lineTotal: purchaseOrderDetail.lineTotal,
      receivedQty: purchaseOrderDetail.receivedQty,
      rejectedQty: purchaseOrderDetail.rejectedQty,
      stockedQty: purchaseOrderDetail.stockedQty
    };
  }
} 