import { Injectable, Logger } from '@nestjs/common';
import { ResetPasswordInput } from '../inputs';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  async execute(input: ResetPasswordInput) {
    return await this.authService.api.resetPassword({
      body: {
        token: input.token,
        newPassword: input.newPassword,
      },
    });
  }
}
