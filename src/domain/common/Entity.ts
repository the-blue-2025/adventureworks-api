export abstract class Entity<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    return JSON.stringify(this.props) === JSON.stringify(object.props);
  }
} 