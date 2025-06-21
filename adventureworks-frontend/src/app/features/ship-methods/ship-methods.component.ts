import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipMethodService } from '../../shared/services/ship-method.service';
import { ShipMethodDto, UpdateShipMethodDto } from '../../shared/models/ship-method.dto';

@Component({
  selector: 'app-ship-methods',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="flex justify-between items-center bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Ship Methods</h2>
            <p class="text-sm text-gray-600 mt-1">Resource API with modern state management</p>
          </div>
          <button 
            (click)="onAddNewShipMethod()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add New Ship Method
          </button>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-200 flex gap-4">
          <input 
            type="text" 
            placeholder="Search ship methods..."
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            (click)="onClearSearch()"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Clear
          </button>
          <button 
            (click)="onReload()"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Reload
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading()" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading ship methods...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="hasError()" class="p-6 text-center">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800">{{ error() }}</p>
            <button 
              (click)="onReload()"
              class="mt-2 text-red-600 hover:text-red-800 underline">
              Try again
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div *ngIf="!isLoading() && !hasError()" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ship Base</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ship Rate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                *ngFor="let method of shipMethods(); trackBy: trackByShipMethodId"
                class="hover:bg-gray-50 transition-colors"
                [class.bg-blue-50]="editingId() === method.shipMethodId">
                <!-- ID Column (read-only) -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ method.shipMethodId }}
                </td>
                <!-- Name Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId() !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="onStartEdit({ method, field: 'name' })">
                    {{ method.name }}
                  </span>
                  <input *ngIf="editingId() === method.shipMethodId && editingField() === 'name'"
                    type="text"
                    [value]="editingData().name"
                    (input)="onEditingDataChange('name', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="onSaveChanges(method.shipMethodId)"
                    (keyup.escape)="onCancelEdit()"
                    (blur)="onSaveChanges(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Ship Base Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId() !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="onStartEdit({ method, field: 'shipBase' })">
                    {{ method.shipBase | number:'1.2-2' }}
                  </span>
                  <input *ngIf="editingId() === method.shipMethodId && editingField() === 'shipBase'"
                    type="number"
                    step="0.01"
                    [value]="editingData().shipBase"
                    (input)="onEditingDataChange('shipBase', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="onSaveChanges(method.shipMethodId)"
                    (keyup.escape)="onCancelEdit()"
                    (blur)="onSaveChanges(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Ship Rate Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId() !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="onStartEdit({ method, field: 'shipRate' })">
                    {{ method.shipRate | number:'1.2-2' }}
                  </span>
                  <input *ngIf="editingId() === method.shipMethodId && editingField() === 'shipRate'"
                    type="number"
                    step="0.01"
                    [value]="editingData().shipRate"
                    (input)="onEditingDataChange('shipRate', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="onSaveChanges(method.shipMethodId)"
                    (keyup.escape)="onCancelEdit()"
                    (blur)="onSaveChanges(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="onDeleteShipMethod(method.shipMethodId)" class="text-red-600 hover:text-red-900">Delete</button>
                  <ng-container *ngIf="editingId() === method.shipMethodId">
                    <button (click)="onSaveChanges(method.shipMethodId)" class="ml-2 text-green-600 hover:text-green-900">Save</button>
                    <button (click)="onCancelEdit()" class="ml-2 text-gray-600 hover:text-gray-900">Cancel</button>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="shipMethods().length === 0 && !isLoading()" class="text-center py-8">
          <div class="text-gray-400 text-6xl mb-4">🚢</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No ship methods found</h3>
          <p class="text-gray-600 mb-4">Get started by adding your first ship method.</p>
          <button 
            (click)="onAddNewShipMethod()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Ship Method
          </button>
        </div>

        <!-- Stats Footer -->
        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
          <span>Total: {{ totalCount() }} ship methods</span>
          <span>Status: {{ isLoading() ? 'Loading...' : 'Ready' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cursor-pointer {
      cursor: pointer;
    }
    .hover\\:bg-yellow-100:hover {
      background-color: #fef3c7;
    }
  `]
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

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onSearchChange(target.value);
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

  onEditingDataChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = field === 'shipBase' || field === 'shipRate' ? parseFloat(target.value) : target.value;
    this.editingDataSignal.update(data => ({
      ...data,
      [field]: value
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

  trackByShipMethodId(index: number, method: ShipMethodDto): number {
    return method.shipMethodId;
  }
} 