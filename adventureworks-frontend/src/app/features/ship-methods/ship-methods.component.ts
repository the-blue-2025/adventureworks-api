import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipMethodService } from '../../shared/services/ship-method.service';
import { ShipMethodDto, UpdateShipMethodDto } from '../../shared/models/ship-method.dto';
import { ShipMethodsUiComponent } from './ship-methods-ui.component';

@Component({
  selector: 'app-ship-methods',
  standalone: true,
  imports: [CommonModule, ShipMethodsUiComponent],
  template: `
    <app-ship-methods-ui
      [shipMethods]="shipMethods()"
      [isLoading]="isLoading()"
      [hasError]="hasError()"
      [error]="error()"
      [searchQuery]="searchQuery()"
      [editingId]="editingId()"
      [editingField]="editingField()"
      [editingData]="editingData()"
      [totalCount]="totalCount()"
      (searchChange)="onSearchChange($event)"
      (clearSearch)="onClearSearch()"
      (reload)="onReload()"
      (startEdit)="onStartEdit($event)"
      (editingDataChange)="onEditingDataChange($event)"
      (saveChanges)="onSaveChanges($event)"
      (cancelEdit)="onCancelEdit()"
      (deleteShipMethod)="onDeleteShipMethod($event)"
      (addNewShipMethod)="onAddNewShipMethod()">
    </app-ship-methods-ui>
  `
})
export class ShipMethodsComponent implements OnInit {
  private shipMethodService = inject(ShipMethodService);

  // Local state for editing
  private editingIdSignal = signal<number | null>(null);
  private editingFieldSignal = signal<string | null>(null);
  private editingDataSignal = signal<UpdateShipMethodDto>({});

  // Computed values for the UI
  public shipMethods = computed(() => this.shipMethodService.shipMethods());
  public isLoading = computed(() => this.shipMethodService.isLoading());
  public hasError = computed(() => this.shipMethodService.hasError());
  public error = computed(() => this.shipMethodService.error());
  public searchQuery = computed(() => this.shipMethodService.searchQuery());
  public editingId = computed(() => this.editingIdSignal());
  public editingField = computed(() => this.editingFieldSignal());
  public editingData = computed(() => this.editingDataSignal());
  public totalCount = computed(() => this.shipMethods().length);

  ngOnInit(): void {
    this.shipMethodService.reload();
  }

  // Event handlers - Smart component logic
  onSearchChange(query: string): void {
    this.shipMethodService.setSearchQuery(query);
  }

  onClearSearch(): void {
    this.shipMethodService.clearSearch();
  }

  onReload(): void {
    this.shipMethodService.reload();
  }

  onStartEdit(payload: { method: ShipMethodDto; field: string }): void {
    this.editingIdSignal.set(payload.method.shipMethodId);
    this.editingFieldSignal.set(payload.field);
    this.editingDataSignal.set({
      name: payload.method.name,
      shipBase: payload.method.shipBase,
      shipRate: payload.method.shipRate
    });
  }

  onEditingDataChange(payload: { field: string; value: any }): void {
    this.editingDataSignal.update(data => ({
      ...data,
      [payload.field]: payload.value
    }));
  }

  async onSaveChanges(shipMethodId: number): Promise<void> {
    const editingId = this.editingIdSignal();
    const editingData = this.editingDataSignal();

    if (editingId === shipMethodId && editingData) {
      try {
        await this.shipMethodService.updateShipMethod(shipMethodId, editingData);
        this.onCancelEdit();
      } catch (error) {
        console.error('Error updating ship method:', error);
      }
    }
  }

  onCancelEdit(): void {
    this.editingIdSignal.set(null);
    this.editingFieldSignal.set(null);
    this.editingDataSignal.set({});
  }

  async onDeleteShipMethod(shipMethodId: number): Promise<void> {
    if (confirm('Are you sure you want to delete this ship method?')) {
      try {
        await this.shipMethodService.deleteShipMethod(shipMethodId);
      } catch (error) {
        console.error('Failed to delete ship method:', error);
      }
    }
  }

  onAddNewShipMethod(): void {
    // This would typically navigate to a form or open a modal
    alert('Add new ship method functionality would go here');
  }
} 