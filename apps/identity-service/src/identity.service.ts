import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { scryptSync, timingSafeEqual } from "crypto";
import {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  SubscriptionSnapshot,
  UpdateProfileDto,
  UserProfile
} from "@hobby2hobby/contracts";
import { IdentityRepository } from "./identity.repository";

@Injectable()
export class IdentityService {
  constructor(private readonly identityRepository: IdentityRepository) {}

  async register(input: RegisterUserDto): Promise<AuthResponse> {
    const profile = await this.identityRepository.createUser(input);

    return {
      userId: profile.userId,
      token: `dev-token-${profile.userId}`
    };
  }

  async login(input: LoginDto): Promise<AuthResponse> {
    const authRecord = await this.identityRepository.findPasswordHashByEmail(input.email);

    if (!authRecord) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const suppliedHash = scryptSync(input.password, input.email, 64);
    const storedHash = Buffer.from(authRecord.passwordHash, "hex");

    if (
      suppliedHash.length !== storedHash.length ||
      !timingSafeEqual(suppliedHash, storedHash)
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      userId: authRecord.userId,
      token: `dev-token-${authRecord.userId}`
    };
  }

  getMe(userId: string): Promise<UserProfile> {
    return this.getProfile(userId);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.identityRepository.findProfileByUserId(userId);

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }

  async updateProfile(userId: string, input: UpdateProfileDto): Promise<UserProfile> {
    const updated = await this.identityRepository.updateProfile(userId, input);

    if (!updated) {
      throw new NotFoundException("Profile not found");
    }

    return updated;
  }

  async getSubscription(userId: string): Promise<SubscriptionSnapshot> {
    const subscription = await this.identityRepository.getSubscription(userId);

    if (!subscription) {
      throw new NotFoundException("Subscription not found");
    }

    return subscription;
  }
}
