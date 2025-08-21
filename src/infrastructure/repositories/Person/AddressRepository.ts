import { injectable } from 'inversify';
import { IAddressRepository } from '../../../domain/repositories/IAddressRepository';
import { Address as DomainAddress, AddressProps } from '../../../domain/entities/Address';
import { Address, AddressInstance } from '../../database/models/AddressModel';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class AddressRepository extends BaseRepository<DomainAddress, AddressInstance, number> implements IAddressRepository {
  protected readonly model = Address;

  protected getIdField(): string {
    return 'addressId';
  }

  protected getEntityName(): string {
    return 'Address';
  }

  async findByPersonId(personId: number): Promise<DomainAddress[]> {
    try {
      // This would need to be implemented based on the relationship between Person and Address
      // For now, we'll return an empty array as the relationship table would need to be defined
      const models = await this.model.findAll({
        // Add join logic here when PersonAddress relationship is defined
      });
      return models.map(model => this.toDomain(model));
    } catch (error) {
      throw new Error(`Failed to fetch addresses for person ${personId}`);
    }
  }

  protected toDomain(model: AddressInstance): DomainAddress {
    return DomainAddress.create({
      addressId: model.addressId,
      addressLine1: model.addressLine1,
      addressLine2: model.addressLine2,
      city: model.city,
      stateProvinceId: model.stateProvinceId,
      postalCode: model.postalCode,
      spatialLocation: model.spatialLocation,
      rowguid: model.rowguid,
      modifiedDate: model.modifiedDate
    });
  }

  protected toPersistence(domain: DomainAddress): any {
    return {
      addressId: domain.addressId,
      addressLine1: domain.addressLine1,
      addressLine2: domain.addressLine2,
      city: domain.city,
      stateProvinceId: domain.stateProvinceId,
      postalCode: domain.postalCode,
      spatialLocation: domain.spatialLocation,
      rowguid: domain.rowguid,
      modifiedDate: domain.modifiedDate
    };
  }
}
