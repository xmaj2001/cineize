import { Injectable, Logger } from '@nestjs/common';
import { SignUpUseCase } from './use-cases/sign-up.use-case';
import {
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from './inputs';
import {
  ChangePasswordUseCase,
  ForgotPasswordUseCase,
  GetSessionUseCase,
  ResetPasswordUseCase,
  ResendVerificationUseCase,
  SignInUseCase,
  SignOutUseCase,
  VerifyEmailUseCase,
} from './use-cases';

@Injectable()
export class BetterAuthService {
  private readonly logger = new Logger(BetterAuthService.name);
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly signOutUseCase: SignOutUseCase,
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
  ) {}

  async signUp(input: SignUpInput) {
    return this.signUpUseCase.execute(input);
  }

  async signIn(input: SignInInput) {
    return this.signInUseCase.execute(input);
  }

  async signOut(header: Headers) {
    return this.signOutUseCase.execute(header);
  }

  async getSession(header: Headers) {
    return this.getSessionUseCase.execute(header);
  }

  async changePassword(input: ChangePasswordInput, header: Headers) {
    return this.changePasswordUseCase.execute(input, header);
  }

  async forgotPassword(input: ForgotPasswordInput) {
    return this.forgotPasswordUseCase.execute(input);
  }

  async resetPassword(input: ResetPasswordInput) {
    return this.resetPasswordUseCase.execute(input);
  }

  async resendVerification(headers: Headers) {
    return this.resendVerificationUseCase.execute(headers);
  }

  async verifyEmail(token: string) {
    return this.verifyEmailUseCase.execute(token);
  }
}
