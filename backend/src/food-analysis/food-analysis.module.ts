import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FoodAnalysisController } from './food-analysis.controller';
import { FoodAnalysisService } from './food-analysis.service';

@Module({
  imports: [PrismaModule],
  controllers: [FoodAnalysisController],
  providers: [FoodAnalysisService],
})
export class FoodAnalysisModule {}
