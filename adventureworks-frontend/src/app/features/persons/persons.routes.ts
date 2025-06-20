import { Routes } from '@angular/router';
import { PersonsListComponent } from './persons-list.component';
import { PersonDetailComponent } from './person-detail.component';
import { PersonFormComponent } from './person-form.component';

export const PERSONS_ROUTES: Routes = [
  {
    path: '',
    component: PersonsListComponent
  },
  {
    path: 'new',
    component: PersonFormComponent
  },
  {
    path: ':id',
    component: PersonDetailComponent
  },
  {
    path: ':id/edit',
    component: PersonFormComponent
  }
]; 