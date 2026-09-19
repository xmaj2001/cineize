import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class ResendVerificationUseCase {
  private readonly logger = new Logger(ResendVerificationUseCase.name);

  constructor(private readonly authService: AuthService) {}

  async execute(headers: Headers) {
    const session = await this.authService.api.getSession({ headers });
    if (!session?.user?.email) {
      throw new ConflictException('Sessão inválida');
    }
    await this.authService.api.sendVerificationEmail({
      body: { email: session.user.email },
    });
    return { message: 'Email de verificação reenviado' };
  }
}
