import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export type PlanType = "free" | "paid";

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @MinLength(2)
  displayName!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  regionCode?: string;

  @IsOptional()
  @IsString()
  availabilitySummary?: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  about?: string;
  city?: string;
  regionCode?: string;
  availabilitySummary?: string;
  planType: PlanType;
  emailVerified: boolean;
}

export interface AuthResponse {
  userId: string;
  token: string;
}

export interface SubscriptionSnapshot {
  userId: string;
  planType: PlanType;
  subscriptionStatus: "inactive" | "active";
}
