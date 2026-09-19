import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class SignOutUseCase {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(SignOutUseCase.name);

  async execute(headers: Headers) {
    return await this.authService.api.signOut({ headers });
  }
}
