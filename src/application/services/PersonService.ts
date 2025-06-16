import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { Person } from '../../domain/entities/Person';
import { PersonDto, CreatePersonDto, UpdatePersonDto } from '../dtos/PersonDto';
import { BaseApplicationService } from './BaseApplicationService';

@injectable()
export class PersonService extends BaseApplicationService<Person, PersonDto, CreatePersonDto, UpdatePersonDto> {
  constructor(
    @inject(TYPES.IPersonRepository)
    private personRepository: IPersonRepository
  ) {
    super();
  }

  async findAll(): Promise<PersonDto[]> {
    const persons = await this.personRepository.findAll();
    return persons.map(person => this.toDto(person));
  }

  async findById(id: number): Promise<PersonDto | null> {
    const person = await this.personRepository.findById(id);
    return person ? this.toDto(person) : null;
  }

  async create(dto: CreatePersonDto): Promise<PersonDto> {
    const person = this.toEntity(dto);
    await this.personRepository.create(person);
    return this.toDto(person);
  }

  async update(id: number, dto: UpdatePersonDto): Promise<PersonDto | null> {
    const existingPerson = await this.personRepository.findById(id);
    if (!existingPerson) {
      return null;
    }

    const updatedPerson = this.toEntity({ ...dto, businessEntityId: id } as CreatePersonDto);
    await this.personRepository.update(updatedPerson);
    return this.toDto(updatedPerson);
  }

  async delete(id: number): Promise<void> {
    await this.personRepository.delete(id);
  }

  protected toDto(person: Person): PersonDto {
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

  protected toEntity(dto: CreatePersonDto | UpdatePersonDto): Person {
    const baseDto = {
      businessEntityId: 'businessEntityId' in dto ? (dto as any).businessEntityId : 0,
      personType: dto.personType,
      nameStyle: dto.nameStyle || false,
      title: dto.title || null,
      firstName: dto.firstName,
      middleName: dto.middleName || null,
      lastName: dto.lastName,
      suffix: dto.suffix || null,
      emailPromotion: dto.emailPromotion || 0,
      modifiedDate: new Date()
    };

    return Person.create(baseDto);
  }
} 