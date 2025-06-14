import { injectable } from 'inversify';
import { IVendorRepository } from '../../domain/repositories/IVendorRepository';
import { Vendor as DomainVendor } from '../../domain/entities/Vendor';
import { Vendor, VendorInstance } from '../database/models/VendorModel';
import { BaseRepository } from './BaseRepository';

@injectable()
export class VendorRepository extends BaseRepository<DomainVendor, VendorInstance, number> implements IVendorRepository {
  protected readonly model = Vendor;

  protected getIdField(): string {
    return 'businessEntityId';
  }

  protected getEntityName(): string {
    return 'Vendor';
  }

  protected toDomain(model: VendorInstance): DomainVendor {
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

  protected toPersistence(domain: DomainVendor): any {
    return {
      businessEntityId: domain.businessEntityId,
      accountNumber: domain.accountNumber,
      name: domain.name,
      creditRating: domain.creditRating,
      preferredVendorStatus: domain.preferredVendorStatus,
      activeFlag: domain.activeFlag,
      purchasingWebServiceURL: domain.purchasingWebServiceURL,
      modifiedDate: new Date()
    };
  }
} 