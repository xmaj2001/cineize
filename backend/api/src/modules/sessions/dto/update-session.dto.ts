import { IsNumber, IsOptional, IsEnum, IsBoolean, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SessionState } from "src/generated/prisma/enums";

export class UpdateSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: SessionState })
  @IsOptional()
  @IsEnum(SessionState)
  state?: SessionState;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
