import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpInput {
  @ApiProperty({ example: 'Xavier Jose', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({ example: 'user64@qcena.com', description: 'Email' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ example: 'Senha@1234', description: 'Senha (mín. 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean({ message: 'rememberMe deve ser booleano' })
  @IsOptional()
  rememberMe?: boolean;
}
