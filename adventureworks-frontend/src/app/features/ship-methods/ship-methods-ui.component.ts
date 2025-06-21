import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipMethodDto, UpdateShipMethodDto } from '../../shared/models/ship-method.dto';

@Component({
  selector: 'app-ship-methods-ui',
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
            (click)="addNewShipMethod.emit()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add New Ship Method
          </button>
        </div>

        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-200 flex gap-4">
          <input 
            type="text" 
            placeholder="Search ship methods..."
            [value]="searchQuery"
            (input)="onSearchInput($event)"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            (click)="clearSearch.emit()"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Clear
          </button>
          <button 
            (click)="reload.emit()"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Reload
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading ship methods...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="hasError" class="p-6 text-center">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800">{{ error }}</p>
            <button 
              (click)="reload.emit()"
              class="mt-2 text-red-600 hover:text-red-800 underline">
              Try again
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div *ngIf="!isLoading && !hasError" class="overflow-x-auto">
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
                *ngFor="let method of shipMethods; trackBy: trackByShipMethodId"
                class="hover:bg-gray-50 transition-colors"
                [class.bg-blue-50]="editingId === method.shipMethodId">
                <!-- ID Column (read-only) -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ method.shipMethodId }}
                </td>
                <!-- Name Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="startEdit.emit({ method, field: 'name' })">
                    {{ method.name }}
                  </span>
                  <input *ngIf="editingId === method.shipMethodId && editingField === 'name'"
                    type="text"
                    [value]="editingData.name"
                    (input)="onEditingDataChange('name', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="saveChanges.emit(method.shipMethodId)"
                    (keyup.escape)="cancelEdit.emit()"
                    (blur)="saveChanges.emit(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Ship Base Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="startEdit.emit({ method, field: 'shipBase' })">
                    {{ method.shipBase | number:'1.2-2' }}
                  </span>
                  <input *ngIf="editingId === method.shipMethodId && editingField === 'shipBase'"
                    type="number"
                    step="0.01"
                    [value]="editingData.shipBase"
                    (input)="onEditingDataChange('shipBase', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="saveChanges.emit(method.shipMethodId)"
                    (keyup.escape)="cancelEdit.emit()"
                    (blur)="saveChanges.emit(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Ship Rate Column -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span *ngIf="editingId !== method.shipMethodId" class="text-sm text-gray-900 cursor-pointer" (dblclick)="startEdit.emit({ method, field: 'shipRate' })">
                    {{ method.shipRate | number:'1.2-2' }}
                  </span>
                  <input *ngIf="editingId === method.shipMethodId && editingField === 'shipRate'"
                    type="number"
                    step="0.01"
                    [value]="editingData.shipRate"
                    (input)="onEditingDataChange('shipRate', $event)"
                    class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    (keyup.enter)="saveChanges.emit(method.shipMethodId)"
                    (keyup.escape)="cancelEdit.emit()"
                    (blur)="saveChanges.emit(method.shipMethodId)"
                    autofocus>
                </td>
                <!-- Actions Column -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button (click)="deleteShipMethod.emit(method.shipMethodId)" class="text-red-600 hover:text-red-900">Delete</button>
                  <ng-container *ngIf="editingId === method.shipMethodId">
                    <button (click)="saveChanges.emit(method.shipMethodId)" class="ml-2 text-green-600 hover:text-green-900">Save</button>
                    <button (click)="cancelEdit.emit()" class="ml-2 text-gray-600 hover:text-gray-900">Cancel</button>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="shipMethods.length === 0 && !isLoading" class="text-center py-8">
          <div class="text-gray-400 text-6xl mb-4">🚢</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No ship methods found</h3>
          <p class="text-gray-600 mb-4">Get started by adding your first ship method.</p>
          <button 
            (click)="addNewShipMethod.emit()"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Ship Method
          </button>
        </div>

        <!-- Stats Footer -->
        <div class="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
          <span>Total: {{ totalCount }} ship methods</span>
          <span>Status: {{ isLoading ? 'Loading...' : 'Ready' }}</span>
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
export class ShipMethodsUiComponent {
  // Inputs - Data from Smart component
  @Input() shipMethods: ShipMethodDto[] = [];
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() error: string | null = null;
  @Input() searchQuery = '';
  @Input() editingId: number | null = null;
  @Input() editingField: string | null = null;
  @Input() editingData: UpdateShipMethodDto = {};
  @Input() totalCount = 0;

  // Outputs - Events to Smart component
  @Output() searchChange = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() reload = new EventEmitter<void>();
  @Output() startEdit = new EventEmitter<{ method: ShipMethodDto; field: string }>();
  @Output() editingDataChange = new EventEmitter<{ field: string; value: any }>();
  @Output() saveChanges = new EventEmitter<number>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() deleteShipMethod = new EventEmitter<number>();
  @Output() addNewShipMethod = new EventEmitter<void>();

  trackByShipMethodId(index: number, method: ShipMethodDto): number {
    return method.shipMethodId;
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onEditingDataChange(field: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = field === 'shipBase' || field === 'shipRate' ? parseFloat(target.value) : target.value;
    this.editingDataChange.emit({ field, value });
  }
} 