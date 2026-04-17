import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dtos/create-shipment.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  async create(@Body() createShipmentDto: CreateShipmentDto) {
    return await this.shipmentsService.create(createShipmentDto);
  }

  @Get()
  async getShipmentDetails(@Query('number') trackingNumber: string) {
    return await this.shipmentsService.findByTrackingNumber(trackingNumber);
  }
}
