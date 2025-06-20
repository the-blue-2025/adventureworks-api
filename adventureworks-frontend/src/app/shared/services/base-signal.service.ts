import { Injectable, signal, computed, effect, untracked } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';

export interface SignalState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;
  filters: Record<string, any>;
  searchQuery: string;
}

@Injectable()
export abstract class BaseSignalService<T> {
  // Core signals
  private stateSignal = signal<SignalState<T>>({
    data: [],
    loading: false,
    error: null,
    selectedItem: null,
    filters: {},
    searchQuery: ''
  });

  // Computed signals for reactive state
  public data = computed(() => this.stateSignal().data);
  public loading = computed(() => this.stateSignal().loading);
  public error = computed(() => this.stateSignal().error);
  public selectedItem = computed(() => this.stateSignal().selectedItem);
  public filters = computed(() => this.stateSignal().filters);
  public searchQuery = computed(() => this.stateSignal().searchQuery);

  // Advanced computed signals
  public isEmpty = computed(() => this.data().length === 0);
  public count = computed(() => this.data().length);
  public hasError = computed(() => this.error() !== null);
  public isLoading = computed(() => this.loading() === true);
  public hasSelectedItem = computed(() => this.selectedItem() !== null);

  // Filtered data computed signal
  public filteredData = computed(() => {
    const data = this.data();
    const filters = this.filters();
    const searchQuery = this.searchQuery();
    
    let filtered = data;
    
    // Apply search filter if query exists
    if (searchQuery && searchQuery.trim()) {
      filtered = this.applySearchFilter(filtered, searchQuery);
    }
    
    // Apply custom filters
    if (Object.keys(filters).length > 0) {
      filtered = this.applyCustomFilters(filtered, filters);
    }
    
    return filtered;
  });

  // Computed signals for filtered data
  public filteredCount = computed(() => this.filteredData().length);
  public filteredIsEmpty = computed(() => this.filteredData().length === 0);

  // Effects for automatic side effects
  constructor() {
    // Effect to log state changes in development
    effect(() => {
      const state = this.stateSignal();
      if (state.error) {
        console.warn('Service error:', state.error);
      }
    });

    // Effect to handle loading state changes
    effect(() => {
      const loading = this.loading();
      if (loading) {
        // Could trigger loading indicators or other side effects
        console.log('Loading started');
      }
    });
  }

  // State management methods
  protected updateState(updates: Partial<SignalState<T>>): void {
    this.stateSignal.update(current => ({ ...current, ...updates }));
  }

  protected setLoading(loading: boolean): void {
    this.updateState({ loading, error: null });
  }

  protected setError(error: string): void {
    this.updateState({ loading: false, error });
  }

  protected setData(data: T[]): void {
    this.updateState({ data, loading: false, error: null });
  }

  protected addItem(item: T): void {
    this.updateState({ 
      data: [...this.data(), item],
      loading: false,
      error: null
    });
  }

  protected updateItem(updatedItem: T, predicate: (item: T) => boolean): void {
    this.updateState({
      data: this.data().map(item => predicate(item) ? updatedItem : item),
      loading: false,
      error: null
    });
  }

  protected removeItem(predicate: (item: T) => boolean): void {
    this.updateState({
      data: this.data().filter(item => !predicate(item)),
      loading: false,
      error: null
    });
  }

  protected setSelectedItem(item: T | null): void {
    this.updateState({ selectedItem: item });
  }

  // Filter management methods
  public setFilter(key: string, value: any): void {
    this.updateState({
      filters: { ...this.filters(), [key]: value }
    });
  }

  public clearFilter(key: string): void {
    const currentFilters = this.filters();
    const { [key]: removed, ...remainingFilters } = currentFilters;
    this.updateState({ filters: remainingFilters });
  }

  public clearAllFilters(): void {
    this.updateState({ filters: {} });
  }

  public setSearchQuery(query: string): void {
    this.updateState({ searchQuery: query });
  }

  public clearSearch(): void {
    this.updateState({ searchQuery: '' });
  }

  // Observable handling with signal integration
  protected handleObservable<TResult>(
    observable: Observable<TResult>,
    onSuccess?: (result: TResult) => void
  ): Observable<TResult> {
    this.setLoading(true);
    
    return observable.pipe(
      tap(result => {
        this.setLoading(false);
        onSuccess?.(result);
      }),
      catchError(error => {
        this.setError(error.message || 'An error occurred');
        return of(error);
      })
    );
  }

  // Utility methods
  public clearError(): void {
    this.updateState({ error: null });
  }

  public reset(): void {
    this.stateSignal.set({
      data: [],
      loading: false,
      error: null,
      selectedItem: null,
      filters: {},
      searchQuery: ''
    });
  }

  public resetFilters(): void {
    this.updateState({ filters: {}, searchQuery: '' });
  }

  // Abstract methods for subclasses to implement
  protected applySearchFilter(data: T[], query: string): T[] {
    // Default implementation - subclasses should override
    return data;
  }

  protected applyCustomFilters(data: T[], filters: Record<string, any>): T[] {
    // Default implementation - subclasses should override
    return data;
  }

  // Signal-based utility methods
  public getSignalState() {
    return this.stateSignal();
  }

  public updateSignalState(updater: (state: SignalState<T>) => SignalState<T>): void {
    this.stateSignal.update(updater);
  }
} 