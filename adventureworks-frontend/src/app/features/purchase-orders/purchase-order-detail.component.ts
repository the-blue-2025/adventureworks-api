import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { PurchaseOrderDto } from '../../shared/models/purchase-order.dto';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Purchase Order Details</h2>
          <div>
            <a [routerLink]="['/purchase-orders', orderId, 'edit']" class="btn btn-primary">Edit Order</a>
            <a routerLink="/purchase-orders" class="btn btn-secondary">Back to List</a>
          </div>
        </div>

        <!-- Loading State -->
        @if (purchaseOrderService.loading()) {
          <div class="loading">Loading purchase order details...</div>
        }

        <!-- Error State -->
        @if (purchaseOrderService.error()) {
          <div class="error">{{ purchaseOrderService.error() }}</div>
        }

        <!-- Purchase Order Details -->
        @if (purchaseOrderService.selectedItem()) {
          @if (order; as order) {
            <div class="order-details">
              <!-- Order Header -->
              <div class="order-header mb-4">
                <div class="row">
                  <div class="col-md-6">
                    <h3>Order Information</h3>
                    <table class="table">
                      <tbody>
                        <tr>
                          <th>Order ID:</th>
                          <td>{{ order.purchaseOrderId }}</td>
                        </tr>
                        <tr>
                          <th>Status:</th>
                          <td>
                            <span class="status-badge" [class]="purchaseOrderService.getOrderStatusClass(order)">
                              {{ purchaseOrderService.getOrderStatusText(order) }}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Order Date:</th>
                          <td>{{ order.orderDate | date:'full' }}</td>
                        </tr>
                        <tr>
                          <th>Ship Date:</th>
                          <td>{{ order.shipDate | date:'full' || 'Not Shipped' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="col-md-6">
                    <h3>Financial Summary</h3>
                    <table class="table">
                      <tbody>
                        <tr>
                          <th>Subtotal:</th>
                          <td>{{ order.subTotal | currency:'USD' }}</td>
                        </tr>
                        <tr>
                          <th>Tax Amount:</th>
                          <td>{{ order.taxAmt | currency:'USD' }}</td>
                        </tr>
                        <tr>
                          <th>Freight:</th>
                          <td>{{ order.freight | currency:'USD' }}</td>
                        </tr>
                        <tr class="total-row">
                          <th>Total Due:</th>
                          <td><strong>{{ order.totalDue | currency:'USD' }}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Vendor and Employee Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h3>Vendor Information</h3>
                  @if (order.vendor) {
                    <table class="table">
                      <tbody>
                        <tr>
                          <th>Vendor ID:</th>
                          <td>{{ order.vendor.businessEntityId }}</td>
                        </tr>
                        <tr>
                          <th>Vendor Name:</th>
                          <td>{{ order.vendor.name }}</td>
                        </tr>
                        <tr>
                          <th>Account Number:</th>
                          <td>{{ order.vendor.accountNumber }}</td>
                        </tr>
                      </tbody>
                    </table>
                  } @else {
                    <p>Vendor ID: {{ order.vendorId }}</p>
                  }
                </div>
                <div class="col-md-6">
                  <h3>Employee Information</h3>
                  @if (order.employee) {
                    <table class="table">
                      <tbody>
                        <tr>
                          <th>Employee ID:</th>
                          <td>{{ order.employee.businessEntityId }}</td>
                        </tr>
                        <tr>
                          <th>Employee Name:</th>
                          <td>{{ order.employee.firstName }} {{ order.employee.lastName }}</td>
                        </tr>
                      </tbody>
                    </table>
                  } @else {
                    <p>Employee information not available</p>
                  }
                </div>
              </div>

              <!-- Shipping Information -->
              @if (order.shipMethod) {
                <div class="mb-4">
                  <h3>Shipping Information</h3>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th>Ship Method:</th>
                        <td>{{ order.shipMethod.name }}</td>
                      </tr>
                      <tr>
                        <th>Ship Base:</th>
                        <td>{{ order.shipMethod.shipBase | currency:'USD' }}</td>
                      </tr>
                      <tr>
                        <th>Ship Rate:</th>
                        <td>{{ order.shipMethod.shipRate | currency:'USD' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }

              <!-- Order Details -->
              @if (order.purchaseOrderDetails && order.purchaseOrderDetails.length > 0) {
                <div class="mb-4">
                  <h3>Order Line Items</h3>
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Detail ID</th>
                          <th>Product ID</th>
                          <th>Due Date</th>
                          <th>Order Qty</th>
                          <th>Unit Price</th>
                          <th>Line Total</th>
                          <th>Received Qty</th>
                          <th>Rejected Qty</th>
                          <th>Stocked Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (detail of order.purchaseOrderDetails; track detail.purchaseOrderDetailId) {
                          <tr>
                            <td>{{ detail.purchaseOrderDetailId }}</td>
                            <td>{{ detail.productId }}</td>
                            <td>{{ detail.dueDate | date:'short' }}</td>
                            <td>{{ detail.orderQty }}</td>
                            <td>{{ detail.unitPrice | currency:'USD' }}</td>
                            <td>{{ detail.lineTotal | currency:'USD' }}</td>
                            <td>{{ detail.receivedQty }}</td>
                            <td>{{ detail.rejectedQty }}</td>
                            <td>{{ detail.stockedQty || 'N/A' }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              } @else {
                <div class="mb-4">
                  <h3>Order Line Items</h3>
                  <p>No line items found for this order.</p>
                </div>
              }
            </div>
          }
        } @else if (!purchaseOrderService.loading()) {
          <div class="text-center py-4">
            <p>Purchase order not found.</p>
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
    
    .mb-3, .mb-4 {
      margin-bottom: 1rem;
    }
    
    .mb-4 {
      margin-bottom: 1.5rem;
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
    
    .order-details h3 {
      margin-bottom: 1rem;
      color: #495057;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }
    
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .total-row {
      background-color: #f8f9fa;
      font-weight: 600;
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
    
    @media (max-width: 768px) {
      .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class PurchaseOrderDetailComponent implements OnInit {
  purchaseOrderService = inject(PurchaseOrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  orderId = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadPurchaseOrder();
    });
  }

  loadPurchaseOrder() {
    this.purchaseOrderService.getPurchaseOrderById(this.orderId).subscribe();
  }

  get order(): PurchaseOrderDto | null {
    return this.purchaseOrderService.selectedItem();
  }
} 