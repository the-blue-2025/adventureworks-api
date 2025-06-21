import { Component, OnInit, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VendorService } from '../../shared/services/vendor.service';
import { VendorDto, CreateVendorDto, UpdateVendorDto } from '../../shared/models/vendor.dto';

@Component({
  selector: 'app-vendor-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>{{ isEditMode ? 'Edit Vendor' : 'Add New Vendor' }}</h2>
          <a routerLink="/vendors" class="btn btn-secondary">Back to List</a>
        </div>

        <!-- Loading State -->
        @if (vendorService.isLoading()) {
          <div class="loading">Loading vendor...</div>
        }

        <!-- Error State -->
        @if (vendorService.error()) {
          <div class="error">{{ vendorService.error() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #vendorForm="ngForm">
          <div class="row">
            <div class="col-md-6">
              <h3>Basic Information</h3>
              
              <div class="form-group mb-3">
                <label for="name" class="form-label">Name *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  class="form-control" 
                  [(ngModel)]="vendorData.name"
                  required
                  #name="ngModel">
                @if (name.invalid && (name.dirty || name.touched)) {
                  <div class="text-danger">
                    @if (name.errors?.['required']) {
                      <small>Name is required.</small>
                    }
                  </div>
                }
              </div>

              <div class="form-group mb-3">
                <label for="accountNumber" class="form-label">Account Number *</label>
                <input 
                  type="text" 
                  id="accountNumber"
                  name="accountNumber"
                  class="form-control" 
                  [(ngModel)]="vendorData.accountNumber"
                  required
                  #accountNumber="ngModel">
                @if (accountNumber.invalid && (accountNumber.dirty || accountNumber.touched)) {
                  <div class="text-danger">
                    @if (accountNumber.errors?.['required']) {
                      <small>Account number is required.</small>
                    }
                  </div>
                }
              </div>

              <div class="form-group mb-3">
                <label for="creditRating" class="form-label">Credit Rating *</label>
                <select 
                  id="creditRating"
                  name="creditRating"
                  class="form-control" 
                  [(ngModel)]="vendorData.creditRating"
                  required
                  #creditRating="ngModel">
                  <option value="">Select Credit Rating</option>
                  <option value="1">1 - Superior</option>
                  <option value="2">2 - Excellent</option>
                  <option value="3">3 - Above Average</option>
                  <option value="4">4 - Average</option>
                  <option value="5">5 - Below Average</option>
                </select>
                @if (creditRating.invalid && (creditRating.dirty || creditRating.touched)) {
                  <div class="text-danger">
                    @if (creditRating.errors?.['required']) {
                      <small>Credit rating is required.</small>
                    }
                  </div>
                }
              </div>
            </div>

            <div class="col-md-6">
              <h3>Status & Settings</h3>
              
              <div class="form-group mb-3">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    id="activeFlag"
                    name="activeFlag"
                    class="form-check-input" 
                    [(ngModel)]="vendorData.activeFlag">
                  <label for="activeFlag" class="form-check-label">Active Vendor</label>
                </div>
              </div>

              <div class="form-group mb-3">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    id="preferredVendorStatus"
                    name="preferredVendorStatus"
                    class="form-check-input" 
                    [(ngModel)]="vendorData.preferredVendorStatus">
                  <label for="preferredVendorStatus" class="form-check-label">Preferred Vendor</label>
                </div>
              </div>

              <div class="form-group mb-3">
                <label for="purchasingWebServiceURL" class="form-label">Web Service URL</label>
                <input 
                  type="url" 
                  id="purchasingWebServiceURL"
                  name="purchasingWebServiceURL"
                  class="form-control" 
                  [(ngModel)]="vendorData.purchasingWebServiceURL"
                  placeholder="https://example.com/api">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary" 
              [disabled]="vendorForm.invalid || vendorService.isLoading()">
              {{ isEditMode ? 'Update Vendor' : 'Create Vendor' }}
            </button>
            <a routerLink="/vendors" class="btn btn-secondary ms-2">Cancel</a>
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
    
    .ms-2 {
      margin-left: 0.5rem;
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
    
    .vendor-details h3 {
      margin-bottom: 1rem;
      color: #495057;
    }

    .form-actions {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
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
export class VendorFormComponent implements OnInit {
  vendorService = inject(VendorService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  vendorId = 0;
  isEditMode = false;
  vendorData: CreateVendorDto | UpdateVendorDto = {
    name: '',
    accountNumber: '',
    creditRating: 0,
    activeFlag: true,
    preferredVendorStatus: false,
    purchasingWebServiceURL: ''
  };
  successMessage = '';

  constructor() {
    // Effect to watch for changes in the selected vendor and populate the form
    effect(() => {
      const vendor = this.vendorService.selectedVendor();
      if (vendor && this.isEditMode) {
        this.populateForm(vendor);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.vendorId = +params['id'];
        this.isEditMode = true;
        this.loadVendor();
      }
    });
  }

  loadVendor() {
    this.vendorService.selectVendor(this.vendorId);
  }

  private populateForm(vendor: VendorDto) {
    this.vendorData = {
      name: vendor.name,
      accountNumber: vendor.accountNumber,
      creditRating: vendor.creditRating,
      activeFlag: vendor.activeFlag,
      preferredVendorStatus: vendor.preferredVendorStatus,
      purchasingWebServiceURL: vendor.purchasingWebServiceURL || ''
    };
  }

  async onSubmit() {
    if (this.isEditMode) {
      await this.updateVendor();
    } else {
      await this.createVendor();
    }
  }

  async createVendor() {
    try {
      const newVendor = await this.vendorService.createVendor(this.vendorData as CreateVendorDto);
      this.successMessage = 'Vendor created successfully!';
      setTimeout(() => {
        this.router.navigate(['/vendors', newVendor.businessEntityId]);
      }, 1500);
    } catch (error) {
      console.error('Failed to create vendor:', error);
      this.successMessage = 'Error creating vendor. Please try again.';
    }
  }

  async updateVendor() {
    try {
      await this.vendorService.updateVendor(this.vendorId, this.vendorData as UpdateVendorDto);
      this.successMessage = 'Vendor updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/vendors', this.vendorId]);
      }, 1500);
    } catch (error) {
      console.error('Failed to update vendor:', error);
      this.successMessage = 'Error updating vendor. Please try again.';
    }
  }
} 