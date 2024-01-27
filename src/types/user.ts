import { Document } from "mongoose";

export interface UserType extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string | undefined;
  role: string;
  passwordChangedAt: Date | number;
  passwordResetToken: string | undefined;
  passwordResetTokenExpiration: number | undefined;
  comparePassword(
    candidatePassword: string,
    password: string
  ): Promise<boolean>;
  passwordChangedAfterLogin(JWTIssuedAt: number): boolean;
  generatePasswordResetToken(): string;
}
