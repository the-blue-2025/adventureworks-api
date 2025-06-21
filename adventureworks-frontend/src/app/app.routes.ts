import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/persons',
    pathMatch: 'full'
  },
  {
    path: 'persons',
    loadChildren: () => import('./features/persons/persons.routes').then(m => m.PERSONS_ROUTES)
  },
  {
    path: 'purchase-orders',
    loadChildren: () => import('./features/purchase-orders/purchase-orders.routes').then(m => m.PURCHASE_ORDERS_ROUTES)
  },
  {
    path: 'ship-methods',
    loadChildren: () => import('./features/ship-methods/ship-methods.routes').then(m => m.SHIP_METHODS_ROUTES)
  },
  {
    path: 'vendors',
    loadChildren: () => import('./features/vendors/vendors.routes').then(m => m.VENDORS_ROUTES)
  }
]; 