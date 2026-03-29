import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  SubscriptionSnapshot,
  UpdateProfileDto,
  UserProfile
} from "@hobby2hobby/contracts";

@Injectable()
export class IdentityService {
  private readonly profiles = new Map<string, UserProfile>();

  register(input: RegisterUserDto): AuthResponse {
    const userId = randomUUID();

    this.profiles.set(userId, {
      userId,
      email: input.email,
      displayName: input.displayName,
      planType: "free",
      emailVerified: false
    });

    return {
      userId,
      token: `dev-token-${userId}`
    };
  }

  login(input: LoginDto): AuthResponse {
    const profile = Array.from(this.profiles.values()).find(
      (candidate) => candidate.email === input.email
    );

    if (!profile) {
      throw new NotFoundException("User not found");
    }

    return {
      userId: profile.userId,
      token: `dev-token-${profile.userId}`
    };
  }

  getMe(userId: string): UserProfile {
    return this.getProfile(userId);
  }

  getProfile(userId: string): UserProfile {
    const profile = this.profiles.get(userId);

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }

  updateProfile(userId: string, input: UpdateProfileDto): UserProfile {
    const current = this.getProfile(userId);
    const updated: UserProfile = {
      ...current,
      ...input
    };

    this.profiles.set(userId, updated);

    return updated;
  }

  getSubscription(userId: string): SubscriptionSnapshot {
    const profile = this.getProfile(userId);

    return {
      userId: profile.userId,
      planType: profile.planType,
      subscriptionStatus: profile.planType === "paid" ? "active" : "inactive"
    };
  }
}
