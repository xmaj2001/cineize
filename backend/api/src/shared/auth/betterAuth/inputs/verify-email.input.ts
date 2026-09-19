import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailInput {
  @ApiProperty({ description: 'Token recebido no email' })
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}
