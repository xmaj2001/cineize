import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class GetSessionUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(headers: Headers) {
    const session = await this.authService.api.getSession({ headers });
    if (!session) {
      throw new UnauthorizedException('Sessão não encontrada');
    }
    return session;
  }
}
