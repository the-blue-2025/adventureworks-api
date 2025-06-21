import { Routes } from '@angular/router';
import { VendorsListComponent } from './vendors-list.component';
import { VendorDetailComponent } from './vendor-detail.component';
import { VendorFormComponent } from './vendor-form.component';

export const VENDORS_ROUTES: Routes = [
  {
    path: '',
    component: VendorsListComponent
  },
  {
    path: 'new',
    component: VendorFormComponent
  },
  {
    path: ':id',
    component: VendorDetailComponent
  },
  {
    path: ':id/edit',
    component: VendorFormComponent
  }
]; 