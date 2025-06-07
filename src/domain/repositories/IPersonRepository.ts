import { Person } from '../entities/Person';

export interface IPersonRepository {
  findAll(): Promise<Person[]>;
  findById(id: number): Promise<Person | null>;
  create(person: Person): Promise<void>;
  update(person: Person): Promise<void>;
  delete(id: number): Promise<void>;
} 