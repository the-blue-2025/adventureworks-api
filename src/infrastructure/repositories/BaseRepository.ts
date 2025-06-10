import { injectable } from 'inversify';
import { Model, ModelStatic, Identifier, WhereOptions } from 'sequelize';

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
   * Find all entities - Template Method implementation
   */
  async findAll(): Promise<TDomain[]> {
    const models = await this.model.findAll();
    return models.map(model => this.toDomain(model as TModel));
  }

  /**
   * Find an entity by its ID - Template Method implementation
   * @param id - Entity ID
   */
  async findById(id: TId): Promise<TDomain | null> {
    const model = await this.model.findByPk(id);
    return model ? this.toDomain(model as TModel) : null;
  }

  /**
   * Create a new entity - Template Method implementation
   * @param entity - Domain entity to create
   */
  async create(entity: TDomain): Promise<void> {
    await this.model.create(this.toPersistence(entity));
  }

  /**
   * Update an existing entity - Template Method implementation
   * @param entity - Domain entity to update
   */
  async update(entity: TDomain): Promise<void> {
    const persistenceData = this.toPersistence(entity);
    const where = { [this.getIdField()]: persistenceData[this.getIdField()] } as WhereOptions<TModel>;
    await this.model.update(
      persistenceData,
      { where }
    );
  }

  /**
   * Delete an entity by its ID - Template Method implementation
   * @param id - Entity ID
   */
  async delete(id: TId): Promise<void> {
    const where = { [this.getIdField()]: id } as WhereOptions<TModel>;
    await this.model.destroy({ where });
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