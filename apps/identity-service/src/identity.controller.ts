import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  SubscriptionSnapshot,
  UpdateProfileDto,
  UserProfile
} from "@hobby2hobby/contracts";
import { CurrentUserId, Public } from "@hobby2hobby/nest-tools";
import { IdentityService } from "./identity.service";

@Controller()
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Public()
  @Post("auth/register")
  register(@Body() body: RegisterUserDto): Promise<AuthResponse> {
    return this.identityService.register(body);
  }

  @Public()
  @Post("auth/login")
  login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.identityService.login(body);
  }

  @Get("me")
  getMe(@CurrentUserId() userId: string): Promise<UserProfile> {
    return this.identityService.getMe(userId);
  }

  @Public()
  @Get("profiles/:userId")
  getProfile(@Param("userId") userId: string): Promise<UserProfile> {
    return this.identityService.getProfile(userId);
  }

  @Patch("profiles/:userId")
  updateProfile(
    @CurrentUserId() currentUserId: string,
    @Param("userId") userId: string,
    @Body() body: UpdateProfileDto
  ): Promise<UserProfile> {
    if (currentUserId !== userId) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.identityService.updateProfile(userId, body);
  }

  @Get("subscriptions/:userId")
  getSubscription(
    @CurrentUserId() currentUserId: string,
    @Param("userId") userId: string
  ): Promise<SubscriptionSnapshot> {
    if (currentUserId !== userId) {
      throw new ForbiddenException("You can only view your own subscription");
    }

    return this.identityService.getSubscription(userId);
  }
}
