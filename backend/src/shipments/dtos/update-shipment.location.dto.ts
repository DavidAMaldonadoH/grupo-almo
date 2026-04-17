import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentLocationDto } from './create-shipment-location.dto';

export class UpdateShipmentLocationDto extends PartialType(
  CreateShipmentLocationDto,
) {}
