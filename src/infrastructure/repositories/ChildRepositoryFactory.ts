// Define the base type for all child repositories
export type ChildRepository = any; // Using any to allow any repository type

/**
 * Factory for creating child repositories
 * Uses a registry pattern to manage repository creation
 * 
 * This factory can be used by any aggregate (Person, PurchaseOrder, Vendor, etc.)
 * to manage their child repositories dynamically.
 */
export class ChildRepositoryFactory {
  private repositoryRegistry: Map<string, new () => ChildRepository>;

  constructor() {
    this.repositoryRegistry = new Map();
  }

  /**
   * Create a repository instance for the given entity name
   * @param entityName - The name of the entity
   * @returns A new repository instance
   */
  createRepository(entityName: string): ChildRepository {
    const RepositoryClass = this.repositoryRegistry.get(entityName);
    if (!RepositoryClass) {
      throw new Error(`Repository for entity '${entityName}' not found in registry`);
    }
    return new RepositoryClass();
  }

  /**
   * Register a new repository class
   * @param entityName - The name of the entity
   * @param repositoryClass - The repository class constructor
   */
  registerRepository(entityName: string, repositoryClass: new () => ChildRepository): void {
    this.repositoryRegistry.set(entityName, repositoryClass);
  }

  /**
   * Get all available repository names
   * @returns Array of registered entity names
   */
  getAvailableRepositories(): string[] {
    return Array.from(this.repositoryRegistry.keys());
  }

  /**
   * Check if a repository exists for the given entity
   * @param entityName - The name of the entity
   * @returns True if the repository is registered
   */
  hasRepository(entityName: string): boolean {
    return this.repositoryRegistry.has(entityName);
  }

  /**
   * Get repository class without creating an instance
   * @param entityName - The name of the entity
   * @returns The repository class constructor
   */
  getRepositoryClass(entityName: string): (new () => ChildRepository) | undefined {
    return this.repositoryRegistry.get(entityName);
  }

  /**
   * Remove a repository from the registry
   * @param entityName - The name of the entity
   * @returns True if the repository was removed
   */
  unregisterRepository(entityName: string): boolean {
    return this.repositoryRegistry.delete(entityName);
  }

  /**
   * Clear all registered repositories
   */
  clearRegistry(): void {
    this.repositoryRegistry.clear();
  }

  /**
   * Get the total number of registered repositories
   * @returns Number of registered repositories
   */
  getRepositoryCount(): number {
    return this.repositoryRegistry.size;
  }
}
