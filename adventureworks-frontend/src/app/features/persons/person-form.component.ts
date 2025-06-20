import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../shared/services/person.service';
import { PersonDto, CreatePersonDto, UpdatePersonDto } from '../../shared/models/person.dto';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>{{ isEditMode ? 'Edit Person' : 'Add New Person' }}</h2>
          <a routerLink="/persons" class="btn btn-secondary">Back to List</a>
        </div>

        <!-- Loading State -->
        @if (personService.loading()) {
          <div class="loading">Saving person...</div>
        }

        <!-- Error State -->
        @if (personService.error()) {
          <div class="error">{{ personService.error() }}</div>
        }

        <!-- Success Message -->
        @if (successMessage) {
          <div class="success">{{ successMessage }}</div>
        }

        <!-- Person Form -->
        <form (ngSubmit)="onSubmit()" #personForm="ngForm">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="personType" class="form-label">Person Type *</label>
                <select id="personType" name="personType" class="form-control" 
                        [(ngModel)]="person.personType" required>
                  <option value="">Select Person Type</option>
                  <option value="EM">Employee</option>
                  <option value="SP">Sales Person</option>
                  <option value="SC">Store Contact</option>
                  <option value="VC">Vendor Contact</option>
                  <option value="GC">General Contact</option>
                  <option value="IN">Individual</option>
                </select>
              </div>

              <div class="form-group">
                <label for="firstName" class="form-label">First Name *</label>
                <input type="text" id="firstName" name="firstName" class="form-control"
                       [(ngModel)]="person.firstName" required>
              </div>

              <div class="form-group">
                <label for="middleName" class="form-label">Middle Name</label>
                <input type="text" id="middleName" name="middleName" class="form-control"
                       [(ngModel)]="person.middleName">
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name *</label>
                <input type="text" id="lastName" name="lastName" class="form-control"
                       [(ngModel)]="person.lastName" required>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="title" class="form-label">Title</label>
                <input type="text" id="title" name="title" class="form-control"
                       [(ngModel)]="person.title">
              </div>

              <div class="form-group">
                <label for="suffix" class="form-label">Suffix</label>
                <input type="text" id="suffix" name="suffix" class="form-control"
                       [(ngModel)]="person.suffix">
              </div>

              <div class="form-group">
                <label for="emailPromotion" class="form-label">Email Promotion</label>
                <select id="emailPromotion" name="emailPromotion" class="form-control"
                        [(ngModel)]="person.emailPromotion">
                  <option value="0">No Promotion</option>
                  <option value="1">Promotion from AdventureWorks</option>
                  <option value="2">Promotion from AdventureWorks and Partners</option>
                </select>
              </div>

              <div class="form-group">
                <label for="nameStyle" class="form-label">Name Style</label>
                <div class="form-check">
                  <input type="checkbox" id="nameStyle" name="nameStyle" class="form-check-input"
                         [(ngModel)]="person.nameStyle">
                  <label for="nameStyle" class="form-check-label">Western Name Style</label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="personService.loading()">
              {{ isEditMode ? 'Update' : 'Create' }} Person
            </button>
            <a routerLink="/persons" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
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
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -0.75rem;
    }
    
    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 0 0.75rem;
    }
    
    .form-actions {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #dee2e6;
    }
    
    .form-actions .btn {
      margin-right: 0.5rem;
    }
    
    .form-check {
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
    }
    
    .form-check-input {
      margin-right: 0.5rem;
    }
    
    .form-check-label {
      margin-bottom: 0;
    }
    
    @media (max-width: 768px) {
      .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class PersonFormComponent implements OnInit {
  personService = inject(PersonService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  personId = 0;
  isEditMode = false;
  successMessage = '';
  
  person: CreatePersonDto = {
    personType: '',
    firstName: '',
    lastName: '',
    nameStyle: true,
    emailPromotion: 0
  };

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.personId = +params['id'];
        this.isEditMode = true;
        this.loadPerson();
      }
    });
  }

  loadPerson() {
    this.personService.getPersonById(this.personId).subscribe(person => {
      if (person) {
        this.person = {
          personType: person.personType,
          firstName: person.firstName,
          middleName: person.middleName || undefined,
          lastName: person.lastName,
          title: person.title || undefined,
          suffix: person.suffix || undefined,
          nameStyle: person.nameStyle,
          emailPromotion: person.emailPromotion
        };
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.personService.updatePerson(this.personId, this.person).subscribe(() => {
        this.successMessage = 'Person updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/persons', this.personId]);
        }, 1500);
      });
    } else {
      this.personService.createPerson(this.person).subscribe(() => {
        this.successMessage = 'Person created successfully!';
        setTimeout(() => {
          this.router.navigate(['/persons']);
        }, 1500);
      });
    }
  }
} 