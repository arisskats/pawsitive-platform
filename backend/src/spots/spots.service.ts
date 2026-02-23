import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';

@Injectable()
export class SpotsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.spot.findMany();
  }

  create(createSpotDto: CreateSpotDto) {
    return this.prisma.spot.create({
      data: {
        name: createSpotDto.name,
        description: createSpotDto.description,
        latitude: createSpotDto.latitude,
        longitude: createSpotDto.longitude,
        type: createSpotDto.type ?? 'DOG_PARK',
        rating: createSpotDto.rating,
      },
    });
  }
}
