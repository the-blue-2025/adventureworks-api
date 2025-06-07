import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { IVendorRepository } from '../../domain/repositories/IVendorRepository';
import { Vendor } from '../../domain/entities/Vendor';
import { VendorDto, CreateVendorDto, UpdateVendorDto } from '../dtos/VendorDto';

@injectable()
export class VendorService {
  constructor(
    @inject(TYPES.IVendorRepository)
    private vendorRepository: IVendorRepository
  ) {}

  async findAll(): Promise<VendorDto[]> {
    const vendors = await this.vendorRepository.findAll();
    return vendors.map(vendor => this.toDto(vendor));
  }

  async findById(id: number): Promise<VendorDto | null> {
    const vendor = await this.vendorRepository.findById(id);
    return vendor ? this.toDto(vendor) : null;
  }

  async create(dto: CreateVendorDto): Promise<VendorDto> {
    const vendor = Vendor.create({
      businessEntityId: 0, // Will be set by database
      accountNumber: dto.accountNumber,
      name: dto.name,
      creditRating: dto.creditRating,
      preferredVendorStatus: dto.preferredVendorStatus ?? true,
      activeFlag: dto.activeFlag ?? true,
      purchasingWebServiceURL: dto.purchasingWebServiceURL || null,
      modifiedDate: new Date()
    });

    await this.vendorRepository.create(vendor);
    return this.toDto(vendor);
  }

  async update(id: number, dto: UpdateVendorDto): Promise<VendorDto | null> {
    const existingVendor = await this.vendorRepository.findById(id);
    if (!existingVendor) {
      return null;
    }

    const updatedVendor = Vendor.create({
      businessEntityId: existingVendor.businessEntityId,
      accountNumber: dto.accountNumber || existingVendor.accountNumber,
      name: dto.name || existingVendor.name,
      creditRating: dto.creditRating ?? existingVendor.creditRating,
      preferredVendorStatus: dto.preferredVendorStatus ?? existingVendor.preferredVendorStatus,
      activeFlag: dto.activeFlag ?? existingVendor.activeFlag,
      purchasingWebServiceURL: dto.purchasingWebServiceURL ?? existingVendor.purchasingWebServiceURL,
      modifiedDate: new Date()
    });

    await this.vendorRepository.update(updatedVendor);
    return this.toDto(updatedVendor);
  }

  async delete(id: number): Promise<void> {
    await this.vendorRepository.delete(id);
  }

  private toDto(vendor: Vendor): VendorDto {
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
} 