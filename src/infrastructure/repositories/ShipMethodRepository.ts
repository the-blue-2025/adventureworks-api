import { injectable } from 'inversify';
import { IShipMethodRepository } from '../../domain/repositories/IShipMethodRepository';
import { ShipMethod as DomainShipMethod, ShipMethodProps } from '../../domain/entities/ShipMethod';
import { ShipMethod, ShipMethodInstance } from '../database/models/ShipMethodModel';
import { BaseRepository } from './BaseRepository';

@injectable()
export class ShipMethodRepository extends BaseRepository<DomainShipMethod, ShipMethodInstance, number> implements IShipMethodRepository {
  protected readonly model = ShipMethod;

  protected getIdField(): string {
    return 'shipMethodId';
  }

  protected toDomain(model: ShipMethodInstance): DomainShipMethod {
    return DomainShipMethod.create({
      shipMethodId: model.shipMethodId,
      name: model.name,
      shipBase: model.shipBase,
      shipRate: model.shipRate,
      modifiedDate: model.modifiedDate
    });
  }

  protected toPersistence(domain: DomainShipMethod): any {
    return {
      shipMethodId: domain.shipMethodId,
      name: domain.name,
      shipBase: domain.shipBase,
      shipRate: domain.shipRate,
      modifiedDate: domain.modifiedDate
    };
  }
} 