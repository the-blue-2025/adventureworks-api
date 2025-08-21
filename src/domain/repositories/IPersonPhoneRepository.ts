import { PersonPhone } from '../entities/PersonPhone';

export interface IPersonPhoneRepository {
  findAll(): Promise<PersonPhone[]>;
  findByPersonId(personId: number): Promise<PersonPhone[]>;
  findByPersonIdAndPhoneNumber(personId: number, phoneNumber: string): Promise<PersonPhone | null>;
  create(personPhone: PersonPhone): Promise<PersonPhone>;
  update(personPhone: PersonPhone): Promise<PersonPhone>;
  deleteByPersonIdAndPhoneNumber(personId: number, phoneNumber: string): Promise<void>;
}
