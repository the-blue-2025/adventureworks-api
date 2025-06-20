import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { PurchaseOrderDto } from '../../shared/models/purchase-order.dto';

@Component({
  selector: 'app-purchase-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Purchase Orders</h2>
          <a routerLink="new" class="btn btn-primary">Create New Order</a>
        </div>

        <!-- Advanced Filters -->
        <div class="filters mb-3">
          <div class="row">
            <div class="col-md-3">
              <label class="form-label">Status Filter:</label>
              <select class="form-control" [(ngModel)]="selectedStatus" (change)="onStatusChange()">
                <option value="">All Statuses</option>
                <option value="1">Pending</option>
                <option value="2">Approved</option>
                <option value="3">Rejected</option>
                <option value="4">Complete</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Date Range:</label>
              <div class="d-flex gap-2">
                <input type="date" class="form-control" [(ngModel)]="startDate" (change)="onDateRangeChange()">
                <input type="date" class="form-control" [(ngModel)]="endDate" (change)="onDateRangeChange()">
              </div>
            </div>
            <div class="col-md-3">
              <label class="form-label">Vendor Filter:</label>
              <input type="number" class="form-control" placeholder="Vendor ID" [(ngModel)]="vendorId" (input)="onVendorChange()">
            </div>
            <div class="col-md-3">
              <label class="form-label">Search:</label>
              <input type="text" class="form-control" placeholder="Search orders..." [(ngModel)]="searchQuery" (input)="onSearchChange()">
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-md-6">
              <label class="form-label">Value Range:</label>
              <div class="d-flex gap-2">
                <input type="number" class="form-control" placeholder="Min Value" [(ngModel)]="minValue" (input)="onValueRangeChange()">
                <input type="number" class="form-control" placeholder="Max Value" [(ngModel)]="maxValue" (input)="onValueRangeChange()">
              </div>
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <button class="btn btn-secondary" (click)="clearAllFilters()">Clear All Filters</button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        @if (purchaseOrderService.loading()) {
          <div class="loading">Loading purchase orders...</div>
        }

        <!-- Error State -->
        @if (purchaseOrderService.error()) {
          <div class="error">{{ purchaseOrderService.error() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage()) {
          <div class="success">{{ successMessage() }}</div>
        }

        <!-- Purchase Orders Table -->
        @if (purchaseOrderService.filteredData().length > 0) {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Vendor</th>
                  <th>Order Date</th>
                  <th>Ship Date</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Freight</th>
                  <th>Total Due</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (order of purchaseOrderService.data(); track order.purchaseOrderId) {
                  <tr class="order-row" (click)="viewOrder(order)">
                    <td>{{ order.purchaseOrderId }}</td>
                    <td>
                      <span class="status-badge" [class]="purchaseOrderService.getOrderStatusClass(order)">
                        {{ purchaseOrderService.getOrderStatusText(order) }}
                      </span>
                    </td>
                    <td>
                      @if (order.vendor) {
                        {{ order.vendor.name }}
                      } @else {
                        {{ order.vendorId }}
                      }
                    </td>
                    <td>{{ order.orderDate | date:'short' }}</td>
                    <td>{{ order.shipDate | date:'short' || 'Not Shipped' }}</td>
                    <td>{{ order.subTotal | currency:'USD' }}</td>
                    <td>{{ order.taxAmt | currency:'USD' }}</td>
                    <td>{{ order.freight | currency:'USD' }}</td>
                    <td>
                      <strong>{{ order.totalDue | currency:'USD' }}</strong>
                    </td>
                    <td>
                      <button class="btn btn-primary btn-sm" (click)="viewOrder(order); $event.stopPropagation()">
                        View Details
                      </button>
                      <button class="btn btn-secondary btn-sm" (click)="editOrder(order); $event.stopPropagation()">
                        Edit
                      </button>
                      <button class="btn btn-danger btn-sm" (click)="deleteOrder(order); $event.stopPropagation()">
                        Delete
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Summary Statistics -->
          <div class="summary-stats mt-3">
            <div class="row">
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>Total Orders</h4>
                  <p class="stat-number">{{ purchaseOrderService.count() }}</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>Total Value</h4>
                  <p class="stat-number">{{ getTotalValue() | currency:'USD' }}</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>Pending Orders</h4>
                  <p class="stat-number">{{ getPendingCount() }}</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>Completed Orders</h4>
                  <p class="stat-number">{{ getCompletedCount() }}</p>
                </div>
              </div>
            </div>
          </div>
        } @else if (!purchaseOrderService.loading()) {
          <div class="text-center py-4">
            <p>No purchase orders found.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .d-flex {
      display: flex;
    }
    
    .justify-content-between {
      justify-content: space-between;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .mb-3 {
      margin-bottom: 1rem;
    }
    
    .mt-3 {
      margin-top: 1rem;
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -0.75rem;
    }
    
    .col-md-3, .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
      padding: 0 0.75rem;
    }
    
    .col-md-3 {
      flex: 0 0 25%;
      max-width: 25%;
    }
    
    .gap-2 {
      gap: 0.5rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }
    
    .text-center {
      text-align: center;
    }
    
    .py-4 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .order-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .order-row:hover {
      background-color: #f8f9fa;
    }
    
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .summary-stats {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
    }
    
    .stat-card {
      text-align: center;
      padding: 1rem;
    }
    
    .stat-card h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 500;
    }
    
    .stat-number {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #495057;
    }
    
    @media (max-width: 768px) {
      .col-md-3, .col-md-4 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 1rem;
      }
      
      .filters .row {
        flex-direction: column;
      }
    }
  `]
})
export class PurchaseOrdersListComponent implements OnInit {
  purchaseOrderService = inject(PurchaseOrderService);
  
  selectedStatus = '';
  startDate = '';
  endDate = '';
  vendorId = '';
  successMessage = '';

  ngOnInit() {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders() {
    this.purchaseOrderService.loadPurchaseOrders().subscribe();
  }

  onStatusChange() {
    if (this.selectedStatus) {
      this.purchaseOrderService.getPurchaseOrdersByStatus(+this.selectedStatus).subscribe();
    } else {
      this.loadPurchaseOrders();
    }
  }

  onDateRangeChange() {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.purchaseOrderService.getPurchaseOrdersByDateRange(start, end).subscribe();
    } else {
      this.loadPurchaseOrders();
    }
  }

  onVendorChange() {
    if (this.vendorId) {
      this.purchaseOrderService.getPurchaseOrdersByVendor(+this.vendorId).subscribe();
    } else {
      this.loadPurchaseOrders();
    }
  }

  viewOrder(order: PurchaseOrderDto) {
    this.purchaseOrderService.selectPurchaseOrder(order);
  }

  editOrder(order: PurchaseOrderDto) {
    this.purchaseOrderService.selectPurchaseOrder(order);
  }

  deleteOrder(order: PurchaseOrderDto) {
    if (confirm(`Are you sure you want to delete Purchase Order #${order.purchaseOrderId}?`)) {
      this.purchaseOrderService.deletePurchaseOrder(order.purchaseOrderId).subscribe(() => {
        this.successMessage = 'Purchase order deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      });
    }
  }

  getTotalValue(): number {
    return this.purchaseOrderService.data().reduce((total, order) => total + order.totalDue, 0);
  }

  getPendingCount(): number {
    return this.purchaseOrderService.data().filter(order => order.status === 1).length;
  }

  getCompletedCount(): number {
    return this.purchaseOrderService.data().filter(order => order.status === 4).length;
  }
} 