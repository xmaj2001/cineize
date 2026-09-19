import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class VerifyEmailUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(token: string) {
    const result = await this.authService.api.verifyEmail({
      query: { token },
    });

    if (!result) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    return { message: 'Email verificado com sucesso' };
  }
}
