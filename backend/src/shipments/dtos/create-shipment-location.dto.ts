import { IsEnum, IsInt } from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class CreateShipmentLocationDto {
  @IsInt()
  shipmentId!: number;

  @IsInt()
  locationId!: number;

  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;
}
