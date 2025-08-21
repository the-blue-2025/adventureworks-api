// Shared Repository Components
// Export shared components that can be used by any aggregate

export { ChildRepositoryFactory, ChildRepository } from './ChildRepositoryFactory';
export { BaseRepository } from './BaseRepository';

// Person Domain Repositories
export { PersonRepository } from './Person/PersonRepository';
export { AddressRepository } from './Person/AddressRepository';
export { EmailAddressRepository } from './Person/EmailAddressRepository';
export { PersonPhoneRepository } from './Person/PersonPhoneRepository';

// Other Domain Repositories
export { PurchaseOrderRepository } from './PurchaseOrderRepository';
export { ShipMethodRepository } from './ShipMethodRepository';
export { VendorRepository } from './VendorRepository';
