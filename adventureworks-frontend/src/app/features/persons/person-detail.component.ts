import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../shared/services/person.service';
import { PersonDto } from '../../shared/models/person.dto';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>Person Details</h2>
          <div>
            <a [routerLink]="['/persons', personId, 'edit']" class="btn btn-primary">Edit</a>
            <a routerLink="/persons" class="btn btn-secondary">Back to List</a>
          </div>
        </div>

        <!-- Loading State -->
        @if (personService.loading()) {
          <div class="loading">Loading person details...</div>
        }

        <!-- Error State -->
        @if (personService.error()) {
          <div class="error">{{ personService.error() }}</div>
        }

        <!-- Person Details -->
        @if (personService.selectedItem()) {
          @if (person; as person) {
            <div class="person-details">
              <div class="row">
                <div class="col-md-6">
                  <h3>Personal Information</h3>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th>Business Entity ID:</th>
                        <td>{{ person.businessEntityId }}</td>
                      </tr>
                      <tr>
                        <th>Full Name:</th>
                        <td>{{ personService.getFullName(person) }}</td>
                      </tr>
                      <tr>
                        <th>Title:</th>
                        <td>{{ person.title || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <th>First Name:</th>
                        <td>{{ person.firstName }}</td>
                      </tr>
                      <tr>
                        <th>Middle Name:</th>
                        <td>{{ person.middleName || 'N/A' }}</td>
                      </tr>
                      <tr>
                        <th>Last Name:</th>
                        <td>{{ person.lastName }}</td>
                      </tr>
                      <tr>
                        <th>Suffix:</th>
                        <td>{{ person.suffix || 'N/A' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <h3>Additional Information</h3>
                  <table class="table">
                    <tbody>
                      <tr>
                        <th>Person Type:</th>
                        <td>{{ person.personType }}</td>
                      </tr>
                      <tr>
                        <th>Name Style:</th>
                        <td>{{ person.nameStyle ? 'Western' : 'Eastern' }}</td>
                      </tr>
                      <tr>
                        <th>Email Promotion:</th>
                        <td>{{ person.emailPromotion }}</td>
                      </tr>
                      <tr>
                        <th>Modified Date:</th>
                        <td>{{ person.modifiedDate | date:'full' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        } @else if (!personService.loading()) {
          <div class="text-center py-4">
            <p>Person not found.</p>
          </div>
        }
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
    
    .person-details h3 {
      margin-bottom: 1rem;
      color: #495057;
    }
    
    .text-center {
      text-align: center;
    }
    
    .py-4 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
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
export class PersonDetailComponent implements OnInit {
  personService = inject(PersonService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  personId = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personId = +params['id'];
      this.loadPerson();
    });
  }

  loadPerson() {
    this.personService.getPersonById(this.personId).subscribe();
  }

  get person(): PersonDto | null {
    return this.personService.selectedItem();
  }
} 