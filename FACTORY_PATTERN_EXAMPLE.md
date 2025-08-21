# Factory Pattern with Repository Registration

This document demonstrates the factory pattern implementation where each repository is responsible for registering its own child repositories.

## Architecture Overview

The factory pattern uses a registry system where:
1. **ChildRepositoryFactory**: Manages the registry of repository classes
2. **PersonRepository**: Registers its own child repositories with the factory
3. **Child Repositories**: Created dynamically through the factory

## Implementation

### 1. ChildRepositoryFactory

```typescript
export class ChildRepositoryFactory implements IChildRepositoryFactory {
  private repositoryRegistry: Map<string, new () => ChildRepository>;

  constructor() {
    this.repositoryRegistry = new Map();
  }

  // Register a new repository class
  registerRepository(entityName: string, repositoryClass: new () => ChildRepository): void {
    this.repositoryRegistry.set(entityName, repositoryClass);
  }

  // Create a repository instance
  createRepository(entityName: string): ChildRepository {
    const RepositoryClass = this.repositoryRegistry.get(entityName);
    if (!RepositoryClass) {
      throw new Error(`Repository for entity '${entityName}' not found in registry`);
    }
    return new RepositoryClass();
  }

  // Get available repositories
  getAvailableRepositories(): string[] {
    return Array.from(this.repositoryRegistry.keys());
  }
}
```

### 2. PersonRepository with Registration

```typescript
@injectable()
export class PersonRepository extends BaseRepository<DomainPerson, PersonInstance, number> implements IPersonRepository {
  private childRepositoryFactory: ChildRepositoryFactory;
  private childRepositories!: Map<string, ChildRepository>;

  constructor() {
    super();
    this.childRepositoryFactory = new ChildRepositoryFactory();
    this.initializeChildRepositories();
  }

  /**
   * Register all child repositories with the factory
   * Each repository is responsible for registering its own child repositories
   */
  private registerChildRepositories(): void {
    this.childRepositoryFactory.registerRepository('Address', AddressRepository);
    this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
    this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
  }

  /**
   * Initialize all child repositories using the factory
   */
  private initializeChildRepositories(): void {
    this.childRepositories = new Map();
    
    // Register child repositories with the factory
    this.registerChildRepositories();
    
    // Create repositories using the factory
    for (const entityName of this.childRepositoryFactory.getAvailableRepositories()) {
      this.childRepositories.set(entityName, this.childRepositoryFactory.createRepository(entityName));
    }
  }

  // Factory method to get child repository by name
  getChildRepository<T>(entityName: string): T {
    const repository = this.childRepositories.get(entityName);
    if (!repository) {
      throw new Error(`Child repository for entity '${entityName}' not found`);
    }
    return repository as T;
  }
}
```

## Usage Examples

### 1. Accessing Child Repositories by Name

```typescript
// Get the PersonRepository
const personRepository: IPersonRepository = container.get(TYPES.IPersonRepository);

// Access child repositories dynamically
const addressRepo = personRepository.getChildRepository<any>('Address');
const emailRepo = personRepository.getChildRepository<any>('EmailAddress');
const phoneRepo = personRepository.getChildRepository<any>('PersonPhone');

// Use the repositories
const addresses = await addressRepo.findByPersonId(1);
const emails = await emailRepo.findByPersonId(1);
const phones = await phoneRepo.findByPersonId(1);
```

### 2. Getting Available Child Repositories

```typescript
// Get all available child repository names
const availableRepositories = personRepository.getAvailableChildRepositories();
console.log('Available repositories:', availableRepositories);
// Output: ['Address', 'EmailAddress', 'PersonPhone']

// Check if a repository exists
const hasAddressRepo = personRepository.hasChildRepository('Address'); // true
const hasNonExistentRepo = personRepository.hasChildRepository('NonExistent'); // false
```

### 3. Dynamic Operations

```typescript
// Get person with all child entities dynamically
const personWithAllEntities = await personRepository.getPersonWithAllChildEntities(1);

console.log(personWithAllEntities);
// Output:
// {
//   person: { businessEntityId: 1, firstName: "John", ... },
//   childEntities: {
//     Address: [{ addressId: 1, addressLine1: "123 Main St", ... }],
//     EmailAddress: [{ emailAddressId: 1, emailAddress: "john@example.com", ... }],
//     PersonPhone: [{ phoneNumber: "555-1234", ... }]
//   }
// }
```

### 4. Adding New Child Repositories

To add a new child repository (e.g., `PersonCreditCard`):

```typescript
// 1. Create the repository class
export class PersonCreditCardRepository extends BaseRepository<...> {
  // Implementation
}

// 2. Register it in PersonRepository
private registerChildRepositories(): void {
  this.childRepositoryFactory.registerRepository('Address', AddressRepository);
  this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
  this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
  this.childRepositoryFactory.registerRepository('PersonCreditCard', PersonCreditCardRepository); // New
}

// 3. Use it
const creditCardRepo = personRepository.getChildRepository<any>('PersonCreditCard');
const creditCards = await creditCardRepo.findByPersonId(1);
```

## Benefits of This Pattern

### 1. **Encapsulation**
- Each repository is responsible for registering its own child repositories
- Clear ownership and responsibility

### 2. **Scalability**
- Easy to add new child repositories
- No need to modify the factory when adding new repositories

### 3. **Flexibility**
- Dynamic repository creation
- Runtime repository discovery

### 4. **Type Safety**
- Generic methods allow for type-safe repository access
- Compile-time checking for repository names

### 5. **Maintainability**
- Centralized repository management
- Easy to test and mock

## Advanced Usage

### 1. Conditional Repository Registration

```typescript
private registerChildRepositories(): void {
  // Always register core repositories
  this.childRepositoryFactory.registerRepository('Address', AddressRepository);
  this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
  
  // Conditionally register optional repositories
  if (process.env.ENABLE_PHONE_FEATURE === 'true') {
    this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
  }
  
  if (process.env.ENABLE_CREDIT_CARD_FEATURE === 'true') {
    this.childRepositoryFactory.registerRepository('PersonCreditCard', PersonCreditCardRepository);
  }
}
```

### 2. Repository Validation

```typescript
private validateChildRepository(entityName: string, repository: any): void {
  if (!repository || typeof repository.findByPersonId !== 'function') {
    throw new Error(`Repository for '${entityName}' must implement findByPersonId method`);
  }
}

private initializeChildRepositories(): void {
  this.childRepositories = new Map();
  this.registerChildRepositories();
  
  for (const entityName of this.childRepositoryFactory.getAvailableRepositories()) {
    const repository = this.childRepositoryFactory.createRepository(entityName);
    this.validateChildRepository(entityName, repository);
    this.childRepositories.set(entityName, repository);
  }
}
```

### 3. Repository Caching

```typescript
private createOrGetRepository(entityName: string): ChildRepository {
  if (!this.childRepositories.has(entityName)) {
    const repository = this.childRepositoryFactory.createRepository(entityName);
    this.childRepositories.set(entityName, repository);
  }
  return this.childRepositories.get(entityName)!;
}
```

## Conclusion

This factory pattern with repository registration provides a clean, scalable, and maintainable way to manage child repositories. Each repository is responsible for its own child repositories, creating clear boundaries and responsibilities while maintaining flexibility and type safety.
