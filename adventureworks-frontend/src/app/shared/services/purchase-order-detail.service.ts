import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSignalService } from './base-signal.service';
import { ApiService } from './api.service';
import { PurchaseOrderDetailDto, CreatePurchaseOrderDetailDto, UpdatePurchaseOrderDetailDto } from '../models/purchase-order-detail.dto';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderDetailService extends BaseSignalService<PurchaseOrderDetailDto> {
  constructor(private apiService: ApiService) {
    super();
  }

  // Load all purchase order details
  loadPurchaseOrderDetails(): Observable<PurchaseOrderDetailDto[]> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDetailDto[]>('/purchase-order-details'),
      (details) => this.setData(details)
    );
  }

  // Get purchase order detail by ID
  getPurchaseOrderDetailById(id: number): Observable<PurchaseOrderDetailDto> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDetailDto>(`/purchase-order-details/${id}`),
      (detail) => this.setSelectedItem(detail)
    );
  }

  // Create new purchase order detail
  createPurchaseOrderDetail(detail: CreatePurchaseOrderDetailDto): Observable<PurchaseOrderDetailDto> {
    return this.handleObservable(
      this.apiService.post<PurchaseOrderDetailDto>('/purchase-order-details', detail),
      (newDetail) => this.addItem(newDetail)
    );
  }

  // Update purchase order detail
  updatePurchaseOrderDetail(id: number, detail: UpdatePurchaseOrderDetailDto): Observable<PurchaseOrderDetailDto> {
    return this.handleObservable(
      this.apiService.put<PurchaseOrderDetailDto>(`/purchase-order-details/${id}`, detail),
      (updatedDetail) => this.updateItem(updatedDetail, d => d.purchaseOrderDetailId === id)
    );
  }

  // Delete purchase order detail
  deletePurchaseOrderDetail(id: number): Observable<void> {
    return this.handleObservable(
      this.apiService.delete<void>(`/purchase-order-details/${id}`),
      () => this.removeItem(d => d.purchaseOrderDetailId === id)
    );
  }

  // Select a purchase order detail (for editing/viewing)
  selectPurchaseOrderDetail(detail: PurchaseOrderDetailDto | null): void {
    this.setSelectedItem(detail);
  }
} 