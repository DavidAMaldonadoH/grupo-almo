import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class CreateShipmentLocationDto {
  @IsInt()
  shipmentId!: number;

  @IsInt()
  locationId!: number;

  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string | null;
}
