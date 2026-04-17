import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ShipmentStatus } from './enums/shipment-status.enum';
import { User } from 'src/users/user.schema';
import { ShipmentLocation } from './shipment-location.schema';
import { Location } from 'src/locations/location.schema';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'tracking_number', unique: true, length: 255 })
  trackingNumber!: string;

  @Column({ type: 'enum', enum: ShipmentStatus })
  status!: ShipmentStatus;

  @Column({ name: 'current_location_id', nullable: true })
  currentLocationId!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Location, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_location_id' })
  currentLocation!: Location | null;

  @OneToMany(() => ShipmentLocation, (sl) => sl.shipment)
  locationHistory!: ShipmentLocation[];
}
