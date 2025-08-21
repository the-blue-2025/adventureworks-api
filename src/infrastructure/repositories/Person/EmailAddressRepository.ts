import { injectable } from 'inversify';
import { IEmailAddressRepository } from '../../../domain/repositories/IEmailAddressRepository';
import { EmailAddress as DomainEmailAddress, EmailAddressProps } from '../../../domain/entities/EmailAddress';
import { EmailAddress, EmailAddressInstance } from '../../database/models/EmailAddressModel';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class EmailAddressRepository extends BaseRepository<DomainEmailAddress, EmailAddressInstance, number> implements IEmailAddressRepository {
  protected readonly model = EmailAddress;

  protected getIdField(): string {
    return 'emailAddressId';
  }

  protected getEntityName(): string {
    return 'EmailAddress';
  }

  async findByPersonId(personId: number): Promise<DomainEmailAddress[]> {
    try {
      const models = await this.model.findAll({
        where: { businessEntityId: personId }
      });
      return models.map(model => this.toDomain(model));
    } catch (error) {
      throw new Error(`Failed to fetch email addresses for person ${personId}`);
    }
  }

  protected toDomain(model: EmailAddressInstance): DomainEmailAddress {
    return DomainEmailAddress.create({
      businessEntityId: model.businessEntityId,
      emailAddressId: model.emailAddressId,
      emailAddress: model.emailAddress,
      rowguid: model.rowguid,
      modifiedDate: model.modifiedDate
    });
  }

  protected toPersistence(domain: DomainEmailAddress): any {
    return {
      businessEntityId: domain.businessEntityId,
      emailAddressId: domain.emailAddressId,
      emailAddress: domain.emailAddress,
      rowguid: domain.rowguid,
      modifiedDate: domain.modifiedDate
    };
  }
}
