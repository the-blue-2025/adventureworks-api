import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../shared/services/vendor.service';
import { VendorDto } from '../../shared/models/vendor.dto';

@Component({
  selector: 'app-vendors-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Vendors</h2>
          <a routerLink="new" class="btn btn-primary">Add New Vendor</a>
        </div>

        <!-- Search -->
        <div class="form-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search vendors..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
        </div>

        <!-- Filter -->
        <div class="form-group mt-2">
          <label class="form-label">Filter by Status:</label>
          <select class="form-control" [(ngModel)]="selectedFilter" (change)="onFilterChange()">
            <option value="all">All Vendors</option>
            <option value="active">Active Only</option>
            <option value="preferred">Preferred Only</option>
          </select>
        </div>

        <!-- Loading State -->
        @if (vendorService.isLoading()) {
          <div class="loading">Loading vendors...</div>
        }

        <!-- Error State -->
        @if (vendorService.error()) {
          <div class="error">{{ vendorService.error() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Vendors Table -->
        @if (vendorService.vendors().length > 0) {
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Account Number</th>
                  <th>Status</th>
                  <th>Credit Rating</th>
                  <th>Modified Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (vendor of vendorService.vendors(); track vendor.businessEntityId) {
                  <tr>
                    <td>{{ vendor.businessEntityId }}</td>
                    <td 
                      class="vendor-name" 
                      (dblclick)="viewVendorDetail(vendor.businessEntityId)"
                      title="Double-click to view details">
                      {{ vendor.name }}
                    </td>
                    <td>{{ vendor.accountNumber }}</td>
                    <td>
                      <span [class]="getStatusClass(vendor)">
                        {{ vendorService.getVendorStatus(vendor) }}
                      </span>
                    </td>
                    <td>{{ vendorService.getCreditRatingText(vendor) }}</td>
                    <td>{{ vendor.modifiedDate | date:'short' }}</td>
                    <td>
                      <a [routerLink]="['/vendors', vendor.businessEntityId]" class="btn btn-secondary btn-sm">View</a>
                      <a [routerLink]="['/vendors', vendor.businessEntityId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
                      <button (click)="deleteVendor(vendor)" class="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else if (!vendorService.isLoading()) {
          <div class="text-center py-4">
            <p>No vendors found.</p>
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
    
    .mt-2 {
      margin-top: 0.5rem;
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
  `]
})
export class VendorsListComponent implements OnInit {
  vendorService = inject(VendorService);
  router = inject(Router);
  
  searchQuery = '';
  selectedFilter: 'all' | 'active' | 'preferred' = 'all';
  successMessage = '';

  ngOnInit() {
    // Trigger initial load of vendors
    this.vendorService.reload();
  }

  loadVendors() {
    // Clear search and filters to load all vendors
    this.vendorService.setSearchQuery('');
    this.vendorService.setFilterType('all');
  }

  onSearch() {
    this.vendorService.setSearchQuery(this.searchQuery);
  }

  onFilterChange() {
    this.vendorService.setFilterType(this.selectedFilter);
  }

  viewVendorDetail(vendorId: number) {
    this.router.navigate(['/vendors', vendorId]);
  }

  async deleteVendor(vendor: VendorDto) {
    if (confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      try {
        await this.vendorService.deleteVendor(vendor.businessEntityId);
        this.successMessage = 'Vendor deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error) {
        console.error('Failed to delete vendor:', error);
        this.successMessage = 'Error deleting vendor. Please try again.';
      }
    }
  }

  getStatusClass(vendor: VendorDto): string {
    if (!vendor.activeFlag) return 'status-inactive';
    if (vendor.preferredVendorStatus) return 'status-preferred';
    return 'status-active';
  }
} 