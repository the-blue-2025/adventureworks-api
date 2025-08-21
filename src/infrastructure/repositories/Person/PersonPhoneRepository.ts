import { injectable } from 'inversify';
import { IPersonPhoneRepository } from '../../../domain/repositories/IPersonPhoneRepository';
import { PersonPhone as DomainPersonPhone, PersonPhoneProps } from '../../../domain/entities/PersonPhone';
import { PersonPhone, PersonPhoneInstance } from '../../database/models/PersonPhoneModel';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PersonPhoneRepository extends BaseRepository<DomainPersonPhone, PersonPhoneInstance, number> implements IPersonPhoneRepository {
  protected readonly model = PersonPhone;

  protected getIdField(): string {
    return 'businessEntityId';
  }

  protected getEntityName(): string {
    return 'PersonPhone';
  }

  async findByPersonId(personId: number): Promise<DomainPersonPhone[]> {
    try {
      const models = await this.model.findAll({
        where: { businessEntityId: personId }
      });
      return models.map(model => this.toDomain(model));
    } catch (error) {
      throw new Error(`Failed to fetch phone numbers for person ${personId}`);
    }
  }

  async findByPersonIdAndPhoneNumber(personId: number, phoneNumber: string): Promise<DomainPersonPhone | null> {
    try {
      const model = await this.model.findOne({
        where: { 
          businessEntityId: personId,
          phoneNumber: phoneNumber
        }
      });
      return model ? this.toDomain(model) : null;
    } catch (error) {
      throw new Error(`Failed to fetch phone number ${phoneNumber} for person ${personId}`);
    }
  }

  async deleteByPersonIdAndPhoneNumber(personId: number, phoneNumber: string): Promise<void> {
    try {
      await this.model.destroy({
        where: { 
          businessEntityId: personId,
          phoneNumber: phoneNumber
        }
      });
    } catch (error) {
      throw new Error(`Failed to delete phone number ${phoneNumber} for person ${personId}`);
    }
  }

  protected toDomain(model: PersonPhoneInstance): DomainPersonPhone {
    return DomainPersonPhone.create({
      businessEntityId: model.businessEntityId,
      phoneNumber: model.phoneNumber,
      phoneNumberTypeId: model.phoneNumberTypeId,
      modifiedDate: model.modifiedDate
    });
  }

  protected toPersistence(domain: DomainPersonPhone): any {
    return {
      businessEntityId: domain.businessEntityId,
      phoneNumber: domain.phoneNumber,
      phoneNumberTypeId: domain.phoneNumberTypeId,
      modifiedDate: domain.modifiedDate
    };
  }
}
