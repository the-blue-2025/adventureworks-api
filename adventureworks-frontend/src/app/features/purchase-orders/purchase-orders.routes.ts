import { Routes } from '@angular/router';
import { PurchaseOrdersListComponent } from './purchase-orders-list.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { PurchaseOrderFormComponent } from './purchase-order-form.component';

export const PURCHASE_ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: PurchaseOrdersListComponent
  },
  {
    path: 'new',
    component: PurchaseOrderFormComponent
  },
  {
    path: ':id',
    component: PurchaseOrderDetailComponent
  },
  {
    path: ':id/edit',
    component: PurchaseOrderFormComponent
  }
]; 