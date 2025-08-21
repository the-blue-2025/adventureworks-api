import { injectable } from 'inversify';
import { IPersonRepository } from '../../../domain/repositories/IPersonRepository';
import { Person as DomainPerson, PersonProps, PersonChildEntityType } from '../../../domain/entities/Person';
import { Person, PersonInstance } from '../../database/models/PersonModel';
import { BaseRepository } from '../BaseRepository';
import { ChildRepositoryFactory, ChildRepository } from '../ChildRepositoryFactory';
import { AddressRepository } from './AddressRepository';
import { EmailAddressRepository } from './EmailAddressRepository';
import { PersonPhoneRepository } from './PersonPhoneRepository';

// Repository registry - maps entity names to repository classes using type-safe enum
const PERSON_CHILD_REPOSITORIES = {
  [PersonChildEntityType.ADDRESS]: AddressRepository,
  [PersonChildEntityType.EMAIL_ADDRESS]: EmailAddressRepository,
  [PersonChildEntityType.PERSON_PHONE]: PersonPhoneRepository
} as const;

@injectable()
export class PersonRepository extends BaseRepository<DomainPerson, PersonInstance, number> implements IPersonRepository {
  protected readonly model = Person;

  // Factory for creating child repositories
  private childRepositoryFactory: ChildRepositoryFactory;

  constructor() {
    super();
    this.childRepositoryFactory = new ChildRepositoryFactory();
    this.registerChildRepositories();
  }

  /**
   * Register all child repositories with the factory
   * Uses the registry to avoid hardcoding repository names
   */
  private registerChildRepositories(): void {
    // Dynamically register all repositories from the registry
    Object.entries(PERSON_CHILD_REPOSITORIES).forEach(([entityName, RepositoryClass]) => {
      this.childRepositoryFactory.registerRepository(entityName, RepositoryClass);
    });
  }

  /**
   * Get a child repository by entity name
   * @param entityName - The name of the entity using PersonChildEntityType enum
   * @returns The child repository instance
   */
  getChildRepository<T>(entityName: typeof PersonChildEntityType[keyof typeof PersonChildEntityType]): T {
    return this.childRepositoryFactory.createRepository(entityName) as T;
  }

  /**
   * Get all available child repository names
   * @returns Array of entity names that have child repositories
   */
  getAvailableChildRepositories(): string[] {
    return this.childRepositoryFactory.getAvailableRepositories();
  }

  /**
   * Check if a child repository exists for the given entity
   * @param entityName - The name of the entity using PersonChildEntityType enum
   * @returns True if the child repository exists
   */
  hasChildRepository(entityName: typeof PersonChildEntityType[keyof typeof PersonChildEntityType]): boolean {
    return this.childRepositoryFactory.hasRepository(entityName);
  }

  /**
   * Get the registry of child repositories
   * @returns The registry object
   */
  static getChildRepositoryRegistry() {
    return PERSON_CHILD_REPOSITORIES;
  }

  protected getIdField(): string {
    return 'businessEntityId';
  }

  protected getEntityName(): string {
    return 'Person';
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