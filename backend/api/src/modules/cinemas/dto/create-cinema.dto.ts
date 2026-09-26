import {
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCinemaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  locationId: number;

  @ApiProperty({ example: 'Cinemax Talatona' })
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'cinemax-talatona' })
  @IsString()
  @MaxLength(150)
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Centro Comercial Talatona, Luanda' })
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({ example: -8.91 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 13.18 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ example: '10:00:00', description: 'HH:mm:ss' })
  @IsString()
  openTime: string;

  @ApiProperty({ example: '23:00:00', description: 'HH:mm:ss' })
  @IsString()
  closeTime: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
