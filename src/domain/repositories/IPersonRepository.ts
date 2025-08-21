import { Person, PersonChildEntityType } from '../entities/Person';

export interface IPersonRepository {
  findAll(): Promise<Person[]>;
  findById(id: number): Promise<Person | null>;
  create(person: Person): Promise<Person>;
  update(person: Person): Promise<Person>;
  delete(id: number): Promise<void>;
  
  // Factory methods for child repositories
  getChildRepository<T>(entityName: typeof PersonChildEntityType[keyof typeof PersonChildEntityType]): T;
  getAvailableChildRepositories(): string[];
  hasChildRepository(entityName: typeof PersonChildEntityType[keyof typeof PersonChildEntityType]): boolean;
} 