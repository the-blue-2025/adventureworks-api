import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IVendorRepository } from '../../domain/repositories/IVendorRepository';
import { Vendor } from '../../domain/entities/Vendor';
import { VendorDto, CreateVendorDto, UpdateVendorDto } from '../dtos/VendorDto';
import { BaseApplicationService } from './BaseApplicationService';

@injectable()
export class VendorService extends BaseApplicationService<Vendor, VendorDto, CreateVendorDto, UpdateVendorDto> {
  constructor(
    @inject(TYPES.IVendorRepository)
    private vendorRepository: IVendorRepository
  ) {
    super();
  }

  async findAll(): Promise<VendorDto[]> {
    const vendors = await this.vendorRepository.findAll();
    return vendors.map(vendor => this.toDto(vendor));
  }

  async findById(id: number): Promise<VendorDto | null> {
    const vendor = await this.vendorRepository.findById(id);
    return vendor ? this.toDto(vendor) : null;
  }

  async create(dto: CreateVendorDto): Promise<VendorDto> {
    const vendor = this.toEntity(dto);
    await this.vendorRepository.create(vendor);
    return this.toDto(vendor);
  }

  async update(id: number, dto: UpdateVendorDto): Promise<VendorDto | null> {
    const existingVendor = await this.vendorRepository.findById(id);
    if (!existingVendor) {
      return null;
    }

    const updatedVendor = this.toEntity({ ...dto, businessEntityId: id } as CreateVendorDto);
    await this.vendorRepository.update(updatedVendor);
    return this.toDto(updatedVendor);
  }

  async delete(id: number): Promise<void> {
    await this.vendorRepository.delete(id);
  }

  protected toDto(vendor: Vendor): VendorDto {
    return {
      businessEntityId: vendor.businessEntityId,
      accountNumber: vendor.accountNumber,
      name: vendor.name,
      creditRating: vendor.creditRating,
      preferredVendorStatus: vendor.preferredVendorStatus,
      activeFlag: vendor.activeFlag,
      purchasingWebServiceURL: vendor.purchasingWebServiceURL,
      modifiedDate: vendor.modifiedDate
    };
  }

  protected toEntity(dto: CreateVendorDto | UpdateVendorDto): Vendor {
    if (!('accountNumber' in dto) || !('name' in dto) || !('creditRating' in dto)) {
      throw new Error('Required properties missing: accountNumber, name, creditRating');
    }

    const baseDto = {
      businessEntityId: 'businessEntityId' in dto ? (dto as any).businessEntityId : 0,
      accountNumber: dto.accountNumber as string,
      name: dto.name as string,
      creditRating: dto.creditRating as number,
      preferredVendorStatus: dto.preferredVendorStatus || false,
      activeFlag: dto.activeFlag || true,
      purchasingWebServiceURL: dto.purchasingWebServiceURL || null,
      modifiedDate: new Date()
    };

    return Vendor.create(baseDto);
  }
} 