import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dtos/create-location.dto';
import { GetLocationDto } from './dtos/get-location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto): Promise<GetLocationDto> {
    return this.locationsService.create(dto);
  }

  @Get()
  findAll(): Promise<GetLocationDto[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GetLocationDto> {
    return this.locationsService.findOne(id);
  }
}
