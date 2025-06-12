import { injectable } from 'inversify';
import { Model, ModelStatic, Identifier, WhereOptions } from 'sequelize';
import { RepositoryError } from '../../domain/errors/RepositoryError';

/**
 * Abstract base repository that provides common CRUD operations using Template Method pattern
 * @template TDomain - Domain entity type
 * @template TModel - Database model type
 * @template TId - Type of the entity's ID (must be compatible with Sequelize's Identifier type)
 */
@injectable()
export abstract class BaseRepository<TDomain, TModel extends Model, TId extends Identifier> {
  protected abstract readonly model: ModelStatic<TModel>;

  /**
   * Get the ID field name for the model (e.g., 'businessEntityId', 'id', etc.)
   */
  protected abstract getIdField(): string;

  /**
   * Get the entity name for error messages
   */
  protected abstract getEntityName(): string;

  /**
   * Find all entities - Template Method implementation
   */
  async findAll(): Promise<TDomain[]> {
    try {
      const models = await this.model.findAll();
      return models.map(model => this.toDomain(model as TModel));
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch all ${this.getEntityName()} entities`,
        'findAll',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Find an entity by its ID - Template Method implementation
   * @param id - Entity ID
   */
  async findById(id: TId): Promise<TDomain | null> {
    try {
      const model = await this.model.findByPk(id);
      return model ? this.toDomain(model as TModel) : null;
    } catch (error) {
      throw new RepositoryError(
        `Failed to fetch ${this.getEntityName()} with ID ${id}`,
        'findById',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Create a new entity - Template Method implementation
   * @param entity - Domain entity to create
   */
  async create(entity: TDomain): Promise<TDomain> {
    try {
      const createdModel = await this.model.create(this.toPersistence(entity));
      return this.toDomain(createdModel as TModel);
    } catch (error) {
      throw new RepositoryError(
        `Failed to create ${this.getEntityName()}`,
        'create',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Update an existing entity - Template Method implementation
   * @param entity - Domain entity to update
   */
  async update(entity: TDomain): Promise<TDomain> {
    try {
      const persistenceData = this.toPersistence(entity);
      const where = { [this.getIdField()]: persistenceData[this.getIdField()] } as WhereOptions<TModel>;
      await this.model.update(
        persistenceData,
        { where }
      );

      const updatedModel = await this.model.findByPk(persistenceData[this.getIdField()]);
      if (!updatedModel) {
        throw new RepositoryError(
          `Failed to fetch updated ${this.getEntityName()} with ID ${persistenceData[this.getIdField()]}`,
          'update',
          this.getEntityName()
        );
      }

      return this.toDomain(updatedModel as TModel);
    } catch (error) {
      throw new RepositoryError(
        `Failed to update ${this.getEntityName()}`,
        'update',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Delete an entity by its ID - Template Method implementation
   * @param id - Entity ID
   */
  async delete(id: TId): Promise<void> {
    try {
      const where = { [this.getIdField()]: id } as WhereOptions<TModel>;
      await this.model.destroy({ where });
    } catch (error) {
      throw new RepositoryError(
        `Failed to delete ${this.getEntityName()} with ID ${id}`,
        'delete',
        this.getEntityName(),
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Convert a database model to a domain entity - Abstract hook method
   * @param model - Database model instance
   */
  protected abstract toDomain(model: TModel): TDomain;

  /**
   * Convert a domain entity to a database model - Abstract hook method
   * @param domain - Domain entity instance
   */
  protected abstract toPersistence(domain: TDomain): any;
} 