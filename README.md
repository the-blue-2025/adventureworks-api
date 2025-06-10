# adventureworks-api

## Project Overview

This project is a RESTful API built to interact with the AdventureWorks database. Here are the key technical aspects:

### Backend Technologies
- Node.js/TypeScript - Core backend framework
- Express.js - Web application framework
- Sequelize ORM - Database interactions with Microsoft SQL Server
- RESTful API design principles

### Database
- Microsoft SQL Server (AdventureWorks2019)
- Secure database connection with environment variables
- SQL Server encryption and certificate handling

### API Features
- CRUD operations (Create, Read, Update, Delete)
- Resource-based routing
- Consistent endpoint structure (/api/v1/resource)
- Relationship handling between entities (e.g., purchase orders and their details)

### Development Practices
- Environment configuration using dotenv
- TypeScript for type safety
- Modular architecture
- Clear API documentation

### Design Patterns

The project implements several key design patterns to ensure maintainable and scalable code:

1. **Repository Pattern**: Abstracts the data persistence layer from the business logic. Each entity has its own repository that handles data access operations, making the code more maintainable and testable.

2. **Template Method Pattern**: Implemented in the repository layer to standardize CRUD operations while allowing entity-specific customization.
   - Base repository defines the template for CRUD operations using TypeScript generics
   - Concrete repositories only implement entity-specific methods:
     - ID field name specification
     - Domain/persistence object mapping
     - Custom operations when needed (e.g., relationship handling)
   - Reduces code duplication and enforces consistent data access patterns
   - Allows for flexible extension points in specific repositories
   - Uses TypeScript generics for type-safe implementations
   - Provides abstract methods for domain/persistence mapping

3. **Dependency Injection**: Uses InversifyJS for dependency injection, making the code more modular and easier to test.
   - Services and repositories are injectable
   - Dependencies are resolved at runtime
   - Facilitates easier unit testing through mocking

4. **Domain-Driven Design (DDD)**: Organizes code around business concepts and domain logic.
   - Clear separation between domain entities and database models
   - Business rules encapsulated in domain entities
   - Repository interfaces defined in domain layer

### API Endpoints Summary

The API provides RESTful endpoints for managing various resources:

#### Resource Endpoints
All resources follow a consistent pattern with standard CRUD operations under `/api/v1/`:

- **Purchase Orders** (`/purchase-orders`)
  - Full CRUD operations
  - Additional detail endpoints through `/purchase-order-details`
  - Special endpoint for details by purchase order ID

- **Ship Methods** (`/ship-methods`)
  - Complete CRUD functionality
  - Manages shipping options and rates

- **Persons** (`/persons`) 
  - Standard CRUD operations
  - Handles individual person records

- **Vendors** (`/vendors`)
  - Full CRUD capabilities
  - Manages vendor information

Each resource supports:
- List all (GET /)
- Get single (GET /:id) 
- Create (POST /)
- Update (PUT /:id)
- Delete (DELETE /:id)

All endpoints use consistent URL structure and HTTP methods following REST conventions.
