import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SpotsController } from './spots.controller';
import { SpotsService } from './spots.service';

@Module({
  imports: [PrismaModule],
  controllers: [SpotsController],
  providers: [SpotsService],
})
export class SpotsModule {}
