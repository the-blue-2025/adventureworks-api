import { EmailAddress } from '../entities/EmailAddress';

export interface IEmailAddressRepository {
  findAll(): Promise<EmailAddress[]>;
  findById(id: number): Promise<EmailAddress | null>;
  findByPersonId(personId: number): Promise<EmailAddress[]>;
  create(emailAddress: EmailAddress): Promise<EmailAddress>;
  update(emailAddress: EmailAddress): Promise<EmailAddress>;
  delete(id: number): Promise<void>;
}
