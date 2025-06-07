import { Entity } from '../common/Entity';
import { AggregateRoot } from '../common/AggregateRoot';

export interface PersonProps {
  businessEntityId: number;
  personType: string;
  nameStyle: boolean;
  title: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  emailPromotion: number;
  modifiedDate: Date;
}

export class Person extends Entity<PersonProps> implements AggregateRoot<PersonProps> {
  get businessEntityId(): number {
    return this.props.businessEntityId;
  }

  get personType(): string {
    return this.props.personType;
  }

  get nameStyle(): boolean {
    return this.props.nameStyle;
  }

  get title(): string | null {
    return this.props.title;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get middleName(): string | null {
    return this.props.middleName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get suffix(): string | null {
    return this.props.suffix;
  }

  get emailPromotion(): number {
    return this.props.emailPromotion;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: PersonProps) {
    super(props);
  }

  public static create(props: PersonProps): Person {
    return new Person(props);
  }
} 