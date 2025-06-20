import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseSignalService } from './base-signal.service';
import { ApiService } from './api.service';
import { PersonDto, CreatePersonDto, UpdatePersonDto } from '../models/person.dto';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends BaseSignalService<PersonDto> {
  constructor(private apiService: ApiService) {
    super();
  }

  // Load all persons
  loadPersons(): Observable<PersonDto[]> {
    return this.handleObservable(
      this.apiService.get<PersonDto[]>('/persons'),
      (persons) => this.setData(persons)
    );
  }

  // Get person by ID
  getPersonById(id: number): Observable<PersonDto> {
    return this.handleObservable(
      this.apiService.get<PersonDto>(`/persons/${id}`),
      (person) => this.setSelectedItem(person)
    );
  }

  // Create new person
  createPerson(person: CreatePersonDto): Observable<PersonDto> {
    return this.handleObservable(
      this.apiService.post<PersonDto>('/persons', person),
      (newPerson) => this.addItem(newPerson)
    );
  }

  // Update person
  updatePerson(id: number, person: UpdatePersonDto): Observable<PersonDto> {
    return this.handleObservable(
      this.apiService.put<PersonDto>(`/persons/${id}`, person),
      (updatedPerson) => this.updateItem(updatedPerson, p => p.businessEntityId === id)
    );
  }

  // Delete person
  deletePerson(id: number): Observable<void> {
    return this.handleObservable(
      this.apiService.delete<void>(`/persons/${id}`),
      () => this.removeItem(p => p.businessEntityId === id)
    );
  }

  // Search persons by name
  searchPersons(query: string): Observable<PersonDto[]> {
    return this.handleObservable(
      this.apiService.get<PersonDto[]>(`/persons/search?q=${query}`),
      (persons) => this.setData(persons)
    );
  }

  // Get person by type
  getPersonsByType(personType: string): Observable<PersonDto[]> {
    return this.handleObservable(
      this.apiService.get<PersonDto[]>(`/persons/type/${personType}`),
      (persons) => this.setData(persons)
    );
  }

  // Select a person (for editing/viewing)
  selectPerson(person: PersonDto | null): void {
    this.setSelectedItem(person);
  }

  // Get full name of a person
  getFullName(person: PersonDto): string {
    const parts = [
      person.title,
      person.firstName,
      person.middleName,
      person.lastName,
      person.suffix
    ].filter(Boolean);
    
    return parts.join(' ');
  }
} 