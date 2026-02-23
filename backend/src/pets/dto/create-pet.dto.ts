import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsIn(['DOG', 'CAT'])
  type: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  weight?: number;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
