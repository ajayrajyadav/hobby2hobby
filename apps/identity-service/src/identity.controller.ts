import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  SubscriptionSnapshot,
  UpdateProfileDto,
  UserProfile
} from "@hobby2hobby/contracts";
import { IdentityService } from "./identity.service";

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post("auth/register")
  register(@Body() body: RegisterUserDto): AuthResponse {
    return this.identityService.register(body);
  }

  @Post("auth/login")
  login(@Body() body: LoginDto): AuthResponse {
    return this.identityService.login(body);
  }

  @Get("me")
  getMe(@Query("userId") userId: string): UserProfile {
    return this.identityService.getMe(userId);
  }

  @Get("profiles/:userId")
  getProfile(@Param("userId") userId: string): UserProfile {
    return this.identityService.getProfile(userId);
  }

  @Patch("profiles/:userId")
  updateProfile(
    @Param("userId") userId: string,
    @Body() body: UpdateProfileDto
  ): UserProfile {
    return this.identityService.updateProfile(userId, body);
  }

  @Get("subscriptions/:userId")
  getSubscription(@Param("userId") userId: string): SubscriptionSnapshot {
    return this.identityService.getSubscription(userId);
  }
}
