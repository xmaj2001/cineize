import { Injectable, Logger } from '@nestjs/common';
import { SignInInput } from '../inputs';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class SignInUseCase {
  private readonly logger = new Logger(SignInUseCase.name);
  constructor(private readonly authService: AuthService) {}

  async execute(input: SignInInput) {
    return await this.authService.api.signInEmail({ body: input });
  }
}
