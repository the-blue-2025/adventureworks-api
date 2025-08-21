import { Entity } from './Entity';

/**
 * Base interface for all aggregate roots
 * Forces aggregate roots to define their child entity types
 */
export interface AggregateRoot<T> extends Entity<T> {
  /**
   * Object defining all child entity types for this aggregate
   * This ensures type safety and prevents typos when referencing child entities
   */
  readonly ChildEntityType: {
    readonly [key: string]: string;
  };
} 