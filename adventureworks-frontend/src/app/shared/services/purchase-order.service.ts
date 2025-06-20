import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSignalService } from './base-signal.service';
import { ApiService } from './api.service';
import { PurchaseOrderDto, CreatePurchaseOrderDto, UpdatePurchaseOrderDto } from '../models/purchase-order.dto';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService extends BaseSignalService<PurchaseOrderDto> {
  constructor(private apiService: ApiService) {
    super();
  }

  // Load all purchase orders
  loadPurchaseOrders(): Observable<PurchaseOrderDto[]> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDto[]>('/purchase-orders'),
      (orders) => this.setData(orders)
    );
  }

  // Get purchase order by ID
  getPurchaseOrderById(id: number): Observable<PurchaseOrderDto> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDto>(`/purchase-orders/${id}`),
      (order) => this.setSelectedItem(order)
    );
  }

  // Create new purchase order
  createPurchaseOrder(order: CreatePurchaseOrderDto): Observable<PurchaseOrderDto> {
    return this.handleObservable(
      this.apiService.post<PurchaseOrderDto>('/purchase-orders', order),
      (newOrder) => this.addItem(newOrder)
    );
  }

  // Update purchase order
  updatePurchaseOrder(id: number, order: UpdatePurchaseOrderDto): Observable<PurchaseOrderDto> {
    return this.handleObservable(
      this.apiService.put<PurchaseOrderDto>(`/purchase-orders/${id}`, order),
      (updatedOrder) => this.updateItem(updatedOrder, o => o.purchaseOrderId === id)
    );
  }

  // Delete purchase order
  deletePurchaseOrder(id: number): Observable<void> {
    return this.handleObservable(
      this.apiService.delete<void>(`/purchase-orders/${id}`),
      () => this.removeItem(o => o.purchaseOrderId === id)
    );
  }

  // Get purchase orders by vendor
  getPurchaseOrdersByVendor(vendorId: number): Observable<PurchaseOrderDto[]> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDto[]>(`/purchase-orders/vendor/${vendorId}`),
      (orders) => this.setData(orders)
    );
  }

  // Get purchase orders by status
  getPurchaseOrdersByStatus(status: number): Observable<PurchaseOrderDto[]> {
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDto[]>(`/purchase-orders/status/${status}`),
      (orders) => this.setData(orders)
    );
  }

  // Get purchase orders by date range
  getPurchaseOrdersByDateRange(startDate: Date, endDate: Date): Observable<PurchaseOrderDto[]> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    return this.handleObservable(
      this.apiService.get<PurchaseOrderDto[]>(`/purchase-orders/date-range?${params}`),
      (orders) => this.setData(orders)
    );
  }

  // Select a purchase order (for editing/viewing)
  selectPurchaseOrder(order: PurchaseOrderDto | null): void {
    this.setSelectedItem(order);
  }

  // Get order status text
  getOrderStatusText(order: PurchaseOrderDto): string {
    switch (order.status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Complete';
      default: return 'Unknown';
    }
  }

  // Get order status class for styling
  getOrderStatusClass(order: PurchaseOrderDto): string {
    switch (order.status) {
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 3: return 'status-rejected';
      case 4: return 'status-complete';
      default: return 'status-unknown';
    }
  }

  // Calculate total due
  calculateTotalDue(order: PurchaseOrderDto): number {
    return order.subTotal + order.taxAmt + order.freight;
  }
} 