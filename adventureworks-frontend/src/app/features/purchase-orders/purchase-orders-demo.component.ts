import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchaseOrderService } from '../../shared/services/purchase-order.service';
import { PurchaseOrderDto } from '../../shared/models/purchase-order.dto';

@Component({
  selector: 'app-purchase-orders-demo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>Purchase Orders Demo</h2>
        <p>This is a demo of the purchase orders functionality. The actual components are ready to use once dependencies are installed.</p>
        
        <div class="demo-features">
          <h3>Features Implemented:</h3>
          <ul>
            <li>✅ Purchase Orders List Component with filtering and search</li>
            <li>✅ Purchase Order Detail Component with comprehensive order information</li>
            <li>✅ Purchase Order Form Component for creating/editing orders</li>
            <li>✅ Angular Signals integration for reactive state management</li>
            <li>✅ Status badges and financial summaries</li>
            <li>✅ Responsive design with modern UI</li>
          </ul>
        </div>

        <div class="demo-navigation">
          <h3>Navigation:</h3>
          <div class="nav-buttons">
            <a routerLink="/purchase-orders" class="btn btn-primary">View Purchase Orders List</a>
            <a routerLink="/purchase-orders/new" class="btn btn-success">Create New Order</a>
          </div>
        </div>

        <div class="demo-structure">
          <h3>Component Structure:</h3>
          <pre><code>
purchase-orders/
├── purchase-orders.routes.ts          # Route configuration
├── purchase-orders-list.component.ts  # List all orders
├── purchase-order-detail.component.ts # Show order details
└── purchase-order-form.component.ts   # Create/edit orders
          </code></pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-features ul {
      list-style: none;
      padding: 0;
    }
    
    .demo-features li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .demo-features li:last-child {
      border-bottom: none;
    }
    
    .demo-navigation {
      margin: 2rem 0;
    }
    
    .nav-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .demo-structure {
      margin-top: 2rem;
    }
    
    .demo-structure pre {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    .demo-structure code {
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
    }
  `]
})
export class PurchaseOrdersDemoComponent implements OnInit {
  purchaseOrderService = inject(PurchaseOrderService);

  ngOnInit() {
    // Load some sample data for demo
    this.loadSampleData();
  }

  loadSampleData() {
    // This would normally load from the API
    console.log('Loading purchase orders data...');
  }
} 