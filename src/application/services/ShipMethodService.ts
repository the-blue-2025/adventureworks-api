import { injectable, inject } from 'inversify';
import { TYPES } from '../../ioc/types';
import { IShipMethodRepository } from '../../domain/repositories/IShipMethodRepository';
import { ShipMethod } from '../../domain/entities/ShipMethod';
import { ShipMethodDto, CreateShipMethodDto, UpdateShipMethodDto } from '../dtos/ShipMethodDto';
import { BaseApplicationService } from './BaseApplicationService';

// type for update merge
interface ShipMethodUpdateMerge {
  shipMethodId: number;
  name: string;
  shipBase: number;
  shipRate: number;
  modifiedDate: Date;
}

@injectable()
export class ShipMethodService extends BaseApplicationService<ShipMethod, ShipMethodDto, CreateShipMethodDto, UpdateShipMethodDto> {
  constructor(
    @inject(TYPES.IShipMethodRepository)
    private shipMethodRepository: IShipMethodRepository
  ) {
    super();
  }

  async findAll(): Promise<ShipMethodDto[]> {
    const shipMethods = await this.shipMethodRepository.findAll();
    return shipMethods.map(shipMethod => this.toDto(shipMethod));
  }

  async findById(id: number): Promise<ShipMethodDto | null> {
    const shipMethod = await this.shipMethodRepository.findById(id);
    return shipMethod ? this.toDto(shipMethod) : null;
  }

  async create(dto: CreateShipMethodDto): Promise<ShipMethodDto> {
    const shipMethod = this.toEntity(dto);
    await this.shipMethodRepository.create(shipMethod);
    return this.toDto(shipMethod);
  }

  async update(id: number, dto: UpdateShipMethodDto): Promise<ShipMethodDto | null> {
    const existing = await this.shipMethodRepository.findById(id);
    if (!existing) return null;

    // Merge existing entity with update DTO, prioritizing DTO values if provided
    const merged: ShipMethodUpdateMerge = {
      shipMethodId: id,
      name: dto.name !== undefined ? dto.name : existing.name,
      shipBase: dto.shipBase !== undefined ? dto.shipBase : existing.shipBase,
      shipRate: dto.shipRate !== undefined ? dto.shipRate : existing.shipRate,
      modifiedDate: new Date()
    };

    const updatedEntity = this.toEntity(merged);
    await this.shipMethodRepository.update(updatedEntity);
    return this.toDto(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.shipMethodRepository.delete(id);
  }

  protected toDto(shipMethod: ShipMethod): ShipMethodDto {
    return {
      shipMethodId: shipMethod.shipMethodId,
      name: shipMethod.name,
      shipBase: shipMethod.shipBase,
      shipRate: shipMethod.shipRate
    };
  }

  protected toEntity(dto: CreateShipMethodDto | ShipMethodUpdateMerge): ShipMethod {
    const baseDto = {
      shipMethodId: (dto as any).shipMethodId ?? 0,
      name: dto.name,
      shipBase: dto.shipBase,
      shipRate: dto.shipRate,
      modifiedDate: (dto as any).modifiedDate ?? new Date()
    };

    return ShipMethod.create(baseDto);
  }
} 