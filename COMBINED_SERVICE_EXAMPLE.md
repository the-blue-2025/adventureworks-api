# Combined PersonService - Benefits and Usage

This document demonstrates the benefits of combining `PersonService` and `PersonAggregateService` into a single comprehensive service.

## Why Combine Them?

### **1. Single Responsibility Principle**
Both services deal with **Person** operations:
- `PersonService`: Basic CRUD operations
- `PersonAggregateService`: Aggregate operations with child entities

### **2. Reduced Complexity**
- **Fewer services** to manage and inject
- **Single point of entry** for all Person operations
- **Simplified dependency injection**

### **3. Better Organization**
- **All Person use cases** in one place
- **Clear separation** between basic CRUD and aggregate operations
- **Easier to find** and maintain Person-related functionality

## Combined Service Structure

```typescript
@injectable()
export class PersonService extends BaseApplicationService<Person, PersonDto, CreatePersonDto, UpdatePersonDto> {
  
  // ==================== BASIC CRUD OPERATIONS ====================
  async findAll(): Promise<PersonDto[]>
  async findById(id: number): Promise<PersonDto | null>
  async create(dto: CreatePersonDto): Promise<PersonDto>
  async update(id: number, dto: UpdatePersonDto): Promise<PersonDto | null>
  async delete(id: number): Promise<void>

  // ==================== AGGREGATE OPERATIONS ====================
  async getPersonWithAllDetails(personId: number): Promise<PersonAggregateDto | null>
  async getPersonWithAllChildEntities(personId: number): Promise<{ person: Person | null; childEntities: { [key: string]: any[] } }>

  // ==================== EMAIL ADDRESS OPERATIONS ====================
  async addEmailAddress(personId: number, emailAddress: string): Promise<EmailAddress>
  async getPersonEmailAddresses(personId: number): Promise<EmailAddress[]>

  // ==================== PHONE NUMBER OPERATIONS ====================
  async addPhoneNumber(personId: number, phoneNumber: string, phoneNumberTypeId: number): Promise<PersonPhone>
  async removePhoneNumber(personId: number, phoneNumber: string): Promise<void>
  async getPersonPhoneNumbers(personId: number): Promise<PersonPhone[]>
  async findPersonPhoneNumber(personId: number, phoneNumber: string): Promise<PersonPhone | null>

  // ==================== ADDRESS OPERATIONS ====================
  async getPersonAddresses(personId: number): Promise<Address[]>

  // ==================== CONVENIENCE METHODS ====================
  async getPersonWithAddresses(personId: number): Promise<{ person: Person | null; addresses: any[] }>
  async getPersonWithEmailAddresses(personId: number): Promise<{ person: Person | null; emailAddresses: any[] }>
  async getPersonWithPhoneNumbers(personId: number): Promise<{ person: Person | null; phoneNumbers: any[] }>
}
```

## Usage Examples

### **1. Basic CRUD Operations**

```typescript
// Get all persons
const persons = await personService.findAll();

// Get person by ID
const person = await personService.findById(1);

// Create new person
const newPerson = await personService.create({
  personType: 'EM',
  firstName: 'John',
  lastName: 'Doe',
  emailPromotion: 1
});

// Update person
const updatedPerson = await personService.update(1, {
  firstName: 'Jane',
  lastName: 'Smith'
});

// Delete person
await personService.delete(1);
```

### **2. Aggregate Operations**

```typescript
// Get person with all related data
const personWithAllDetails = await personService.getPersonWithAllDetails(1);

// Get person with all child entities dynamically
const personWithAllEntities = await personService.getPersonWithAllChildEntities(1);
```

### **3. Email Address Operations**

```typescript
// Add email address to person
const emailAddress = await personService.addEmailAddress(1, 'john.doe@example.com');

// Get all email addresses for person
const emailAddresses = await personService.getPersonEmailAddresses(1);
```

### **4. Phone Number Operations**

```typescript
// Add phone number to person
const phoneNumber = await personService.addPhoneNumber(1, '555-1234', 1);

// Remove phone number from person
await personService.removePhoneNumber(1, '555-1234');

// Get all phone numbers for person
const phoneNumbers = await personService.getPersonPhoneNumbers(1);

// Find specific phone number
const specificPhone = await personService.findPersonPhoneNumber(1, '555-1234');
```

### **5. Address Operations**

```typescript
// Get all addresses for person
const addresses = await personService.getPersonAddresses(1);
```

### **6. Convenience Methods**

```typescript
// Get person with addresses only
const personWithAddresses = await personService.getPersonWithAddresses(1);

// Get person with email addresses only
const personWithEmails = await personService.getPersonWithEmailAddresses(1);

// Get person with phone numbers only
const personWithPhones = await personService.getPersonWithPhoneNumbers(1);
```

## Benefits of Combined Service

### **1. Simplified Dependency Injection**

**Before (Two Services):**
```typescript
@injectable()
export class SomeController {
  constructor(
    @inject(TYPES.PersonService)
    private personService: PersonService,
    @inject(TYPES.PersonAggregateService)
    private personAggregateService: PersonAggregateService
  ) {}
}
```

**After (One Service):**
```typescript
@injectable()
export class SomeController {
  constructor(
    @inject(TYPES.PersonService)
    private personService: PersonService
  ) {}
}
```

### **2. Cleaner Controllers**

**Before:**
```typescript
// Need to decide which service to use
const person = await this.personService.findById(1);
const personWithDetails = await this.personAggregateService.getPersonWithAllDetails(1);
```

**After:**
```typescript
// All operations through one service
const person = await this.personService.findById(1);
const personWithDetails = await this.personService.getPersonWithAllDetails(1);
```

### **3. Better Discoverability**

All Person-related operations are in one place:
- Basic CRUD operations
- Aggregate operations
- Child entity operations
- Convenience methods

### **4. Easier Testing**

```typescript
// Test all Person operations with one service
describe('PersonService', () => {
  it('should perform basic CRUD operations', async () => {
    // Test create, read, update, delete
  });

  it('should handle aggregate operations', async () => {
    // Test aggregate operations
  });

  it('should manage child entities', async () => {
    // Test email, phone, address operations
  });
});
```

### **5. Consistent Interface**

All Person operations follow the same patterns:
- Consistent error handling
- Consistent return types
- Consistent method naming

## Migration Guide

### **1. Update Controllers**

```typescript
// Before
@inject(TYPES.PersonAggregateService)
private personAggregateService: PersonAggregateService

// After
@inject(TYPES.PersonService)
private personService: PersonService
```

### **2. Update Method Calls**

```typescript
// Before
await this.personAggregateService.getPersonWithAllDetails(1);

// After
await this.personService.getPersonWithAllDetails(1);
```

### **3. Update IoC Configuration**

Remove `PersonAggregateService` bindings and use only `PersonService`.

## Conclusion

Combining `PersonService` and `PersonAggregateService` provides:

- **Simplified architecture** with fewer services
- **Better organization** of Person-related operations
- **Easier maintenance** and testing
- **Consistent interface** for all Person operations
- **Reduced complexity** in dependency injection

This approach follows the principle of **cohesion** - keeping related functionality together while maintaining clear separation of concerns through well-organized method groups.
