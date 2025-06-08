import { injectable } from 'inversify';

/**
 * Abstract base repository that provides common CRUD operations
 * @template TDomain - Domain entity type
 * @template TModel - Database model type
 * @template TId - Type of the entity's ID (number, string, etc.)
 */
@injectable()
export abstract class BaseRepository<TDomain, TModel, TId> {
  /**
   * Find all entities
   */
  abstract findAll(): Promise<TDomain[]>;

  /**
   * Find an entity by its ID
   * @param id - Entity ID
   */
  abstract findById(id: TId): Promise<TDomain | null>;

  /**
   * Create a new entity
   * @param entity - Domain entity to create
   */
  abstract create(entity: TDomain): Promise<void>;

  /**
   * Update an existing entity
   * @param entity - Domain entity to update
   */
  abstract update(entity: TDomain): Promise<void>;

  /**
   * Delete an entity by its ID
   * @param id - Entity ID
   */
  abstract delete(id: TId): Promise<void>;

  /**
   * Convert a database model to a domain entity
   * @param model - Database model instance
   */
  protected abstract toDomain(model: TModel): TDomain;

  /**
   * Convert a domain entity to a database model
   * @param domain - Domain entity instance
   */
  protected abstract toPersistence(domain: TDomain): any;
} 