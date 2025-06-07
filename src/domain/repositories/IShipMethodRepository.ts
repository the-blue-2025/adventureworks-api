import { ShipMethod } from '../entities/ShipMethod';

export interface IShipMethodRepository {
  findAll(): Promise<ShipMethod[]>;
  findById(id: number): Promise<ShipMethod | null>;
  create(shipMethod: ShipMethod): Promise<void>;
  update(shipMethod: ShipMethod): Promise<void>;
  delete(id: number): Promise<void>;
} 