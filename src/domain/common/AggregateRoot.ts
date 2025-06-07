import { Entity } from './Entity';

export interface AggregateRoot<T> extends Entity<T> {
  // AggregateRoot marker interface
  // This interface serves as a marker to identify aggregate roots in the domain
  // It extends Entity to ensure all aggregate roots have the basic entity functionality
} 