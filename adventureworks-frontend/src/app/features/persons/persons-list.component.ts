import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../shared/services/person.service';
import { PersonDto } from '../../shared/models/person.dto';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Persons</h2>
          <a routerLink="new" class="btn btn-primary">Add New Person</a>
        </div>

        <!-- Search -->
        <div class="form-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Search persons..."
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
          >
        </div>

        <!-- Loading State -->
        @if (personService.loading()) {
          <div class="loading">Loading persons...</div>
        }

        <!-- Error State -->
        @if (personService.error()) {
          <div class="error">{{ personService.error() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Persons Table -->
        @if (personService.data().length > 0) {
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Email Promotion</th>
                <th>Modified Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (person of personService.data(); track person.businessEntityId) {
                <tr>
                  <td>{{ person.businessEntityId }}</td>
                  <td>{{ personService.getFullName(person) }}</td>
                  <td>{{ person.personType }}</td>
                  <td>{{ person.emailPromotion }}</td>
                  <td>{{ person.modifiedDate | date:'short' }}</td>
                  <td>
                    <a [routerLink]="['/persons', person.businessEntityId]" class="btn btn-secondary btn-sm">View</a>
                    <a [routerLink]="['/persons', person.businessEntityId, 'edit']" class="btn btn-primary btn-sm">Edit</a>
                    <button (click)="deletePerson(person)" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else if (!personService.loading()) {
          <div class="text-center py-4">
            <p>No persons found.</p>
          </div>
        }

        <!-- Person Type Filter -->
        <div class="mt-3">
          <label class="form-label">Filter by Person Type:</label>
          <select class="form-control" [(ngModel)]="selectedPersonType" (change)="onPersonTypeChange()">
            <option value="">All Types</option>
            <option value="EM">Employee</option>
            <option value="SP">Sales Person</option>
            <option value="SC">Store Contact</option>
            <option value="VC">Vendor Contact</option>
            <option value="GC">General Contact</option>
            <option value="IN">Individual</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .d-flex {
      display: flex;
    }
    
    .justify-content-between {
      justify-content: space-between;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .mb-3 {
      margin-bottom: 1rem;
    }
    
    .mt-3 {
      margin-top: 1rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }
    
    .text-center {
      text-align: center;
    }
    
    .py-4 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }
  `]
})
export class PersonsListComponent implements OnInit {
  personService = inject(PersonService);
  
  searchQuery = '';
  selectedPersonType = '';
  successMessage = '';

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.personService.loadPersons().subscribe();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.personService.searchPersons(this.searchQuery).subscribe();
    } else {
      this.loadPersons();
    }
  }

  onPersonTypeChange() {
    if (this.selectedPersonType) {
      this.personService.getPersonsByType(this.selectedPersonType).subscribe();
    } else {
      this.loadPersons();
    }
  }

  deletePerson(person: PersonDto) {
    if (confirm(`Are you sure you want to delete ${this.personService.getFullName(person)}?`)) {
      this.personService.deletePerson(person.businessEntityId).subscribe(() => {
        this.successMessage = 'Person deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      });
    }
  }
} 