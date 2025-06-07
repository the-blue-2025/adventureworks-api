import { injectable } from 'inversify';
import { IShipMethodRepository } from '../../domain/repositories/IShipMethodRepository';
import { ShipMethod as DomainShipMethod, ShipMethodProps } from '../../domain/entities/ShipMethod';
import { ShipMethod, ShipMethodInstance } from '../database/models/ShipMethodModel';

@injectable()
export class ShipMethodRepository implements IShipMethodRepository {
  async findAll(): Promise<DomainShipMethod[]> {
    const shipMethods = await ShipMethod.findAll();
    return shipMethods.map(sm => this.toDomain(sm));
  }

  async findById(id: number): Promise<DomainShipMethod | null> {
    const shipMethod = await ShipMethod.findByPk(id);
    return shipMethod ? this.toDomain(shipMethod) : null;
  }

  async create(shipMethod: DomainShipMethod): Promise<void> {
    await ShipMethod.create(this.toPersistence(shipMethod));
  }

  async update(shipMethod: DomainShipMethod): Promise<void> {
    await ShipMethod.update(
      this.toPersistence(shipMethod),
      {
        where: { shipMethodId: shipMethod.shipMethodId }
      }
    );
  }

  async delete(id: number): Promise<void> {
    await ShipMethod.destroy({
      where: { shipMethodId: id }
    });
  }

  private toDomain(model: ShipMethodInstance): DomainShipMethod {
    return DomainShipMethod.create({
      shipMethodId: model.shipMethodId,
      name: model.name,
      shipBase: model.shipBase,
      shipRate: model.shipRate,
      modifiedDate: model.modifiedDate
    });
  }

  private toPersistence(domain: DomainShipMethod): any {
    return {
      shipMethodId: domain.shipMethodId,
      name: domain.name,
      shipBase: domain.shipBase,
      shipRate: domain.shipRate,
      modifiedDate: domain.modifiedDate
    };
  }
} 