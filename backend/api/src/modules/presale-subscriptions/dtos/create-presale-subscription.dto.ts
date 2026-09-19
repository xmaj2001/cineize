import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreatePresaleSubscriptionDto {
  @ApiPropertyOptional({
    description: "Endereço de email para receber a notificação",
    example: "user@example.com",
  })
  @ValidateIf((o) => !o.whatsapp)
  @IsEmail({}, { message: "Email inválido ou em falta (se o whatsapp não for fornecido)" })
  email?: string;

  @ApiPropertyOptional({
    description: "Número de WhatsApp para receber a notificação",
    example: "+244923000000",
  })
  @ValidateIf((o) => !o.email)
  @IsString()
  whatsapp?: string;
}
