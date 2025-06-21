import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../shared/services/vendor.service';
import { VendorDto } from '../../shared/models/vendor.dto';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Vendor Details</h2>
          <div>
            <a [routerLink]="['/vendors', vendorId, 'edit']" class="btn btn-primary">Edit</a>
            <a routerLink="/vendors" class="btn btn-secondary">Back to List</a>
          </div>
        </div>

        <!-- Loading State -->
        @if (vendorService.isLoading()) {
          <div class="loading">Loading vendor details...</div>
        }

        <!-- Error State -->
        @if (vendorService.error()) {
          <div class="error">{{ vendorService.error() }}</div>
        }

        <!-- Vendor Details -->
        @if (vendorService.selectedVendor()) {
          @if (vendor; as vendor) {
            <div class="vendor-details">
              <div class="row">
                <div class="col-md-6">
                  <h3>Basic Information</h3>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th>Business Entity ID:</th>
                        <td>{{ vendor.businessEntityId }}</td>
                      </tr>
                      <tr>
                        <th>Name:</th>
                        <td>{{ vendor.name }}</td>
                      </tr>
                      <tr>
                        <th>Account Number:</th>
                        <td>{{ vendor.accountNumber }}</td>
                      </tr>
                      <tr>
                        <th>Status:</th>
                        <td>
                          <span [class]="getStatusClass(vendor)">
                            {{ vendorService.getVendorStatus(vendor) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <h3>Additional Information</h3>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th>Credit Rating:</th>
                        <td>{{ vendorService.getCreditRatingText(vendor) }} ({{ vendor.creditRating }})</td>
                      </tr>
                      <tr>
                        <th>Active Flag:</th>
                        <td>{{ vendor.activeFlag ? 'Yes' : 'No' }}</td>
                      </tr>
                      <tr>
                        <th>Preferred Vendor:</th>
                        <td>{{ vendor.preferredVendorStatus ? 'Yes' : 'No' }}</td>
                      </tr>
                      <tr>
                        <th>Web Service URL:</th>
                        <td>{{ vendor.purchasingWebServiceURL || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <th>Modified Date:</th>
                        <td>{{ vendor.modifiedDate | date:'full' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Status Summary -->
              <div class="row mt-4">
                <div class="col-12">
                  <h3>Status Summary</h3>
                  <div class="status-cards">
                    <div class="status-card" [class.active]="vendor.activeFlag">
                      <div class="status-icon">🟢</div>
                      <div class="status-text">
                        <strong>Active Status:</strong> {{ vendor.activeFlag ? 'Active' : 'Inactive' }}
                      </div>
                    </div>
                    <div class="status-card" [class.preferred]="vendor.preferredVendorStatus">
                      <div class="status-icon">⭐</div>
                      <div class="status-text">
                        <strong>Preferred Status:</strong> {{ vendor.preferredVendorStatus ? 'Preferred Vendor' : 'Standard Vendor' }}
                      </div>
                    </div>
                    <div class="status-card">
                      <div class="status-icon">📊</div>
                      <div class="status-text">
                        <strong>Credit Rating:</strong> {{ vendorService.getCreditRatingText(vendor) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        } @else if (!vendorService.isLoading()) {
          <div class="text-center py-4">
            <p>Vendor not found.</p>
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
    
    .mt-4 {
      margin-top: 1.5rem;
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

    .col-12 {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 0.75rem;
    }
    
    .vendor-details h3 {
      margin-bottom: 1rem;
      color: #495057;
    }
    
    .text-center {
      text-align: center;
    }
    
    .py-4 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }

    .status-active {
      color: #28a745;
      font-weight: bold;
    }

    .status-preferred {
      color: #ffc107;
      font-weight: bold;
    }

    .status-inactive {
      color: #dc3545;
      font-weight: bold;
    }

    .status-cards {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .status-card {
      flex: 1;
      min-width: 200px;
      padding: 1rem;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-card.active {
      border-color: #28a745;
      background-color: #d4edda;
    }

    .status-card.preferred {
      border-color: #ffc107;
      background-color: #fff3cd;
    }

    .status-icon {
      font-size: 1.5rem;
    }

    .status-text {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 1rem;
      }

      .status-cards {
        flex-direction: column;
      }

      .status-card {
        min-width: auto;
      }
    }
  `]
})
export class VendorDetailComponent implements OnInit {
  vendorService = inject(VendorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  vendorId = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vendorId = +params['id'];
      this.loadVendor();
    });
  }

  loadVendor() {
    this.vendorService.selectVendor(this.vendorId);
  }

  get vendor(): VendorDto | null {
    return this.vendorService.selectedVendor();
  }

  getStatusClass(vendor: VendorDto): string {
    if (!vendor.activeFlag) return 'status-inactive';
    if (vendor.preferredVendorStatus) return 'status-preferred';
    return 'status-active';
  }
} 