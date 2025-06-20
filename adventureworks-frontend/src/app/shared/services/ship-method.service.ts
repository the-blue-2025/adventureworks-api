import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSignalService } from './base-signal.service';
import { ApiService } from './api.service';
import { ShipMethodDto, CreateShipMethodDto, UpdateShipMethodDto } from '../models/ship-method.dto';

@Injectable({
  providedIn: 'root'
})
export class ShipMethodService extends BaseSignalService<ShipMethodDto> {
  constructor(private apiService: ApiService) {
    super();
  }

  // Load all ship methods
  loadShipMethods(): Observable<ShipMethodDto[]> {
    return this.handleObservable(
      this.apiService.get<ShipMethodDto[]>('/ship-methods'),
      (methods) => this.setData(methods)
    );
  }

  // Get ship method by ID
  getShipMethodById(id: number): Observable<ShipMethodDto> {
    return this.handleObservable(
      this.apiService.get<ShipMethodDto>(`/ship-methods/${id}`),
      (method) => this.setSelectedItem(method)
    );
  }

  // Create new ship method
  createShipMethod(method: CreateShipMethodDto): Observable<ShipMethodDto> {
    return this.handleObservable(
      this.apiService.post<ShipMethodDto>('/ship-methods', method),
      (newMethod) => this.addItem(newMethod)
    );
  }

  // Update ship method
  updateShipMethod(id: number, method: UpdateShipMethodDto): Observable<ShipMethodDto> {
    return this.handleObservable(
      this.apiService.put<ShipMethodDto>(`/ship-methods/${id}`, method),
      (updatedMethod) => this.updateItem(updatedMethod, m => m.shipMethodId === id)
    );
  }

  // Delete ship method
  deleteShipMethod(id: number): Observable<void> {
    return this.handleObservable(
      this.apiService.delete<void>(`/ship-methods/${id}`),
      () => this.removeItem(m => m.shipMethodId === id)
    );
  }

  // Select a ship method (for editing/viewing)
  selectShipMethod(method: ShipMethodDto | null): void {
    this.setSelectedItem(method);
  }
} 