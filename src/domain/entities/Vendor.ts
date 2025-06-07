import { Entity } from '../common/Entity';
import { AggregateRoot } from '../common/AggregateRoot';

export interface VendorProps {
  businessEntityId: number;
  accountNumber: string;
  name: string;
  creditRating: number;
  preferredVendorStatus: boolean;
  activeFlag: boolean;
  purchasingWebServiceURL: string | null;
  modifiedDate: Date;
}

export class Vendor extends Entity<VendorProps> implements AggregateRoot<VendorProps> {
  get businessEntityId(): number {
    return this.props.businessEntityId;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get name(): string {
    return this.props.name;
  }

  get creditRating(): number {
    return this.props.creditRating;
  }

  get preferredVendorStatus(): boolean {
    return this.props.preferredVendorStatus;
  }

  get activeFlag(): boolean {
    return this.props.activeFlag;
  }

  get purchasingWebServiceURL(): string | null {
    return this.props.purchasingWebServiceURL;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: VendorProps) {
    super(props);
  }

  public static create(props: VendorProps): Vendor {
    return new Vendor(props);
  }
} 