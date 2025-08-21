import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IPersonRepository } from '../../domain/repositories/IPersonRepository';
import { Person, PersonChildEntityType } from '../../domain/entities/Person';
import { PersonDto, CreatePersonDto, UpdatePersonDto } from '../dtos/PersonDto';
import { BaseApplicationService } from './BaseApplicationService';
import { Address } from '../../domain/entities/Address';
import { EmailAddress } from '../../domain/entities/EmailAddress';
import { PersonPhone } from '../../domain/entities/PersonPhone';
import { IAddressRepository } from '../../domain/repositories/IAddressRepository';
import { IEmailAddressRepository } from '../../domain/repositories/IEmailAddressRepository';
import { IPersonPhoneRepository } from '../../domain/repositories/IPersonPhoneRepository';

export interface PersonAggregateDto {
  person: {
    businessEntityId: number;
    personType: string;
    nameStyle: boolean;
    title: string | null;
    firstName: string;
    middleName: string | null;
    lastName: string;
    suffix: string | null;
    emailPromotion: number;
    modifiedDate: Date;
  };
  addresses: Array<{
    addressId: number;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    stateProvinceId: number;
    postalCode: string;
    spatialLocation: string | null;
    rowguid: string;
    modifiedDate: Date;
  }>;
  emailAddresses: Array<{
    businessEntityId: number;
    emailAddressId: number;
    emailAddress: string;
    rowguid: string;
    modifiedDate: Date;
  }>;
  phoneNumbers: Array<{
    businessEntityId: number;
    phoneNumber: string;
    phoneNumberTypeId: number;
    modifiedDate: Date;
  }>;
}

@injectable()
export class PersonService extends BaseApplicationService<Person, PersonDto, CreatePersonDto, UpdatePersonDto> {
  constructor(
    @inject(TYPES.IPersonRepository)
    private personRepository: IPersonRepository
  ) {
    super();
  }

  // ==================== BASIC CRUD OPERATIONS ====================

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

  // ==================== AGGREGATE OPERATIONS ====================

  /**
   * Get a person with all their related data (addresses, emails, phones)
   */
  async getPersonWithAllDetails(personId: number): Promise<PersonAggregateDto | null> {
    const person = await this.personRepository.findById(personId);
    
    if (!person) {
      return null;
    }

    const [addresses, emailAddresses, phoneNumbers] = await Promise.all([
      this.personRepository.getChildRepository<IAddressRepository>(PersonChildEntityType.ADDRESS).findByPersonId(personId),
      this.personRepository.getChildRepository<IEmailAddressRepository>(PersonChildEntityType.EMAIL_ADDRESS).findByPersonId(personId),
      this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).findByPersonId(personId)
    ]);

    return {
      person: {
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
      },
      addresses: addresses.map((addr: any) => ({
        addressId: addr.addressId,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        stateProvinceId: addr.stateProvinceId,
        postalCode: addr.postalCode,
        spatialLocation: addr.spatialLocation,
        rowguid: addr.rowguid,
        modifiedDate: addr.modifiedDate
      })),
      emailAddresses: emailAddresses.map((email: any) => ({
        businessEntityId: email.businessEntityId,
        emailAddressId: email.emailAddressId,
        emailAddress: email.emailAddress,
        rowguid: email.rowguid,
        modifiedDate: email.modifiedDate
      })),
      phoneNumbers: phoneNumbers.map((phone: any) => ({
        businessEntityId: phone.businessEntityId,
        phoneNumber: phone.phoneNumber,
        phoneNumberTypeId: phone.phoneNumberTypeId,
        modifiedDate: phone.modifiedDate
      }))
    };
  }

  /**
   * Get person with all child entities dynamically
   */
  async getPersonWithAllChildEntities(personId: number): Promise<{
    person: Person | null;
    childEntities: { [key: string]: any[] };
  }> {
    const person = await this.personRepository.findById(personId);
    const childEntities: { [key: string]: any[] } = {};

    // Dynamically fetch all child entities using the entity type object
    const entityTypes = Object.values(PersonChildEntityType);
    
    for (const entityType of entityTypes) {
      const repository = this.personRepository.getChildRepository<IAddressRepository | IEmailAddressRepository | IPersonPhoneRepository>(entityType);
      if (repository && typeof repository.findByPersonId === 'function') {
        try {
          childEntities[entityType] = await repository.findByPersonId(personId);
        } catch (error) {
          console.warn(`Failed to fetch ${entityType} for person ${personId}:`, error);
          childEntities[entityType] = [];
        }
      }
    }

    return { person, childEntities };
  }

  // ==================== EMAIL ADDRESS OPERATIONS ====================

  /**
   * Add an email address to a person
   */
  async addEmailAddress(personId: number, emailAddress: string): Promise<EmailAddress> {
    const emailAddressEntity = EmailAddress.create({
      businessEntityId: personId,
      emailAddressId: 0, // Will be auto-generated
      emailAddress: emailAddress,
      rowguid: '', // Will be auto-generated
      modifiedDate: new Date()
    });

    return await this.personRepository.getChildRepository<IEmailAddressRepository>(PersonChildEntityType.EMAIL_ADDRESS).create(emailAddressEntity);
  }

  /**
   * Get all email addresses for a person
   */
  async getPersonEmailAddresses(personId: number): Promise<EmailAddress[]> {
    return await this.personRepository.getChildRepository<IEmailAddressRepository>(PersonChildEntityType.EMAIL_ADDRESS).findByPersonId(personId);
  }

  // ==================== PHONE NUMBER OPERATIONS ====================

  /**
   * Add a phone number to a person
   */
  async addPhoneNumber(personId: number, phoneNumber: string, phoneNumberTypeId: number): Promise<PersonPhone> {
    const phoneEntity = PersonPhone.create({
      businessEntityId: personId,
      phoneNumber: phoneNumber,
      phoneNumberTypeId: phoneNumberTypeId,
      modifiedDate: new Date()
    });

    return await this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).create(phoneEntity);
  }

  /**
   * Remove a phone number from a person
   */
  async removePhoneNumber(personId: number, phoneNumber: string): Promise<void> {
    await this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).deleteByPersonIdAndPhoneNumber(personId, phoneNumber);
  }

  /**
   * Get all phone numbers for a person
   */
  async getPersonPhoneNumbers(personId: number): Promise<PersonPhone[]> {
    return await this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).findByPersonId(personId);
  }

  /**
   * Find a specific phone number for a person
   */
  async findPersonPhoneNumber(personId: number, phoneNumber: string): Promise<PersonPhone | null> {
    return await this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).findByPersonIdAndPhoneNumber(personId, phoneNumber);
  }

  // ==================== ADDRESS OPERATIONS ====================

  /**
   * Get all addresses for a person
   */
  async getPersonAddresses(personId: number): Promise<Address[]> {
    return await this.personRepository.getChildRepository<IAddressRepository>(PersonChildEntityType.ADDRESS).findByPersonId(personId);
  }

  // ==================== CONVENIENCE METHODS ====================

  /**
   * Get person with addresses only
   */
  async getPersonWithAddresses(personId: number): Promise<{ person: Person | null; addresses: any[] }> {
    const person = await this.personRepository.findById(personId);
    const addresses = await this.personRepository.getChildRepository<IAddressRepository>(PersonChildEntityType.ADDRESS).findByPersonId(personId);
    return { person, addresses };
  }

  /**
   * Get person with email addresses only
   */
  async getPersonWithEmailAddresses(personId: number): Promise<{ person: Person | null; emailAddresses: any[] }> {
    const person = await this.personRepository.findById(personId);
    const emailAddresses = await this.personRepository.getChildRepository<IEmailAddressRepository>(PersonChildEntityType.EMAIL_ADDRESS).findByPersonId(personId);
    return { person, emailAddresses };
  }

  /**
   * Get person with phone numbers only
   */
  async getPersonWithPhoneNumbers(personId: number): Promise<{ person: Person | null; phoneNumbers: any[] }> {
    const person = await this.personRepository.findById(personId);
    const phoneNumbers = await this.personRepository.getChildRepository<IPersonPhoneRepository>(PersonChildEntityType.PERSON_PHONE).findByPersonId(personId);
    return { person, phoneNumbers };
  }

  // ==================== HELPER METHODS ====================

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
      personType: dto.personType || '',
      nameStyle: dto.nameStyle || false,
      title: dto.title || null,
      firstName: dto.firstName || '',
      middleName: dto.middleName || null,
      lastName: dto.lastName || '',
      suffix: dto.suffix || null,
      emailPromotion: dto.emailPromotion || 0,
      modifiedDate: new Date()
    };

    return Person.create(baseDto);
  }
} 
