# Shared ChildRepositoryFactory - Multi-Aggregate Support

This document demonstrates how the `ChildRepositoryFactory` has been moved to a shared location and can be used by any aggregate, not just Person.

## New Structure

### **Before (Person-Specific)**
```
src/infrastructure/repositories/
├── Person/
│   ├── PersonRepository.ts
│   ├── AddressRepository.ts
│   ├── EmailAddressRepository.ts
│   ├── PersonPhoneRepository.ts
│   └── ChildRepositoryFactory.ts  # ❌ Person-specific
└── PurchaseOrderRepository.ts
```

### **After (Shared Factory)**
```
src/infrastructure/repositories/
├── ChildRepositoryFactory.ts      # ✅ Shared factory
├── BaseRepository.ts              # Shared base
├── index.ts                       # Shared exports
├── Person/                        # Person domain
│   ├── PersonRepository.ts
│   ├── AddressRepository.ts
│   ├── EmailAddressRepository.ts
│   └── PersonPhoneRepository.ts
├── PurchaseOrder/                 # PurchaseOrder domain (future)
│   ├── PurchaseOrderRepository.ts
│   ├── PurchaseOrderDetailRepository.ts
│   └── PurchaseOrderHeaderRepository.ts
└── Vendor/                        # Vendor domain (future)
    ├── VendorRepository.ts
    └── VendorContactRepository.ts
```

## Benefits of Shared Factory

### **1. Reusability**
- **Any aggregate** can use the same factory pattern
- **Consistent approach** across all domains
- **No code duplication** for factory logic

### **2. Maintainability**
- **Single source of truth** for factory logic
- **Centralized updates** to factory functionality
- **Easier testing** of factory behavior

### **3. Scalability**
- **Easy to add** new aggregates with child repositories
- **Consistent patterns** across the entire application
- **Future-proof** architecture

## Usage Examples

### **1. Person Aggregate (Current)**
```typescript
// src/infrastructure/repositories/Person/PersonRepository.ts
import { ChildRepositoryFactory, ChildRepository } from '../ChildRepositoryFactory';

@injectable()
export class PersonRepository extends BaseRepository<DomainPerson, PersonInstance, number> {
  private childRepositoryFactory: ChildRepositoryFactory;
  private childRepositories!: Map<string, ChildRepository>;

  constructor() {
    super();
    this.childRepositoryFactory = new ChildRepositoryFactory();
    this.initializeChildRepositories();
  }

  private registerChildRepositories(): void {
    this.childRepositoryFactory.registerRepository('Address', AddressRepository);
    this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
    this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
  }

  getChildRepository<T>(entityName: string): T {
    const repository = this.childRepositories.get(entityName);
    if (!repository) {
      throw new Error(`Child repository for entity '${entityName}' not found`);
    }
    return repository as T;
  }
}
```

### **2. PurchaseOrder Aggregate (Future)**
```typescript
// src/infrastructure/repositories/PurchaseOrder/PurchaseOrderRepository.ts
import { ChildRepositoryFactory, ChildRepository } from '../ChildRepositoryFactory';

@injectable()
export class PurchaseOrderRepository extends BaseRepository<DomainPurchaseOrder, PurchaseOrderInstance, number> {
  private childRepositoryFactory: ChildRepositoryFactory;
  private childRepositories!: Map<string, ChildRepository>;

  constructor() {
    super();
    this.childRepositoryFactory = new ChildRepositoryFactory();
    this.initializeChildRepositories();
  }

  private registerChildRepositories(): void {
    this.childRepositoryFactory.registerRepository('PurchaseOrderDetail', PurchaseOrderDetailRepository);
    this.childRepositoryFactory.registerRepository('PurchaseOrderHeader', PurchaseOrderHeaderRepository);
    this.childRepositoryFactory.registerRepository('PurchaseOrderHistory', PurchaseOrderHistoryRepository);
  }

  getChildRepository<T>(entityName: string): T {
    const repository = this.childRepositories.get(entityName);
    if (!repository) {
      throw new Error(`Child repository for entity '${entityName}' not found`);
    }
    return repository as T;
  }
}
```

### **3. Vendor Aggregate (Future)**
```typescript
// src/infrastructure/repositories/Vendor/VendorRepository.ts
import { ChildRepositoryFactory, ChildRepository } from '../ChildRepositoryFactory';

@injectable()
export class VendorRepository extends BaseRepository<DomainVendor, VendorInstance, number> {
  private childRepositoryFactory: ChildRepositoryFactory;
  private childRepositories!: Map<string, ChildRepository>;

  constructor() {
    super();
    this.childRepositoryFactory = new ChildRepositoryFactory();
    this.initializeChildRepositories();
  }

  private registerChildRepositories(): void {
    this.childRepositoryFactory.registerRepository('VendorContact', VendorContactRepository);
    this.childRepositoryFactory.registerRepository('VendorAddress', VendorAddressRepository);
    this.childRepositoryFactory.registerRepository('VendorProduct', VendorProductRepository);
  }

  getChildRepository<T>(entityName: string): T {
    const repository = this.childRepositories.get(entityName);
    if (!repository) {
      throw new Error(`Child repository for entity '${entityName}' not found`);
    }
    return repository as T;
  }
}
```

## Shared Factory Features

### **1. Registry Management**
```typescript
// Register repositories
factory.registerRepository('Address', AddressRepository);
factory.registerRepository('EmailAddress', EmailAddressRepository);

// Create repositories
const addressRepo = factory.createRepository('Address');
const emailRepo = factory.createRepository('EmailAddress');

// Check availability
const availableRepos = factory.getAvailableRepositories();
const hasRepo = factory.hasRepository('Address');
```

### **2. Dynamic Operations**
```typescript
// Get repository class without instantiation
const RepositoryClass = factory.getRepositoryClass('Address');

// Remove repository from registry
const removed = factory.unregisterRepository('Address');

// Clear all repositories
factory.clearRegistry();

// Get repository count
const count = factory.getRepositoryCount();
```

### **3. Error Handling**
```typescript
try {
  const repo = factory.createRepository('NonExistentRepository');
} catch (error) {
  console.error('Repository not found in registry');
}
```

## Import Structure

### **1. Shared Components**
```typescript
// Import shared factory
import { ChildRepositoryFactory, ChildRepository, IChildRepositoryFactory } from '../ChildRepositoryFactory';

// Import shared base repository
import { BaseRepository } from '../BaseRepository';
```

### **2. Domain-Specific Imports**
```typescript
// Person domain
import { PersonRepository } from '../infrastructure/repositories/Person/PersonRepository';

// Future: PurchaseOrder domain
import { PurchaseOrderRepository } from '../infrastructure/repositories/PurchaseOrder/PurchaseOrderRepository';

// Future: Vendor domain
import { VendorRepository } from '../infrastructure/repositories/Vendor/VendorRepository';
```

### **3. Shared Index Exports**
```typescript
// Import from shared index
import { 
  ChildRepositoryFactory, 
  PersonRepository, 
  PurchaseOrderRepository 
} from '../infrastructure/repositories';
```

## Testing Benefits

### **1. Shared Factory Testing**
```typescript
describe('ChildRepositoryFactory', () => {
  let factory: ChildRepositoryFactory;

  beforeEach(() => {
    factory = new ChildRepositoryFactory();
  });

  it('should register and create repositories', () => {
    factory.registerRepository('TestRepo', TestRepository);
    const repo = factory.createRepository('TestRepo');
    expect(repo).toBeInstanceOf(TestRepository);
  });

  it('should handle multiple aggregates', () => {
    // Person repositories
    factory.registerRepository('Address', AddressRepository);
    factory.registerRepository('EmailAddress', EmailAddressRepository);
    
    // PurchaseOrder repositories
    factory.registerRepository('PurchaseOrderDetail', PurchaseOrderDetailRepository);
    
    expect(factory.getAvailableRepositories()).toHaveLength(3);
  });
});
```

### **2. Aggregate-Specific Testing**
```typescript
describe('PersonRepository', () => {
  it('should use shared factory', () => {
    const personRepo = new PersonRepository();
    const addressRepo = personRepo.getChildRepository<any>('Address');
    expect(addressRepo).toBeInstanceOf(AddressRepository);
  });
});

describe('PurchaseOrderRepository', () => {
  it('should use shared factory', () => {
    const poRepo = new PurchaseOrderRepository();
    const detailRepo = poRepo.getChildRepository<any>('PurchaseOrderDetail');
    expect(detailRepo).toBeInstanceOf(PurchaseOrderDetailRepository);
  });
});
```

## Migration Guide

### **1. Update Imports**
```typescript
// Before
import { ChildRepositoryFactory, ChildRepository } from './ChildRepositoryFactory';

// After
import { ChildRepositoryFactory, ChildRepository } from '../ChildRepositoryFactory';
```

### **2. Update Index Files**
```typescript
// Remove from Person/index.ts
export { ChildRepositoryFactory, ChildRepository, IChildRepositoryFactory } from './ChildRepositoryFactory';

// Add to shared repositories/index.ts
export { ChildRepositoryFactory, ChildRepository, IChildRepositoryFactory } from './ChildRepositoryFactory';
```

### **3. Delete Old Files**
```bash
# Remove Person-specific factory
rm src/infrastructure/repositories/Person/ChildRepositoryFactory.ts
```

## Future Extensions

### **1. Type-Safe Factory**
```typescript
// Future enhancement with proper typing
interface PersonChildRepositoryMap {
  Address: AddressRepository;
  EmailAddress: EmailAddressRepository;
  PersonPhone: PersonPhoneRepository;
}

interface PurchaseOrderChildRepositoryMap {
  PurchaseOrderDetail: PurchaseOrderDetailRepository;
  PurchaseOrderHeader: PurchaseOrderHeaderRepository;
}

// Type-safe factory usage
const addressRepo = personRepo.getChildRepository<AddressRepository>('Address');
```

### **2. Aggregate-Specific Factories**
```typescript
// Future: Aggregate-specific factory extensions
class PersonChildRepositoryFactory extends ChildRepositoryFactory {
  constructor() {
    super();
    this.registerPersonRepositories();
  }

  private registerPersonRepositories(): void {
    this.registerRepository('Address', AddressRepository);
    this.registerRepository('EmailAddress', EmailAddressRepository);
    this.registerRepository('PersonPhone', PersonPhoneRepository);
  }
}
```

## Conclusion

Moving the `ChildRepositoryFactory` to a shared location provides:

- **Reusability**: Any aggregate can use the same factory pattern
- **Consistency**: Uniform approach across all domains
- **Maintainability**: Single source of truth for factory logic
- **Scalability**: Easy to add new aggregates with child repositories
- **Testability**: Centralized testing of factory behavior

This shared approach creates a more maintainable and scalable architecture that can grow with the application's needs.
