import { ShipMethod } from '../entities/ShipMethod';

export interface IShipMethodRepository {
  findAll(): Promise<ShipMethod[]>;
  findById(id: number): Promise<ShipMethod | null>;
  create(shipMethod: ShipMethod): Promise<ShipMethod>;
  update(shipMethod: ShipMethod): Promise<ShipMethod>;
  delete(id: number): Promise<void>;
} 