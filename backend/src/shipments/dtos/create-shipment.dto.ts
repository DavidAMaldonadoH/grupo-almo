// dto/create-shipment.dto.ts
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ShipmentStatus } from '../enums/shipment-status.enum';

export class CreateShipmentDto {
  @IsInt()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  trackingNumber!: string;

  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsOptional()
  @IsInt()
  currentLocationId?: number | null;
}
