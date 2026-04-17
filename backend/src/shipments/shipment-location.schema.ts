// entities/shipment-location.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ShipmentStatus } from './enums/shipment-status.enum';
import { Shipment } from './shipment.schema';
import { Location } from 'src/locations/location.schema';

@Entity('shipment_location')
export class ShipmentLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'shipment_id' })
  shipmentId!: number;

  @Column({ name: 'location_id' })
  locationId!: number;

  @Column({ type: 'enum', enum: ShipmentStatus })
  status!: ShipmentStatus;

  @Column({ length: 500, nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  timestamp!: Date;

  @ManyToOne(() => Shipment, (s) => s.locationHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shipment_id' })
  shipment!: Shipment;

  @ManyToOne(() => Location, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'location_id' })
  location!: Location;
}
