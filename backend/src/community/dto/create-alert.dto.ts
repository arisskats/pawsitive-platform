import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

export enum AlertType {
  DANGER = 'DANGER',
  EVENT = 'EVENT',
  INFO = 'INFO',
}

export class CreateAlertDto {
  @IsEnum(AlertType)
  @IsNotEmpty()
  type: AlertType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  severity?: number;
}
