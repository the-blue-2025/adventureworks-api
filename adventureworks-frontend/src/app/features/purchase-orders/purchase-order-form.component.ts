import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { PurchaseOrderDto, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../../shared/models/purchase-order.dto';

@Component({
  selector: 'app-purchase-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>{{ isEditMode ? 'Edit Purchase Order' : 'Create New Purchase Order' }}</h2>
          <a routerLink="/purchase-orders" class="btn btn-secondary">Back to List</a>
        </div>

        <!-- Loading State -->
        @if (purchaseOrderService.purchaseOrdersLoading()) {
          <div class="loading">Saving purchase order...</div>
        }

        <!-- Error State -->
        @if (purchaseOrderService.purchaseOrdersError()) {
          <div class="error">{{ purchaseOrderService.purchaseOrdersError() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Purchase Order Form -->
        <form (ngSubmit)="onSubmit()" #purchaseOrderForm="ngForm">
          <div class="row">
            <div class="col-md-6">
              <h3>Order Information</h3>
              
              <div class="form-group">
                <label for="status" class="form-label">Status *</label>
                <select id="status" name="status" class="form-control" 
                        [(ngModel)]="order.status" required>
                  <option value="">Select Status</option>
                  <option value="1">Pending</option>
                  <option value="2">Approved</option>
                  <option value="3">Rejected</option>
                  <option value="4">Complete</option>
                </select>
              </div>

              <div class="form-group">
                <label for="employeeId" class="form-label">Employee ID *</label>
                <input type="number" id="employeeId" name="employeeId" class="form-control"
                       [(ngModel)]="order.employeeId" required>
              </div>

              <div class="form-group">
                <label for="vendorId" class="form-label">Vendor ID *</label>
                <input type="number" id="vendorId" name="vendorId" class="form-control"
                       [(ngModel)]="order.vendorId" required>
              </div>

              <div class="form-group">
                <label for="shipMethodId" class="form-label">Ship Method ID *</label>
                <input type="number" id="shipMethodId" name="shipMethodId" class="form-control"
                       [(ngModel)]="order.shipMethodId" required>
              </div>
            </div>

            <div class="col-md-6">
              <h3>Financial Information</h3>
              
              <div class="form-group">
                <label for="orderDate" class="form-label">Order Date *</label>
                <input type="date" id="orderDate" name="orderDate" class="form-control"
                       [(ngModel)]="order.orderDate" required>
              </div>

              <div class="form-group">
                <label for="shipDate" class="form-label">Ship Date</label>
                <input type="date" id="shipDate" name="shipDate" class="form-control"
                       [(ngModel)]="order.shipDate">
              </div>

              <div class="form-group">
                <label for="subTotal" class="form-label">Subtotal *</label>
                <input type="number" id="subTotal" name="subTotal" class="form-control"
                       [(ngModel)]="order.subTotal" step="0.01" required>
              </div>

              <div class="form-group">
                <label for="taxAmt" class="form-label">Tax Amount *</label>
                <input type="number" id="taxAmt" name="taxAmt" class="form-control"
                       [(ngModel)]="order.taxAmt" step="0.01" required>
              </div>

              <div class="form-group">
                <label for="freight" class="form-label">Freight *</label>
                <input type="number" id="freight" name="freight" class="form-control"
                       [(ngModel)]="order.freight" step="0.01" required>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="purchaseOrderService.isLoading()">
              {{ isEditMode ? 'Update' : 'Create' }} Purchase Order
            </button>
            <a routerLink="/purchase-orders" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
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
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -0.75rem;
    }
    
    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 0 0.75rem;
    }
    
    .form-actions {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }
    
    .form-actions .btn {
      margin-right: 0.5rem;
    }
    
    h3 {
      margin-bottom: 1rem;
      color: #495057;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class PurchaseOrderFormComponent implements OnInit {
  purchaseOrderService = inject(PurchaseOrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  orderId = 0;
  isEditMode = false;
  successMessage = '';
  
  order: CreatePurchaseOrderDto = {
    status: 1,
    employeeId: 0,
    vendorId: 0,
    shipMethodId: 0,
    orderDate: new Date(),
    subTotal: 0,
    taxAmt: 0,
    freight: 0
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.isEditMode = true;
        this.loadPurchaseOrder();
      }
    });
  }

  async loadPurchaseOrder() {
    try {
      this.purchaseOrderService.selectPurchaseOrder(this.orderId);
      // Wait a bit for the effect to load the data
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const order = this.purchaseOrderService.selectedPurchaseOrder();
      if (order) {
        this.order = {
          status: order.status,
          employeeId: order.employee?.businessEntityId || 0,
          vendorId: order.vendorId,
          shipMethodId: order.shipMethod?.shipMethodId || 0,
          orderDate: order.orderDate,
          shipDate: order.shipDate || undefined,
          subTotal: order.subTotal,
          taxAmt: order.taxAmt,
          freight: order.freight
        };
      }
    } catch (error) {
      console.error('Failed to load purchase order:', error);
    }
  }

  async onSubmit() {
    try {
      if (this.isEditMode) {
        await this.purchaseOrderService.updatePurchaseOrder(this.orderId, this.order);
        this.successMessage = 'Purchase order updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/purchase-orders', this.orderId]);
        }, 1500);
      } else {
        await this.purchaseOrderService.createPurchaseOrder(this.order);
        this.successMessage = 'Purchase order created successfully!';
        setTimeout(() => {
          this.router.navigate(['/purchase-orders']);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to save purchase order:', error);
      this.successMessage = 'Error saving purchase order. Please try again.';
    }
  }
} 