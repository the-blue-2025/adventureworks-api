import { Router, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/ioc/types';
import { PersonService } from '../../application/services/PersonService';
import { CreatePersonDto, UpdatePersonDto } from '../../application/dtos/PersonDto';

@injectable()
export class PersonController {
  public router: Router;

  constructor(
    @inject(TYPES.PersonService)
    private personService: PersonService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getAllPersons.bind(this));
    this.router.get('/:id', this.getPersonById.bind(this));
    this.router.post('/', this.createPerson.bind(this));
    this.router.put('/:id', this.updatePerson.bind(this));
    this.router.delete('/:id', this.deletePerson.bind(this));
  }

  private async getAllPersons(_req: Request, res: Response) {
    try {
      const persons = await this.personService.findAll();
      res.json(persons);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving persons' });
    }
  }

  private async getPersonById(req: Request, res: Response) {
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

  private async createPerson(req: Request, res: Response) {
    try {
      const dto: CreatePersonDto = req.body;
      const person = await this.personService.create(dto);
      res.status(201).json(person);
    } catch (error) {
      res.status(500).json({ message: 'Error creating person' });
    }
  }

  private async updatePerson(req: Request, res: Response) {
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

  private async deletePerson(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.personService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting person' });
    }
  }
} 