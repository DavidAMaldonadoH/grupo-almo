import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './shipment.schema';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { ShipmentLocation } from './shipment-location.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipment]),
    TypeOrmModule.forFeature([ShipmentLocation]),
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
