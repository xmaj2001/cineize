import { Injectable, Logger } from '@nestjs/common';
import { ForgotPasswordInput } from '../inputs';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(private readonly authService: AuthService) {}

  async execute(input: ForgotPasswordInput) {
    await this.authService.api.requestPasswordReset({
      body: {
        email: input.email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/auth/reset-password`,
      },
    });
    return { message: 'Se o email existir, receberás instruções em breve' };
  }
}
