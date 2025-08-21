import { Address } from '../entities/Address';

export interface IAddressRepository {
  findAll(): Promise<Address[]>;
  findById(id: number): Promise<Address | null>;
  findByPersonId(personId: number): Promise<Address[]>;
  create(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
  delete(id: number): Promise<void>;
}
