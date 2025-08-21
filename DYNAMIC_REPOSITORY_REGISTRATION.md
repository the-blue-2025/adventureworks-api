# Dynamic Repository Registration - Avoiding Hardcoded Names

This document explains how we eliminated hardcoded repository names in the `registerChildRepositories` method and shows alternative approaches.

## **🔍 Problem Identified**

### **Hardcoded Repository Names**
The original implementation had hardcoded repository names, making it difficult to maintain and extend:

```typescript
// ❌ BEFORE: Hardcoded repository names
private registerChildRepositories(): void {
  this.childRepositoryFactory.registerRepository('Address', AddressRepository);
  this.childRepositoryFactory.registerRepository('EmailAddress', EmailAddressRepository);
  this.childRepositoryFactory.registerRepository('PersonPhone', PersonPhoneRepository);
}
```

### **Issues with Hardcoding:**
- **Maintenance burden**: Need to update method when adding/removing repositories
- **Error-prone**: Typos in repository names
- **Not scalable**: Difficult to add new repositories
- **Poor separation**: Repository names mixed with registration logic

## **✅ Solution: Repository Registry Pattern**

### **1. Registry Object**
```typescript
// ✅ AFTER: Registry pattern
const PERSON_CHILD_REPOSITORIES = {
  'Address': AddressRepository,
  'EmailAddress': EmailAddressRepository,
  'PersonPhone': PersonPhoneRepository
} as const;
```

### **2. Dynamic Registration**
```typescript
// ✅ AFTER: Dynamic registration
private registerChildRepositories(): void {
  // Dynamically register all repositories from the registry
  Object.entries(PERSON_CHILD_REPOSITORIES).forEach(([entityName, RepositoryClass]) => {
    this.childRepositoryFactory.registerRepository(entityName, RepositoryClass);
  });
}
```

## **🎯 Benefits of Registry Pattern**

### **1. Single Source of Truth**
- **One place** to manage all child repositories
- **Easy to see** all available repositories at a glance
- **Centralized** repository management

### **2. Easy Maintenance**
- **Add new repository**: Just add to registry object
- **Remove repository**: Just remove from registry object
- **No method changes**: Registration logic stays the same

### **3. Type Safety**
- **TypeScript support**: Registry is typed with `as const`
- **Compile-time checking**: Errors caught during compilation
- **IntelliSense support**: IDE autocomplete for repository names

### **4. Extensibility**
- **Easy to extend**: Add new repositories without touching registration logic
- **Consistent pattern**: Same approach for all aggregates
- **Reusable**: Pattern can be applied to other aggregates

## **🚀 Alternative Solutions**

### **Option 2: Auto-Discovery Pattern**

```typescript
// Alternative: Auto-discovery using file system or decorators
@ChildRepository('Address')
export class AddressRepository extends BaseRepository<DomainAddress, AddressInstance, number> {
  // Implementation...
}

@ChildRepository('EmailAddress')
export class EmailAddressRepository extends BaseRepository<DomainEmailAddress, EmailAddressInstance, number> {
  // Implementation...
}

// Auto-discovery in PersonRepository
private registerChildRepositories(): void {
  // Auto-discover repositories with @ChildRepository decorator
  const childRepositories = this.discoverChildRepositories();
  childRepositories.forEach(({ name, repositoryClass }) => {
    this.childRepositoryFactory.registerRepository(name, repositoryClass);
  });
}
```

### **Option 3: Configuration-Based Pattern**

```typescript
// Alternative: Configuration file approach
// person-repositories.config.ts
export const PERSON_REPOSITORIES_CONFIG = {
  childRepositories: [
    { name: 'Address', class: AddressRepository },
    { name: 'EmailAddress', class: EmailAddressRepository },
    { name: 'PersonPhone', class: PersonPhoneRepository }
  ]
};

// PersonRepository.ts
private registerChildRepositories(): void {
  PERSON_REPOSITORIES_CONFIG.childRepositories.forEach(({ name, class: RepositoryClass }) => {
    this.childRepositoryFactory.registerRepository(name, RepositoryClass);
  });
}
```

### **Option 4: Convention-Based Pattern**

```typescript
// Alternative: Convention-based naming
// All child repositories follow naming convention: {EntityName}Repository
private registerChildRepositories(): void {
  const repositoryClasses = [
    AddressRepository,
    EmailAddressRepository,
    PersonPhoneRepository
  ];

  repositoryClasses.forEach(RepositoryClass => {
    const entityName = RepositoryClass.name.replace('Repository', '');
    this.childRepositoryFactory.registerRepository(entityName, RepositoryClass);
  });
}
```

## **📊 Comparison of Approaches**

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Registry Pattern** | Simple, type-safe, easy to maintain | Manual registry updates | Small to medium projects |
| **Auto-Discovery** | Fully automatic, no manual updates | Complex setup, runtime overhead | Large projects with many repositories |
| **Configuration** | Flexible, external configuration | Additional files, configuration management | Projects requiring runtime configuration |
| **Convention** | Automatic, no manual naming | Rigid naming rules, less flexible | Projects with strict conventions |

## **🎯 Recommended Approach: Registry Pattern**

### **Why Registry Pattern is Best:**
1. **Simple and clear**: Easy to understand and maintain
2. **Type-safe**: TypeScript provides compile-time checking
3. **Explicit**: Clear visibility of all child repositories
4. **Flexible**: Easy to add/remove repositories
5. **Performance**: No runtime discovery overhead

### **Implementation Details:**

#### **1. Registry Definition**
```typescript
const PERSON_CHILD_REPOSITORIES = {
  'Address': AddressRepository,
  'EmailAddress': EmailAddressRepository,
  'PersonPhone': PersonPhoneRepository
} as const;
```

#### **2. Type Safety**
```typescript
// Type-safe entity names
type PersonChildEntityName = keyof typeof PERSON_CHILD_REPOSITORIES;

// Type-safe repository classes
type PersonChildRepositoryClass = typeof PERSON_CHILD_REPOSITORIES[PersonChildEntityName];
```

#### **3. Dynamic Registration**
```typescript
private registerChildRepositories(): void {
  Object.entries(PERSON_CHILD_REPOSITORIES).forEach(([entityName, RepositoryClass]) => {
    this.childRepositoryFactory.registerRepository(entityName, RepositoryClass);
  });
}
```

#### **4. Static Access**
```typescript
// Allow external access to registry for testing/debugging
static getChildRepositoryRegistry() {
  return PERSON_CHILD_REPOSITORIES;
}
```

## **🔍 Usage Examples**

### **Adding New Repository**
```typescript
// 1. Create new repository
export class PersonAddressRepository extends BaseRepository<DomainPersonAddress, PersonAddressInstance, number> {
  // Implementation...
}

// 2. Add to registry
const PERSON_CHILD_REPOSITORIES = {
  'Address': AddressRepository,
  'EmailAddress': EmailAddressRepository,
  'PersonPhone': PersonPhoneRepository,
  'PersonAddress': PersonAddressRepository  // ✅ Just add this line
} as const;
```

### **Removing Repository**
```typescript
const PERSON_CHILD_REPOSITORIES = {
  'Address': AddressRepository,
  'EmailAddress': EmailAddressRepository,
  // 'PersonPhone': PersonPhoneRepository,  // ✅ Just comment out or remove
} as const;
```

### **Testing Registry**
```typescript
describe('PersonRepository', () => {
  it('should have correct child repositories registered', () => {
    const registry = PersonRepository.getChildRepositoryRegistry();
    
    expect(registry).toHaveProperty('Address');
    expect(registry).toHaveProperty('EmailAddress');
    expect(registry).toHaveProperty('PersonPhone');
    
    expect(registry.Address).toBe(AddressRepository);
    expect(registry.EmailAddress).toBe(EmailAddressRepository);
    expect(registry.PersonPhone).toBe(PersonPhoneRepository);
  });
});
```

## **🚀 Future Enhancements**

### **1. Generic Registry Pattern**
```typescript
// Future: Generic registry for any aggregate
class RepositoryRegistry<T> {
  private repositories: Map<string, new () => T> = new Map();

  register(name: string, repositoryClass: new () => T): void {
    this.repositories.set(name, repositoryClass);
  }

  get(name: string): (new () => T) | undefined {
    return this.repositories.get(name);
  }

  getAll(): Map<string, new () => T> {
    return new Map(this.repositories);
  }
}
```

### **2. Validation and Constraints**
```typescript
// Future: Add validation to registry
const PERSON_CHILD_REPOSITORIES = {
  'Address': AddressRepository,
  'EmailAddress': EmailAddressRepository,
  'PersonPhone': PersonPhoneRepository
} as const;

// Validate that all repositories implement required interface
Object.entries(PERSON_CHILD_REPOSITORIES).forEach(([name, RepositoryClass]) => {
  if (!RepositoryClass.prototype.findByPersonId) {
    throw new Error(`Repository ${name} must implement findByPersonId method`);
  }
});
```

### **3. Dynamic Loading**
```typescript
// Future: Dynamic loading from configuration
async loadChildRepositories(): Promise<void> {
  const config = await loadRepositoryConfig();
  
  config.childRepositories.forEach(({ name, path }) => {
    const RepositoryClass = await import(path);
    this.childRepositoryFactory.registerRepository(name, RepositoryClass.default);
  });
}
```

## **📋 Summary**

### **What We Achieved:**
1. **Eliminated hardcoded repository names** in registration method
2. **Created a centralized registry** for all child repositories
3. **Made repository management** easier and more maintainable
4. **Added type safety** with TypeScript support
5. **Improved extensibility** for future repositories

### **Benefits:**
- **Easier maintenance**: Add/remove repositories without touching registration logic
- **Type safety**: Compile-time checking of repository names
- **Better organization**: Clear separation of concerns
- **Improved testability**: Easy to test registry independently
- **Future-proof**: Easy to extend and modify

### **Best Practices Applied:**
- **DRY**: No repetition of registration logic
- **Single Responsibility**: Registry only manages repository mapping
- **Open/Closed**: Easy to extend without modifying existing code
- **Type Safety**: Leveraging TypeScript for compile-time safety

This approach makes the code more maintainable, type-safe, and easier to extend while following clean architecture principles!
