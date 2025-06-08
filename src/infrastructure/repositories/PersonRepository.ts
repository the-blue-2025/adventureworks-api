import { injectable } from 'inversify';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { Person as DomainPerson, PersonProps } from '../../domain/entities/Person';
import { Person, PersonInstance } from '../database/models/PersonModel';
import { BaseRepository } from './BaseRepository';

@injectable()
export class PersonRepository extends BaseRepository<DomainPerson, PersonInstance, number> implements IPersonRepository {
  async findAll(): Promise<DomainPerson[]> {
    const persons = await Person.findAll();
    return persons.map(person => this.toDomain(person));
  }

  async findById(id: number): Promise<DomainPerson | null> {
    const person = await Person.findByPk(id);
    return person ? this.toDomain(person) : null;
  }

  async create(person: DomainPerson): Promise<void> {
    await Person.create(this.toPersistence(person));
  }

  async update(person: DomainPerson): Promise<void> {
    await Person.update(
      this.toPersistence(person),
      {
        where: { businessEntityId: person.businessEntityId }
      }
    );
  }

  async delete(id: number): Promise<void> {
    await Person.destroy({
      where: { businessEntityId: id }
    });
  }

  protected toDomain(model: PersonInstance): DomainPerson {
    return DomainPerson.create({
      businessEntityId: model.businessEntityId,
      personType: model.personType,
      nameStyle: model.nameStyle,
      title: model.title,
      firstName: model.firstName,
      middleName: model.middleName,
      lastName: model.lastName,
      suffix: model.suffix,
      emailPromotion: model.emailPromotion,
      modifiedDate: model.modifiedDate
    });
  }

  protected toPersistence(domain: DomainPerson): any {
    return {
      businessEntityId: domain.businessEntityId,
      personType: domain.personType,
      nameStyle: domain.nameStyle,
      title: domain.title,
      firstName: domain.firstName,
      middleName: domain.middleName,
      lastName: domain.lastName,
      suffix: domain.suffix,
      emailPromotion: domain.emailPromotion,
      modifiedDate: domain.modifiedDate
    };
  }
} 