import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
