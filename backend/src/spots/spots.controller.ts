import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { SpotsService } from './spots.service';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Get()
  findAll() {
    return this.spotsService.findAll();
  }

  @Post()
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotsService.create(createSpotDto);
  }
}
