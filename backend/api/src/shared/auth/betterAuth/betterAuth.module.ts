import { Module } from '@nestjs/common';

import {
  ChangePasswordUseCase,
  ForgotPasswordUseCase,
  GetSessionUseCase,
  ResetPasswordUseCase,
  ResendVerificationUseCase,
  SignInUseCase,
  SignUpUseCase,
  SignOutUseCase,
  VerifyEmailUseCase,
} from './use-cases';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { BetterAuthService } from './betterAuth.service';
import { BetterAuthController } from './auth.controller';

const useCases = [
  SignUpUseCase,
  SignInUseCase,
  SignOutUseCase,
  GetSessionUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
  ChangePasswordUseCase,
  ResendVerificationUseCase,
  VerifyEmailUseCase,
];
@Module({
  imports: [],
  providers: [BetterAuthService, AuthService, ...useCases],
  controllers: [BetterAuthController],
  exports: [BetterAuthService],
})
export class BetterAuthModules {}
