import { Entity } from '../common/Entity';

export interface EmailAddressProps {
  businessEntityId: number;
  emailAddressId: number;
  emailAddress: string;
  rowguid: string;
  modifiedDate: Date;
}

export class EmailAddress extends Entity<EmailAddressProps> {
  get businessEntityId(): number {
    return this.props.businessEntityId;
  }

  get emailAddressId(): number {
    return this.props.emailAddressId;
  }

  get emailAddress(): string {
    return this.props.emailAddress;
  }

  get rowguid(): string {
    return this.props.rowguid;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: EmailAddressProps) {
    super(props);
  }

  public static create(props: EmailAddressProps): EmailAddress {
    return new EmailAddress(props);
  }
}
