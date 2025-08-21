# Person Folder Structure - Domain-Based Organization

This document demonstrates the new folder structure where Person-related repositories are organized in a dedicated Person folder.

## New Structure

```
src/infrastructure/repositories/
├── BaseRepository.ts                    # Shared base repository
├── PurchaseOrderRepository.ts           # Purchase Order repository
├── ShipMethodRepository.ts              # Ship Method repository
├── VendorRepository.ts                  # Vendor repository
└── Person/                              # Person domain folder
    ├── index.ts                         # Export all Person repositories
    ├── PersonRepository.ts              # Main Person repository
    ├── AddressRepository.ts             # Address child repository
    ├── EmailAddressRepository.ts        # Email Address child repository
    ├── PersonPhoneRepository.ts         # Person Phone child repository
    └── ChildRepositoryFactory.ts        # Factory for child repositories
```

## Benefits of Domain-Based Organization

### **1. Better Discoverability**
- All Person-related repositories are in one place
- Easy to find and understand Person domain structure
- Clear separation from other domains

### **2. Improved Maintainability**
- Changes to Person domain are isolated
- Easier to refactor Person-related code
- Reduced cognitive load when working on Person features

### **3. Scalability**
- Easy to add new Person-related repositories
- Clear pattern for organizing other domains
- Prevents repository folder from becoming cluttered

### **4. Team Collaboration**
- Different teams can work on different domains
- Reduced merge conflicts
- Clear ownership boundaries

## Usage Examples

### **1. Importing Person Repositories**

**Before (Scattered imports):**
```typescript
import { PersonRepository } from '../infrastructure/repositories/PersonRepository';
import { AddressRepository } from '../infrastructure/repositories/AddressRepository';
import { EmailAddressRepository } from '../infrastructure/repositories/EmailAddressRepository';
import { PersonPhoneRepository } from '../infrastructure/repositories/PersonPhoneRepository';
```

**After (Clean imports):**
```typescript
import { 
  PersonRepository, 
  AddressRepository, 
  EmailAddressRepository, 
  PersonPhoneRepository 
} from '../infrastructure/repositories/Person';
```

### **2. IoC Configuration**

```typescript
// src/ioc/inversify.config.ts
import { PersonRepository } from '../infrastructure/repositories/Person/PersonRepository';

export function configureContainer(): Container {
  const container = new Container();
  
  // Register Person repository
  container.bind<IPersonRepository>(TYPES.IPersonRepository)
    .to(PersonRepository);
    
  return container;
}
```

### **3. Adding New Person Repositories**

To add a new Person-related repository (e.g., `PersonCreditCardRepository`):

```typescript
// 1. Create the repository in Person folder
// src/infrastructure/repositories/Person/PersonCreditCardRepository.ts

// 2. Add to index.ts
export { PersonCreditCardRepository } from './PersonCreditCardRepository';

// 3. Register in PersonRepository
private registerChildRepositories(): void {
  this.childRepositoryFactory.registerRepository('Address', AddressRepository);
  this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
  this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
  this.childRepositoryFactory.registerRepository('PersonCreditCard', PersonCreditCardRepository); // New
}
```

## Folder Structure Benefits

### **1. Domain-Driven Design**
- Aligns with DDD principles
- Clear bounded contexts
- Domain-specific organization

### **2. Feature-Based Organization**
- Related functionality grouped together
- Easier to understand feature scope
- Better for feature teams

### **3. Reduced Complexity**
- Smaller, focused folders
- Easier navigation
- Clear responsibilities

## Migration Guide

### **1. Update Import Paths**

```typescript
// Before
import { PersonRepository } from '../infrastructure/repositories/PersonRepository';

// After
import { PersonRepository } from '../infrastructure/repositories/Person/PersonRepository';
```

### **2. Update IoC Configuration**

```typescript
// Before
import { PersonRepository } from '../infrastructure/repositories/PersonRepository';

// After
import { PersonRepository } from '../infrastructure/repositories/Person/PersonRepository';
```

### **3. Use Index File for Clean Imports**

```typescript
// For multiple Person repositories
import { 
  PersonRepository, 
  AddressRepository, 
  EmailAddressRepository 
} from '../infrastructure/repositories/Person';
```

## Future Extensions

### **1. Other Domain Folders**

Following the same pattern for other domains:

```
src/infrastructure/repositories/
├── Person/                              # Person domain
├── PurchaseOrder/                       # Purchase Order domain
├── Vendor/                              # Vendor domain
└── ShipMethod/                          # Ship Method domain
```

### **2. Shared Utilities**

```typescript
// src/infrastructure/repositories/Person/utils/
├── PersonQueryBuilder.ts               # Person-specific query utilities
├── PersonValidation.ts                 # Person-specific validation
└── PersonMapper.ts                     # Person-specific mapping logic
```

### **3. Testing Structure**

```typescript
// tests/infrastructure/repositories/Person/
├── PersonRepository.test.ts
├── AddressRepository.test.ts
├── EmailAddressRepository.test.ts
└── PersonPhoneRepository.test.ts
```

## Conclusion

The Person folder structure provides:

- **Better organization** by domain/feature
- **Improved maintainability** with focused folders
- **Enhanced scalability** for future Person-related repositories
- **Clear separation** of concerns
- **Easier navigation** and discovery
- **Better team collaboration** with clear boundaries

This approach follows modern software architecture principles and makes the codebase more maintainable and scalable.
