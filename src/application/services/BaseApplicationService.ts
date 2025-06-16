import { injectable } from 'inversify';

@injectable()
export abstract class BaseApplicationService<TEntity, TDto, TCreateDto, TUpdateDto> {
  abstract findAll(): Promise<TDto[]>;
  abstract findById(id: number): Promise<TDto | null>;
  abstract create(dto: TCreateDto): Promise<TDto>;
  abstract update(id: number, dto: TUpdateDto): Promise<TDto | null>;
  abstract delete(id: number): Promise<void>;

  protected abstract toDto(entity: TEntity): TDto;
  protected abstract toEntity(dto: TCreateDto | TUpdateDto): TEntity;
} 