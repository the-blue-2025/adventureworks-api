/**
 * Custom error class for repository operations in the domain layer.
 * This error represents business-level failures in repository operations.
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly entityName: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
} 