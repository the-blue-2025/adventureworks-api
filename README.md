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

#### Domain-Driven Design (DDD)
- Entity pattern for domain objects (e.g., Person, ShipMethod)
- Aggregate Root pattern to maintain data consistency
- Value Objects for immutable properties
- Repository pattern for data access abstraction

#### Repository Pattern
- Decouples data access logic from business logic
- Provides consistent interface for database operations
- Enables easier unit testing through repository abstraction

#### Factory Pattern
- Static factory methods for entity creation (e.g., ShipMethod.create())
- Encapsulates object creation logic
- Ensures proper initialization of entities

#### Dependency Injection
- Loose coupling between components
- Improved testability
- Configuration injection through environment variables

#### Data Mapper Pattern
- ORM (Sequelize) maps database tables to domain entities
- Separates domain logic from data persistence
- Handles database schema translations

#### Service Layer Pattern
- Orchestrates operations between controllers and repositories
- Implements business logic and transaction management
- Provides clean separation of concerns


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
