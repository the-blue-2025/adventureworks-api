# Purchase Orders Feature

This feature provides complete management of purchase orders in the AdventureWorks system, including listing, viewing details, creating, and editing purchase orders.

## Components

### 1. PurchaseOrdersListComponent
**File**: `purchase-orders-list.component.ts`

**Features**:
- Displays all purchase orders in a responsive table
- Advanced filtering by status, date range, and vendor
- Search functionality
- Status badges with color coding
- Financial summaries and statistics
- Click-to-view functionality
- CRUD operations (Create, Read, Update, Delete)

**Key Features**:
- **Status Filtering**: Filter by Pending, Approved, Rejected, or Complete
- **Date Range Filtering**: Filter orders by order date range
- **Vendor Filtering**: Filter orders by vendor ID
- **Summary Statistics**: Total orders, total value, pending count, completed count
- **Responsive Design**: Works on desktop and mobile devices

**Template Features**:
```html
<!-- Status badges -->
<span class="status-badge" [class]="purchaseOrderService.getOrderStatusClass(order)">
  {{ purchaseOrderService.getOrderStatusText(order) }}
</span>

<!-- Financial summary -->
<div class="summary-stats">
  <div class="stat-card">
    <h4>Total Orders</h4>
    <p class="stat-number">{{ purchaseOrderService.count() }}</p>
  </div>
</div>
```

### 2. PurchaseOrderDetailComponent
**File**: `purchase-order-detail.component.ts`

**Features**:
- Comprehensive order information display
- Vendor and employee details
- Shipping information
- Order line items (purchase order details)
- Financial breakdown
- Navigation to edit mode

**Sections**:
1. **Order Information**: ID, status, dates
2. **Financial Summary**: Subtotal, tax, freight, total
3. **Vendor Information**: Vendor details and contact info
4. **Employee Information**: Employee who placed the order
5. **Shipping Information**: Ship method and costs
6. **Order Line Items**: Detailed list of products ordered

**Template Structure**:
```html
<div class="order-details">
  <!-- Order Header -->
  <div class="order-header">
    <!-- Order and Financial Information -->
  </div>
  
  <!-- Vendor and Employee Information -->
  <div class="row">
    <!-- Vendor details -->
    <!-- Employee details -->
  </div>
  
  <!-- Shipping Information -->
  <!-- Order Line Items -->
</div>
```

### 3. PurchaseOrderFormComponent
**File**: `purchase-order-form.component.ts`

**Features**:
- Create new purchase orders
- Edit existing purchase orders
- Form validation
- Real-time feedback
- Navigation between create and edit modes

**Form Fields**:
- Status selection
- Employee ID
- Vendor ID
- Ship Method ID
- Order Date
- Ship Date (optional)
- Financial amounts (Subtotal, Tax, Freight)

## Service Integration

### PurchaseOrderService
The components use the `PurchaseOrderService` which extends `BaseSignalService` for reactive state management:

```typescript
export class PurchaseOrderService extends BaseSignalService<PurchaseOrderDto> {
  // Load all purchase orders
  loadPurchaseOrders(): Observable<PurchaseOrderDto[]>
  
  // Get purchase order by ID
  getPurchaseOrderById(id: number): Observable<PurchaseOrderDto>
  
  // Create new purchase order
  createPurchaseOrder(order: CreatePurchaseOrderDto): Observable<PurchaseOrderDto>
  
  // Update purchase order
  updatePurchaseOrder(id: number, order: UpdatePurchaseOrderDto): Observable<PurchaseOrderDto>
  
  // Delete purchase order
  deletePurchaseOrder(id: number): Observable<void>
  
  // Filter by vendor
  getPurchaseOrdersByVendor(vendorId: number): Observable<PurchaseOrderDto[]>
  
  // Filter by status
  getPurchaseOrdersByStatus(status: number): Observable<PurchaseOrderDto[]>
  
  // Filter by date range
  getPurchaseOrdersByDateRange(startDate: Date, endDate: Date): Observable<PurchaseOrderDto[]>
}
```

## Routing

### Purchase Orders Routes
```typescript
export const PURCHASE_ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: PurchaseOrdersListComponent
  },
  {
    path: 'new',
    component: PurchaseOrderFormComponent
  },
  {
    path: ':id',
    component: PurchaseOrderDetailComponent
  },
  {
    path: ':id/edit',
    component: PurchaseOrderFormComponent
  }
];
```

## Data Models

### PurchaseOrderDto
```typescript
export interface PurchaseOrderDto {
  purchaseOrderId: number;
  status: number;
  vendorId: number;
  orderDate: Date;
  shipDate: Date | null;
  subTotal: number;
  taxAmt: number;
  freight: number;
  totalDue: number;
  shipMethod?: ShipMethodDto;
  purchaseOrderDetails?: PurchaseOrderDetailDto[];
  employee?: EmployeeDto;
  vendor?: VendorDto;
}
```

### CreatePurchaseOrderDto
```typescript
export interface CreatePurchaseOrderDto {
  status: number;
  employeeId: number;
  vendorId: number;
  shipMethodId: number;
  orderDate: Date;
  shipDate?: Date;
  subTotal: number;
  taxAmt: number;
  freight: number;
  purchaseOrderDetails?: CreatePurchaseOrderDetailDto[];
}
```

## UI Features

### Status Management
- **Status Codes**: 1=Pending, 2=Approved, 3=Rejected, 4=Complete
- **Status Badges**: Color-coded badges for easy identification
- **Status Filtering**: Filter orders by status

### Financial Display
- **Currency Formatting**: All monetary values formatted as USD
- **Calculated Totals**: Automatic calculation of total due
- **Summary Statistics**: Aggregated financial data

### Responsive Design
- **Mobile-First**: Responsive design that works on all screen sizes
- **Table Responsiveness**: Horizontal scrolling on small screens
- **Flexible Layouts**: Grid-based layouts that adapt to screen size

## Usage Examples

### Loading Purchase Orders
```typescript
ngOnInit() {
  this.purchaseOrderService.loadPurchaseOrders().subscribe();
}
```

### Filtering by Status
```typescript
onStatusChange() {
  if (this.selectedStatus) {
    this.purchaseOrderService.getPurchaseOrdersByStatus(+this.selectedStatus).subscribe();
  } else {
    this.loadPurchaseOrders();
  }
}
```

### Viewing Order Details
```typescript
viewOrder(order: PurchaseOrderDto) {
  this.purchaseOrderService.selectPurchaseOrder(order);
  this.router.navigate(['/purchase-orders', order.purchaseOrderId]);
}
```

### Creating New Order
```typescript
onSubmit() {
  this.purchaseOrderService.createPurchaseOrder(this.order).subscribe(() => {
    this.successMessage = 'Purchase order created successfully!';
    this.router.navigate(['/purchase-orders']);
  });
}
```

## Styling

### CSS Classes
- `.status-badge`: Status indicator styling
- `.order-row`: Table row styling with hover effects
- `.summary-stats`: Statistics card styling
- `.stat-card`: Individual statistic styling
- `.total-row`: Highlighted total row styling

### Status Colors
- **Pending**: Yellow (#ffc107)
- **Approved**: Green (#28a745)
- **Rejected**: Red (#dc3545)
- **Complete**: Blue (#17a2b8)

## Error Handling

### Loading States
- Loading indicators during API calls
- Disabled buttons during operations
- User feedback for all operations

### Error States
- Error message display
- Graceful fallbacks for missing data
- User-friendly error messages

### Success Feedback
- Success messages for operations
- Automatic navigation after successful operations
- Visual feedback for user actions

## Future Enhancements

1. **Advanced Filtering**: More filter options (date ranges, amounts, etc.)
2. **Bulk Operations**: Select multiple orders for bulk actions
3. **Export Functionality**: Export orders to PDF or Excel
4. **Real-time Updates**: WebSocket integration for live updates
5. **Advanced Search**: Full-text search across order data
6. **Order Templates**: Save and reuse order templates
7. **Approval Workflow**: Multi-step approval process
8. **Email Notifications**: Automatic email notifications for status changes 