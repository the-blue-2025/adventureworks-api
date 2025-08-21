import { Entity } from '../common/Entity';

export interface PersonPhoneProps {
  businessEntityId: number;
  phoneNumber: string;
  phoneNumberTypeId: number;
  modifiedDate: Date;
}

export class PersonPhone extends Entity<PersonPhoneProps> {
  get businessEntityId(): number {
    return this.props.businessEntityId;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get phoneNumberTypeId(): number {
    return this.props.phoneNumberTypeId;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: PersonPhoneProps) {
    super(props);
  }

  public static create(props: PersonPhoneProps): PersonPhone {
    return new PersonPhone(props);
  }
}
