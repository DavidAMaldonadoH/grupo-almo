import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 255 })
  name!: string;

  @Column({ length: 255 })
  address!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
