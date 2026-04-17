import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Shipment } from './shipment.schema';
import { CreateShipmentDto } from './dtos/create-shipment.dto';
import { ShipmentLocation } from './shipment-location.schema';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShipmentLocation)
    private historyRepository: Repository<ShipmentLocation>,
    private dataSource: DataSource,
  ) {}

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    const { trackingNumber, userId, status, currentLocationId } =
      createShipmentDto;

    const existing = await this.shipmentRepository.findOne({
      where: { trackingNumber },
    });
    if (existing) {
      throw new BadRequestException('Tracking number already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newShipment = this.shipmentRepository.create({
        userId,
        trackingNumber,
        status,
        currentLocationId,
      });
      const savedShipment = await queryRunner.manager.save(newShipment);

      if (currentLocationId) {
        const initialHistory = this.historyRepository.create({
          shipmentId: savedShipment.id,
          locationId: currentLocationId,
          status: status,
          notes: 'Registro inicial del paquete.',
        });
        await queryRunner.manager.save(initialHistory);
      }

      await queryRunner.commitTransaction();
      return savedShipment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByTrackingNumber(trackingNumber: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { trackingNumber },
      relations: [
        'currentLocation',
        'locationHistory',
        'locationHistory.location',
      ],
      order: {
        locationHistory: {
          timestamp: 'DESC',
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException(
        `No se encontró el paquete con guía: ${trackingNumber}`,
      );
    }

    return this.formatTrackingResponse(shipment);
  }

  private formatTrackingResponse(shipment: Shipment) {
    return {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation:
        shipment.currentLocation?.name || 'Ubicación no disponible',
      history: shipment.locationHistory.map((entry) => ({
        timestamp: entry.timestamp,
        status: entry.status,
        location: entry.location?.name || 'Desconocido',
        notes: entry.notes,
      })),
    };
  }
}
