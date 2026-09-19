import { Injectable, Logger } from '@nestjs/common';
import { ChangePasswordInput } from '../inputs';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class ChangePasswordUseCase {
  private readonly logger = new Logger(ChangePasswordUseCase.name);

  constructor(private readonly authService: AuthService) {}

  async execute(input: ChangePasswordInput, headers: Headers) {
    return await this.authService.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
      headers,
    });
  }
}
