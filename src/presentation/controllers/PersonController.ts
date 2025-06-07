import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../../ioc/types';
import { PersonService } from '../../application/services/PersonService';
import { CreatePersonDto, UpdatePersonDto } from '../../application/dtos/PersonDto';

@injectable()
export class PersonController {
  constructor(
    @inject(TYPES.PersonService)
    private personService: PersonService
  ) {}

  async getAllPersons(req: Request, res: Response): Promise<void> {
    try {
      const persons = await this.personService.findAll();
      res.json(persons);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving persons' });
    }
  }

  async getPersonById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const person = await this.personService.findById(id);
      
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ message: 'Person not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving person' });
    }
  }

  async createPerson(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreatePersonDto = req.body;
      const person = await this.personService.create(dto);
      res.status(201).json(person);
    } catch (error) {
      res.status(500).json({ message: 'Error creating person' });
    }
  }

  async updatePerson(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dto: UpdatePersonDto = req.body;
      const person = await this.personService.update(id, dto);
      
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ message: 'Person not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating person' });
    }
  }

  async deletePerson(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.personService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting person' });
    }
  }
} 