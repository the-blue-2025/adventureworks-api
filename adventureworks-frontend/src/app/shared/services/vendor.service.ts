import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSignalService } from './base-signal.service';
import { ApiService } from './api.service';
import { VendorDto, CreateVendorDto, UpdateVendorDto } from '../models/vendor.dto';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends BaseSignalService<VendorDto> {
  constructor(private apiService: ApiService) {
    super();
  }

  // Load all vendors
  loadVendors(): Observable<VendorDto[]> {
    return this.handleObservable(
      this.apiService.get<VendorDto[]>('/vendors'),
      (vendors) => this.setData(vendors)
    );
  }

  // Get vendor by ID
  getVendorById(id: number): Observable<VendorDto> {
    return this.handleObservable(
      this.apiService.get<VendorDto>(`/vendors/${id}`),
      (vendor) => this.setSelectedItem(vendor)
    );
  }

  // Create new vendor
  createVendor(vendor: CreateVendorDto): Observable<VendorDto> {
    return this.handleObservable(
      this.apiService.post<VendorDto>('/vendors', vendor),
      (newVendor) => this.addItem(newVendor)
    );
  }

  // Update vendor
  updateVendor(id: number, vendor: UpdateVendorDto): Observable<VendorDto> {
    return this.handleObservable(
      this.apiService.put<VendorDto>(`/vendors/${id}`, vendor),
      (updatedVendor) => this.updateItem(updatedVendor, v => v.businessEntityId === id)
    );
  }

  // Delete vendor
  deleteVendor(id: number): Observable<void> {
    return this.handleObservable(
      this.apiService.delete<void>(`/vendors/${id}`),
      () => this.removeItem(v => v.businessEntityId === id)
    );
  }

  // Search vendors by name
  searchVendors(query: string): Observable<VendorDto[]> {
    return this.handleObservable(
      this.apiService.get<VendorDto[]>(`/vendors/search?q=${query}`),
      (vendors) => this.setData(vendors)
    );
  }

  // Get active vendors
  getActiveVendors(): Observable<VendorDto[]> {
    return this.handleObservable(
      this.apiService.get<VendorDto[]>('/vendors/active'),
      (vendors) => this.setData(vendors)
    );
  }

  // Get preferred vendors
  getPreferredVendors(): Observable<VendorDto[]> {
    return this.handleObservable(
      this.apiService.get<VendorDto[]>('/vendors/preferred'),
      (vendors) => this.setData(vendors)
    );
  }

  // Select a vendor (for editing/viewing)
  selectVendor(vendor: VendorDto | null): void {
    this.setSelectedItem(vendor);
  }

  // Get vendor status text
  getVendorStatus(vendor: VendorDto): string {
    if (!vendor.activeFlag) return 'Inactive';
    if (vendor.preferredVendorStatus) return 'Preferred';
    return 'Active';
  }

  // Get credit rating text
  getCreditRatingText(vendor: VendorDto): string {
    switch (vendor.creditRating) {
      case 1: return 'Superior';
      case 2: return 'Excellent';
      case 3: return 'Above Average';
      case 4: return 'Average';
      case 5: return 'Below Average';
      default: return 'Unknown';
    }
  }
} 