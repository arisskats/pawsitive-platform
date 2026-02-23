import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pet.findMany();
  }

  findOne(id: string) {
    return this.prisma.pet.findUnique({
      where: { id },
      include: {
        healthRecords: true,
        foodAnalyses: true,
      },
    });
  }

  create(createPetDto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        name: createPetDto.name,
        type: createPetDto.type,
        breed: createPetDto.breed,
        birthday: createPetDto.birthday ? new Date(createPetDto.birthday) : undefined,
        weight: createPetDto.weight,
        ownerId: createPetDto.ownerId,
      },
    });
  }
}
