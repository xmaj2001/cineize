import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLocationDto {
  @ApiProperty({ example: "Luanda" })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: "Luanda" })
  @IsString()
  @MaxLength(100)
  province: string;

  @ApiPropertyOptional({ example: "Angola", default: "Angola" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ example: -8.838333 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 13.234444 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
