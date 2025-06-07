import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { Person } from '../../domain/entities/Person';
import { PersonDto, CreatePersonDto, UpdatePersonDto } from '../dtos/PersonDto';

@injectable()
export class PersonService {
  constructor(
    @inject(TYPES.IPersonRepository)
    private personRepository: IPersonRepository
  ) {}

  async findAll(): Promise<PersonDto[]> {
    const persons = await this.personRepository.findAll();
    return persons.map(person => this.toDto(person));
  }

  async findById(id: number): Promise<PersonDto | null> {
    const person = await this.personRepository.findById(id);
    return person ? this.toDto(person) : null;
  }

  async create(dto: CreatePersonDto): Promise<PersonDto> {
    const person = Person.create({
      businessEntityId: 0, // Will be set by database
      personType: dto.personType,
      nameStyle: dto.nameStyle || false,
      title: dto.title || null,
      firstName: dto.firstName,
      middleName: dto.middleName || null,
      lastName: dto.lastName,
      suffix: dto.suffix || null,
      emailPromotion: dto.emailPromotion || 0,
      modifiedDate: new Date()
    });

    await this.personRepository.create(person);
    return this.toDto(person);
  }

  async update(id: number, dto: UpdatePersonDto): Promise<PersonDto | null> {
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      return null;
    }

    const updatedPerson = Person.create({
      businessEntityId: existingPerson.businessEntityId,
      personType: dto.personType || existingPerson.personType,
      nameStyle: dto.nameStyle ?? existingPerson.nameStyle,
      title: dto.title ?? existingPerson.title,
      firstName: dto.firstName || existingPerson.firstName,
      middleName: dto.middleName ?? existingPerson.middleName,
      lastName: dto.lastName || existingPerson.lastName,
      suffix: dto.suffix ?? existingPerson.suffix,
      emailPromotion: dto.emailPromotion ?? existingPerson.emailPromotion,
      modifiedDate: new Date()
    });

    await this.personRepository.update(updatedPerson);
    return this.toDto(updatedPerson);
  }

  async delete(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }

  private toDto(person: Person): PersonDto {
    return {
      businessEntityId: person.businessEntityId,
      personType: person.personType,
      nameStyle: person.nameStyle,
      title: person.title,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      suffix: person.suffix,
      emailPromotion: person.emailPromotion,
      modifiedDate: person.modifiedDate
    };
  }
} 