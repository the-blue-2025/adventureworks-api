import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
          <a routerLink="new" class="btn btn-primary">Add New Purchase Order</a>
        </div>

        <!-- Search -->
        <div class="form-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search purchase orders..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
        </div>

        <!-- Loading State -->
        @if (purchaseOrderService.purchaseOrdersLoading()) {
          <div class="loading">Loading purchase orders...</div>
        }

        <!-- Error State -->
        @if (purchaseOrderService.purchaseOrdersHasError()) {
          <div class="error">{{ purchaseOrderService.purchaseOrdersError() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Purchase Orders Table -->
        @if (purchaseOrderService.filteredPurchaseOrders().length > 0) {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Vendor</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Total Due</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (order of purchaseOrderService.filteredPurchaseOrders(); track order.purchaseOrderId) {
                  <tr>
                    <td>{{ order.purchaseOrderId }}</td>
                    <td 
                      class="vendor-name" 
                      (click)="viewPurchaseOrderDetail(order.purchaseOrderId)"
                      title="Click to view details">
                      {{ order.vendor?.name || 'N/A' }}
                    </td>
                    <td>{{ order.orderDate | date:'short' }}</td>
                    <td>
                      <span class="status-badge" [class]="getOrderStatusClass(order)">
                        {{ getOrderStatusText(order) }}
                      </span>
                    </td>
                    <td>{{ order.totalDue | currency:'USD' }}</td>
                    <td>
                      <a [routerLink]="['/purchase-orders', order.purchaseOrderId]" class="btn btn-secondary btn-sm">View</a>
                      <a [routerLink]="['/purchase-orders', order.purchaseOrderId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
                      <button (click)="deletePurchaseOrder(order)" class="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else if (!purchaseOrderService.purchaseOrdersLoading()) {
          <div class="text-center py-4">
            <p>No purchase orders found.</p>
          </div>
        }

        <!-- Status Filter -->
        <div class="mt-3">
          <label class="form-label">Filter by Status:</label>
          <select class="form-control" [(ngModel)]="selectedStatus" (change)="onStatusChange()">
            <option value="">All Statuses</option>
            <option value="1">Pending</option>
            <option value="2">Approved</option>
            <option value="3">Rejected</option>
            <option value="4">Complete</option>
          </select>
        </div>
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

    .vendor-name {
      cursor: pointer;
      color: #007bff;
      text-decoration: underline;
    }

    .vendor-name:hover {
      color: #0056b3;
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-badge.status-approved {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.status-rejected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-badge.status-complete {
      background-color: #d1ecf1;
      color: #0c5460;
    }
  `]
})
export class PurchaseOrdersListComponent implements OnInit {
  purchaseOrderService = inject(PurchaseOrderService);
  router = inject(Router);
  
  searchQuery = '';
  selectedStatus = '';
  successMessage = '';

  ngOnInit() {
    this.purchaseOrderService.reload();
  }

  onSearch() {
    this.purchaseOrderService.setSearchQuery(this.searchQuery);
  }

  onStatusChange() {
    this.purchaseOrderService.setStatusFilter(this.selectedStatus);
  }

  async deletePurchaseOrder(order: PurchaseOrderDto) {
    if (confirm(`Are you sure you want to delete Purchase Order #${order.purchaseOrderId}?`)) {
      try {
        await this.purchaseOrderService.deletePurchaseOrder(order.purchaseOrderId);
        this.successMessage = 'Purchase order deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error) {
        console.error('Failed to delete purchase order:', error);
        this.successMessage = 'Error deleting purchase order. Please try again.';
      }
    }
  }

  getOrderStatusClass(order: PurchaseOrderDto): string {
    switch (order.status) {
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 3: return 'status-rejected';
      case 4: return 'status-complete';
      default: return 'status-unknown';
    }
  }

  getOrderStatusText(order: PurchaseOrderDto): string {
    switch (order.status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Complete';
      default: return 'Unknown';
    }
  }

  viewPurchaseOrderDetail(purchaseOrderId: number) {
    this.router.navigate(['/purchase-orders', purchaseOrderId]);
  }
} 