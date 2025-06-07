import { injectable } from 'inversify';
import { IVendorRepository } from '../../domain/repositories/IVendorRepository';
import { Vendor as DomainVendor } from '../../domain/entities/Vendor';
import { Vendor, VendorInstance } from '../database/models/VendorModel';

@injectable()
export class VendorRepository implements IVendorRepository {
  async findAll(): Promise<DomainVendor[]> {
    const vendors = await Vendor.findAll();
    return vendors.map(vendor => this.toDomain(vendor));
  }

  async findById(id: number): Promise<DomainVendor | null> {
    const vendor = await Vendor.findByPk(id);
    return vendor ? this.toDomain(vendor) : null;
  }

  async create(vendor: DomainVendor): Promise<void> {
    await Vendor.create(this.toPersistence(vendor));
  }

  async update(vendor: DomainVendor): Promise<void> {
    await Vendor.update(
      this.toPersistence(vendor),
      {
        where: { businessEntityId: vendor.businessEntityId }
      }
    );
  }

  async delete(id: number): Promise<void> {
    await Vendor.destroy({
      where: { businessEntityId: id }
    });
  }

  private toDomain(model: VendorInstance): DomainVendor {
    return DomainVendor.create({
      businessEntityId: model.businessEntityId,
      accountNumber: model.accountNumber,
      name: model.name,
      creditRating: model.creditRating,
      preferredVendorStatus: model.preferredVendorStatus,
      activeFlag: model.activeFlag,
      purchasingWebServiceURL: model.purchasingWebServiceURL,
      modifiedDate: model.modifiedDate
    });
  }

  private toPersistence(domain: DomainVendor): any {
    return {
      businessEntityId: domain.businessEntityId,
      accountNumber: domain.accountNumber,
      name: domain.name,
      creditRating: domain.creditRating,
      preferredVendorStatus: domain.preferredVendorStatus,
      activeFlag: domain.activeFlag,
      purchasingWebServiceURL: domain.purchasingWebServiceURL,
      modifiedDate: domain.modifiedDate
    };
  }
} 