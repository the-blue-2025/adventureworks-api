# Person Aggregate with Direct Child Repository Creation

This document explains the refactored Person aggregate pattern where child repositories are created directly within the PersonRepository instead of being injected via dependency injection.

## Why This Pattern is Better

### Problems with the Previous Pattern (Dependency Injection)
1. **Tight Coupling**: PersonRepository was tightly coupled to child repositories
2. **Complexity**: Required complex DI configuration and interface definitions
3. **Over-Engineering**: Unnecessary abstraction for simple child repositories
4. **Maintenance Overhead**: More files to maintain and configure

### Benefits of Direct Creation
1. **Simplicity**: Child repositories are created directly when needed
2. **Loose Coupling**: PersonRepository is not dependent on external DI configuration
3. **Easier Testing**: No need to mock child repositories for testing
4. **Better Encapsulation**: Child repositories are truly part of the Person aggregate
5. **Reduced Complexity**: Fewer interfaces and DI bindings to maintain

## Implementation

### PersonRepository Structure

```typescript
@injectable()
export class PersonRepository extends BaseRepository<DomainPerson, PersonInstance, number> implements IPersonRepository {
  protected readonly model = Person;

  // Child repositories - created directly
  private addressRepository: AddressRepository;
  private emailAddressRepository: EmailAddressRepository;
  private personPhoneRepository: PersonPhoneRepository;

  constructor() {
    super();
    // Initialize child repositories directly
    this.addressRepository = new AddressRepository();
    this.emailAddressRepository = new EmailAddressRepository();
    this.personPhoneRepository = new PersonPhoneRepository();
  }

  // Child repository access methods
  getAddressRepository(): AddressRepository {
    return this.addressRepository;
  }

  getEmailAddressRepository(): EmailAddressRepository {
    return this.emailAddressRepository;
  }

  getPersonPhoneRepository(): PersonPhoneRepository {
    return this.personPhoneRepository;
  }

  // Convenience methods for common operations
  async getPersonWithAllDetails(personId: number): Promise<{
    person: DomainPerson | null;
    addresses: any[];
    emailAddresses: any[];
    phoneNumbers: any[];
  }> {
    const person = await this.findById(personId);
    const [addresses, emailAddresses, phoneNumbers] = await Promise.all([
      this.addressRepository.findByPersonId(personId),
      this.emailAddressRepository.findByPersonId(personId),
      this.personPhoneRepository.findByPersonId(personId)
    ]);
    
    return { person, addresses, emailAddresses, phoneNumbers };
  }
}
```

## Usage Examples

### Accessing Child Repositories

```typescript
// Get the PersonRepository (injected via DI)
const personRepository: IPersonRepository = container.get(TYPES.IPersonRepository);

// Access child repositories directly
const addressRepo = personRepository.getAddressRepository();
const emailRepo = personRepository.getEmailAddressRepository();
const phoneRepo = personRepository.getPersonPhoneRepository();

// Use child repositories
const addresses = await addressRepo.findByPersonId(1);
const emails = await emailRepo.findByPersonId(1);
const phones = await phoneRepo.findByPersonId(1);
```

### Using Convenience Methods

```typescript
// Get person with all related data
const personWithAllDetails = await personRepository.getPersonWithAllDetails(1);

// Get person with specific related data
const personWithAddresses = await personRepository.getPersonWithAddresses(1);
const personWithEmails = await personRepository.getPersonWithEmailAddresses(1);
const personWithPhones = await personRepository.getPersonWithPhoneNumbers(1);
```

### Using the Service Layer

```typescript
// The service layer remains the same
const personAggregateService = container.get(TYPES.PersonAggregateService);

// Add email address to person
const newEmail = await personAggregateService.addEmailAddress(1, "john.doe@example.com");

// Add phone number to person
const newPhone = await personAggregateService.addPhoneNumber(1, "555-1234", 1);

// Get person with all details
const personDetails = await personAggregateService.getPersonWithAllDetails(1);
```

## Key Differences from Previous Pattern

### Before (Dependency Injection)
```typescript
// Required complex DI setup
constructor(
  @inject(TYPES.IAddressRepository)
  private addressRepository: IAddressRepository,
  @inject(TYPES.IEmailAddressRepository)
  private emailAddressRepository: IEmailAddressRepository,
  @inject(TYPES.IPersonPhoneRepository)
  private personPhoneRepository: IPersonPhoneRepository
) {
  super();
}
```

### After (Direct Creation)
```typescript
// Simple and clean
constructor() {
  super();
  this.addressRepository = new AddressRepository();
  this.emailAddressRepository = new EmailAddressRepository();
  this.personPhoneRepository = new PersonPhoneRepository();
}
```

## Benefits

1. **Simplified Architecture**: No need for child repository interfaces or DI bindings
2. **Better Performance**: No DI container overhead for child repositories
3. **Easier Testing**: Child repositories can be easily mocked or replaced
4. **Clear Ownership**: Child repositories are clearly owned by PersonRepository
5. **Reduced Complexity**: Fewer files and configurations to maintain
6. **Better Encapsulation**: Child repositories are truly part of the aggregate

## Migration Guide

### Files Removed
- `src/domain/repositories/IAddressRepository.ts`
- `src/domain/repositories/IEmailAddressRepository.ts`
- `src/domain/repositories/IPersonPhoneRepository.ts`

### Files Modified
- `src/infrastructure/repositories/PersonRepository.ts` - Simplified constructor
- `src/domain/repositories/IPersonRepository.ts` - Updated return types
- `src/ioc/types.ts` - Removed child repository types
- `src/ioc/inversify.config.ts` - Removed child repository bindings

### Files Unchanged
- All service and controller files remain the same
- All database models remain the same
- All child repository implementations remain the same

## Conclusion

This refactored pattern is much cleaner and more maintainable. It follows the principle of keeping things simple and avoids over-engineering. The child repositories are still accessible through the PersonRepository, maintaining the aggregate pattern, but without the complexity of dependency injection for simple child repositories.
