import { Person } from '../entities/Person';

export interface IPersonRepository {
  findAll(): Promise<Person[]>;
  findById(id: number): Promise<Person | null>;
  create(person: Person): Promise<Person>;
  update(person: Person): Promise<Person>;
  delete(id: number): Promise<void>;
} 