import { Entity } from '../common/Entity';

export interface ShipMethodProps {
  shipMethodId: number;
  name: string;
  shipBase: number;
  shipRate: number;
  modifiedDate: Date;
}

export class ShipMethod extends Entity<ShipMethodProps> {
  get shipMethodId(): number {
    return this.props.shipMethodId;
  }

  get name(): string {
    return this.props.name;
  }

  get shipBase(): number {
    return this.props.shipBase;
  }

  get shipRate(): number {
    return this.props.shipRate;
  }

  get modifiedDate(): Date {
    return this.props.modifiedDate;
  }

  private constructor(props: ShipMethodProps) {
    super(props);
  }

  public static create(props: ShipMethodProps): ShipMethod {
    return new ShipMethod(props);
  }
} 