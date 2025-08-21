import { Entity } from '../common/Entity';

export interface AddressProps {
  addressId: number;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateProvinceId: number;
  postalCode: string;
  spatialLocation: string | null;
  rowguid: string;
  modifiedDate: Date;
}

export class Address extends Entity<AddressProps> {
  get addressId(): number {
    return this.props.addressId;
  }

  get addressLine1(): string {
    return this.props.addressLine1;
  }

  get addressLine2(): string | null {
    return this.props.addressLine2;
  }

  get city(): string {
    return this.props.city;
  }

  get stateProvinceId(): number {
    return this.props.stateProvinceId;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get spatialLocation(): string | null {
    return this.props.spatialLocation;
  }

  get rowguid(): string {
    return this.props.rowguid;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: AddressProps) {
    super(props);
  }

  public static create(props: AddressProps): Address {
    return new Address(props);
  }
}
