# AdventureWorks Frontend

A modern Angular application that provides a user interface for managing AdventureWorks data. This application uses Angular Signals for reactive state management and communicates with the AdventureWorks API backend.

## Features

- **Persons Management**: View, create, edit, and delete person records
- **Vendors Management**: Manage vendor information and status
- **Purchase Orders**: Handle purchase order lifecycle
- **Ship Methods**: Configure shipping methods
- **Purchase Order Details**: Manage order line items
- **Modern UI**: Responsive design with modern styling
- **Angular Signals**: Reactive state management using Angular's new signals API

## Technology Stack

- **Angular 17**: Latest version with standalone components
- **Angular Signals**: For reactive state management
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with variables and mixins
- **RxJS**: Reactive programming for HTTP requests
- **Angular Router**: Client-side routing

## Project Structure

```
src/
├── app/
│   ├── features/                    # Feature modules
│   │   ├── persons/                 # Persons feature
│   │   ├── vendors/                 # Vendors feature
│   │   ├── purchase-orders/         # Purchase orders feature
│   │   ├── ship-methods/            # Ship methods feature
│   │   └── purchase-order-details/  # Purchase order details feature
│   ├── shared/                      # Shared modules and services
│   │   ├── models/                  # DTOs and interfaces
│   │   └── services/                # API services and signal services
│   ├── app.component.ts             # Main application component
│   ├── app.config.ts                # Application configuration
│   └── app.routes.ts                # Main routing configuration
├── index.html                       # Main HTML file
├── main.ts                          # Application entry point
└── styles.scss                      # Global styles
```

## Shared Models

The application shares DTOs with the backend API:

- `PersonDto`: Person entity with personal information
- `VendorDto`: Vendor entity with business information
- `PurchaseOrderDto`: Purchase order with details and relationships
- `ShipMethodDto`: Shipping method configuration
- `PurchaseOrderDetailDto`: Individual line items in purchase orders

## Signal Services

The application uses a base signal service pattern for reactive state management:

- `BaseSignalService<T>`: Generic base class providing common signal functionality
- `PersonService`: Manages person data with signals
- `VendorService`: Manages vendor data with signals
- `PurchaseOrderService`: Manages purchase order data with signals
- `ShipMethodService`: Manages ship method data with signals
- `PurchaseOrderDetailService`: Manages order detail data with signals

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- AdventureWorks API backend running

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd adventureworks-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Configuration

The application is configured to connect to the AdventureWorks API backend. Update the base URL in `src/app/shared/services/api.service.ts` if your backend is running on a different port:

```typescript
private readonly baseUrl = 'http://localhost:3000/api'; // Adjust as needed
```

## Development

### Building the Application

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Code Structure

#### Components
- **Standalone Components**: All components are standalone for better tree-shaking
- **Signal Integration**: Components use signals for reactive data binding
- **Type Safety**: Full TypeScript support with strict typing

#### Services
- **Signal-Based State**: All services extend `BaseSignalService` for consistent state management
- **HTTP Integration**: Services handle API communication with error handling
- **Reactive Updates**: Automatic UI updates when data changes

#### Styling
- **SCSS**: Advanced styling with variables, mixins, and nested rules
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern UI**: Clean, professional design with consistent spacing and colors

## API Integration

The application communicates with the AdventureWorks API using the following endpoints:

- `GET /api/persons` - Get all persons
- `POST /api/persons` - Create a new person
- `PUT /api/persons/:id` - Update a person
- `DELETE /api/persons/:id` - Delete a person
- Similar endpoints for vendors, purchase orders, ship methods, and order details

## Features in Detail

### Persons Management
- List all persons with search and filtering
- View detailed person information
- Create new persons with validation
- Edit existing person records
- Delete persons with confirmation

### Vendors Management
- Manage vendor information and status
- Filter by active/preferred vendors
- Credit rating display and management

### Purchase Orders
- Complete purchase order lifecycle management
- Status tracking and updates
- Relationship management with vendors and employees

### Ship Methods
- Configure shipping methods
- Set base rates and shipping costs

### Purchase Order Details
- Manage individual line items
- Track quantities and pricing

## Contributing

1. Follow Angular coding standards
2. Use TypeScript strict mode
3. Implement proper error handling
4. Add appropriate unit tests
5. Ensure responsive design

## License

This project is part of the AdventureWorks API ecosystem. 