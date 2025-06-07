import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IShipMethodRepository } from '../../domain/repositories/IShipMethodRepository';
import { ShipMethod } from '../../domain/entities/ShipMethod';
import { CreateShipMethodDto, ShipMethodDto, UpdateShipMethodDto } from '../dtos/ShipMethodDto';

@injectable()
export class ShipMethodService {
  constructor(
    @inject(TYPES.IShipMethodRepository)
    private shipMethodRepository: IShipMethodRepository
  ) {}

  async findAll(): Promise<ShipMethodDto[]> {
    const shipMethods = await this.shipMethodRepository.findAll();
    return shipMethods.map(sm => this.toDto(sm));
  }

  async findById(id: number): Promise<ShipMethodDto | null> {
    const shipMethod = await this.shipMethodRepository.findById(id);
    return shipMethod ? this.toDto(shipMethod) : null;
  }

  async create(dto: CreateShipMethodDto): Promise<ShipMethodDto> {
    const shipMethod = ShipMethod.create({
      ...dto,
      shipMethodId: 0, // Will be set by database
      modifiedDate: new Date()
    });

    await this.shipMethodRepository.create(shipMethod);
    return this.toDto(shipMethod);
  }

  async update(id: number, dto: UpdateShipMethodDto): Promise<ShipMethodDto | null> {
    const existingShipMethod = await this.shipMethodRepository.findById(id);
    if (!existingShipMethod) {
      return null;
    }

    const updatedShipMethod = ShipMethod.create({
      shipMethodId: existingShipMethod.shipMethodId,
      name: dto.name ?? existingShipMethod.name,
      shipBase: dto.shipBase ?? existingShipMethod.shipBase,
      shipRate: dto.shipRate ?? existingShipMethod.shipRate,
      modifiedDate: new Date()
    });

    await this.shipMethodRepository.update(updatedShipMethod);
    return this.toDto(updatedShipMethod);
  }

  async delete(id: number): Promise<boolean> {
    const shipMethod = await this.shipMethodRepository.findById(id);
    if (!shipMethod) {
      return false;
    }

    await this.shipMethodRepository.delete(id);
    return true;
  }

  private toDto(shipMethod: ShipMethod): ShipMethodDto {
    return {
      shipMethodId: shipMethod.shipMethodId,
      name: shipMethod.name,
      shipBase: shipMethod.shipBase,
      shipRate: shipMethod.shipRate
    };
  }
} 