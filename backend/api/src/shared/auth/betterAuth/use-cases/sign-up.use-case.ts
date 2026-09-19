import { Injectable, Logger } from '@nestjs/common';
import { SignUpInput } from '../inputs';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class SignUpUseCase {
  private readonly logger = new Logger(SignUpUseCase.name);
  constructor(private readonly authService: AuthService) {}

  async execute(input: SignUpInput) {
    this.logger.log(`Executing sign up use case`);
    const data = await this.authService.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        rememberMe: input.rememberMe,
      },
    });
    this.logger.log(`User signed up successfully`);
    const isRequireEmailVerification =
      this.authService.instance.options.emailAndPassword
        ?.requireEmailVerification;
    if (isRequireEmailVerification) {
      this.logger.log(`Email verification required`);
      return {
        message: `Conta criada com sucesso! Foi enviado um email:${input.email} de verificação para o seu email. Clique no link para verificar a sua conta.`,
      };
    }
    return data;
  }
}
