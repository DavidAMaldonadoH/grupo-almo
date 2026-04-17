import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.schema';
import { CreateLocationDto } from './dtos/create-location.dto';
import { GetLocationDto } from './dtos/get-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto): Promise<GetLocationDto> {
    const existing = await this.locationsRepository.findOneBy({
      name: dto.name,
    });
    if (existing) throw new ConflictException('Location name already in use');

    const location = this.locationsRepository.create({
      name: dto.name,
      address: dto.address,
    });
    const saved = await this.locationsRepository.save(location);
    return this.toDto(saved);
  }

  async findAll(): Promise<GetLocationDto[]> {
    const locations = await this.locationsRepository.find();
    return locations.map((u) => this.toDto(u));
  }

  async findOne(id: number): Promise<GetLocationDto> {
    const location = await this.locationsRepository.findOneBy({ id });
    if (!location) throw new NotFoundException(`Location #${id} not found`);
    return this.toDto(location);
  }

  private toDto(location: Location): GetLocationDto {
    return {
      id: location.id,
      name: location.name,
      address: location.address,
    };
  }
}
