# Person Aggregate with Child Repositories

This document explains how the Person aggregate is implemented with child repositories for managing related entities like Address, EmailAddress, and PersonPhone.

## Architecture Overview

The Person aggregate follows the Domain-Driven Design (DDD) pattern where the Person entity is the aggregate root, and related entities (Address, EmailAddress, PersonPhone) are managed through child repositories that are accessible through the main PersonRepository.

## Structure

```
Person Aggregate
├── Person (Aggregate Root)
├── Address (Child Entity)
├── EmailAddress (Child Entity)
├── PersonPhone (Child Entity)
├── AddressType (Reference Data)
├── ContactType (Reference Data)
├── CountryRegion (Reference Data)
├── PhoneNumberType (Reference Data)
└── StateProvince (Reference Data)
```

## Child Repositories

### 1. AddressRepository
- **Purpose**: Manages address information for persons
- **Key Methods**:
  - `findAll()`: Get all addresses
  - `findById(id)`: Get address by ID
  - `findByPersonId(personId)`: Get addresses for a specific person
  - `create(address)`: Create new address
  - `update(address)`: Update existing address
  - `delete(id)`: Delete address

### 2. EmailAddressRepository
- **Purpose**: Manages email addresses for persons
- **Key Methods**:
  - `findAll()`: Get all email addresses
  - `findById(id)`: Get email address by ID
  - `findByPersonId(personId)`: Get email addresses for a specific person
  - `create(emailAddress)`: Create new email address
  - `update(emailAddress)`: Update existing email address
  - `delete(id)`: Delete email address

### 3. PersonPhoneRepository
- **Purpose**: Manages phone numbers for persons
- **Key Methods**:
  - `findAll()`: Get all phone numbers
  - `findByPersonId(personId)`: Get phone numbers for a specific person
  - `findByPersonIdAndPhoneNumber(personId, phoneNumber)`: Find specific phone number
  - `create(personPhone)`: Create new phone number
  - `update(personPhone)`: Update existing phone number
  - `delete(personId, phoneNumber)`: Delete phone number

## Usage Examples

### Accessing Child Repositories

```typescript
// Get the PersonRepository (injected via DI)
const personRepository: IPersonRepository = container.get(TYPES.IPersonRepository);

// Access child repositories
const addressRepo = personRepository.getAddressRepository();
const emailRepo = personRepository.getEmailAddressRepository();
const phoneRepo = personRepository.getPersonPhoneRepository();

// Use child repositories directly
const addresses = await addressRepo.findByPersonId(1);
const emails = await emailRepo.findByPersonId(1);
const phones = await phoneRepo.findByPersonId(1);
```

### Convenience Methods

The PersonRepository provides convenience methods for common operations:

```typescript
// Get person with addresses
const personWithAddresses = await personRepository.getPersonWithAddresses(1);

// Get person with email addresses
const personWithEmails = await personRepository.getPersonWithEmailAddresses(1);

// Get person with phone numbers
const personWithPhones = await personRepository.getPersonWithPhoneNumbers(1);

// Get person with all details
const personWithAllDetails = await personRepository.getPersonWithAllDetails(1);
```

### Using the PersonAggregateService

```typescript
// Get person with all related data
const personDetails = await personAggregateService.getPersonWithAllDetails(1);

// Add email address to person
const newEmail = await personAggregateService.addEmailAddress(1, "john.doe@example.com");

// Add phone number to person
const newPhone = await personAggregateService.addPhoneNumber(1, "555-1234", 1);

// Remove phone number from person
await personAggregateService.removePhoneNumber(1, "555-1234");

// Get all email addresses for a person
const emails = await personAggregateService.getPersonEmailAddresses(1);

// Get all phone numbers for a person
const phones = await personAggregateService.getPersonPhoneNumbers(1);
```

## API Endpoints

### Person Aggregate Routes

```
GET    /api/person-aggregate/:id/details          # Get person with all details
GET    /api/person-aggregate/:id/emails           # Get person's email addresses
POST   /api/person-aggregate/:id/emails           # Add email address to person
GET    /api/person-aggregate/:id/phones           # Get person's phone numbers
POST   /api/person-aggregate/:id/phones           # Add phone number to person
DELETE /api/person-aggregate/:id/phones/:phone    # Remove phone number from person
```

### Example API Usage

```bash
# Get person with all details
curl -X GET http://localhost:3000/api/person-aggregate/1/details

# Add email address
curl -X POST http://localhost:3000/api/person-aggregate/1/emails \
  -H "Content-Type: application/json" \
  -d '{"emailAddress": "john.doe@example.com"}'

# Add phone number
curl -X POST http://localhost:3000/api/person-aggregate/1/phones \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "555-1234", "phoneNumberTypeId": 1}'

# Remove phone number
curl -X DELETE http://localhost:3000/api/person-aggregate/1/phones/555-1234
```

## Benefits of This Approach

1. **Aggregate Consistency**: All related data is managed through the Person aggregate root
2. **Separation of Concerns**: Each child repository handles its specific entity
3. **Flexibility**: Can access child repositories directly or through convenience methods
4. **Type Safety**: Strong typing throughout the aggregate
5. **Testability**: Each repository can be tested independently
6. **Maintainability**: Clear separation of responsibilities
7. **Scalability**: Easy to add new child repositories or modify existing ones

## Future Enhancements

1. **AddressType Repository**: For managing address types (Home, Work, etc.)
2. **ContactType Repository**: For managing contact types
3. **CountryRegion Repository**: For managing country/region data
4. **StateProvince Repository**: For managing state/province data
5. **PhoneNumberType Repository**: For managing phone number types (Mobile, Home, Work)

## Database Relationships

The child repositories handle the following relationships:
- **Person → EmailAddress**: One-to-Many (via BusinessEntityID)
- **Person → PersonPhone**: One-to-Many (via BusinessEntityID)
- **Person → Address**: Many-to-Many (via PersonAddress junction table)

## Error Handling

All repositories include proper error handling with custom RepositoryError types and meaningful error messages for debugging and logging purposes.
