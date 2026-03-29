export type PlanType = "free" | "paid";

export interface RegisterUserDto {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  displayName?: string;
  about?: string;
  city?: string;
  regionCode?: string;
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
