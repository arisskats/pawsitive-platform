import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsService } from './pets.service';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pet = await this.petsService.findOne(id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }
}
