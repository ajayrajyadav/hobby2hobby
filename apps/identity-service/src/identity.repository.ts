import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID, scryptSync } from "crypto";
import { PlanType, SubscriptionSnapshot, UpdateProfileDto, UserProfile } from "@hobby2hobby/contracts";
import { PostgresService } from "@hobby2hobby/postgres";

interface IdentityProfileRow {
  user_id: string;
  email: string;
  display_name: string;
  about: string | null;
  city: string | null;
  region_code: string | null;
  availability_summary: string | null;
  plan_type: PlanType;
  email_verified_at: Date | null;
}

@Injectable()
export class IdentityRepository implements OnModuleInit {
  constructor(private readonly postgres: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgres.query(`
      create schema if not exists identity;
      create extension if not exists citext;

      create table if not exists identity.users (
        id uuid primary key,
        email citext not null unique,
        password_hash text not null,
        email_verified_at timestamptz null,
        status text not null default 'active',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists identity.profiles (
        id uuid primary key,
        user_id uuid not null unique references identity.users(id),
        display_name text not null,
        about text null,
        city text null,
        region_code text null,
        availability_summary text null,
        plan_type text not null default 'free',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists identity.subscriptions (
        id uuid primary key,
        user_id uuid not null unique references identity.users(id),
        status text not null default 'inactive',
        plan_type text not null default 'free',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);
  }

  async createUser(input: {
    email: string;
    password: string;
    displayName: string;
  }): Promise<UserProfile> {
    const userId = randomUUID();
    const profileId = randomUUID();
    const subscriptionId = randomUUID();
    const passwordHash = scryptSync(input.password, input.email, 64).toString("hex");

    await this.postgres.withTransaction(async (client) => {
      await client.query(
        `
          insert into identity.users (id, email, password_hash)
          values ($1, $2, $3)
        `,
        [userId, input.email, passwordHash]
      );

      await client.query(
        `
          insert into identity.profiles (id, user_id, display_name)
          values ($1, $2, $3)
        `,
        [profileId, userId, input.displayName]
      );

      await client.query(
        `
          insert into identity.subscriptions (id, user_id, status, plan_type)
          values ($1, $2, 'inactive', 'free')
        `,
        [subscriptionId, userId]
      );
    });

    const profile = await this.findProfileByUserId(userId);
    if (!profile) {
      throw new Error("Profile creation failed");
    }

    return profile;
  }

  async findPasswordHashByEmail(email: string): Promise<{ userId: string; passwordHash: string } | null> {
    const result = await this.postgres.query<{ id: string; password_hash: string }>(
      `
        select id, password_hash
        from identity.users
        where email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      userId: result.rows[0].id,
      passwordHash: result.rows[0].password_hash
    };
  }

  async findProfileByUserId(userId: string): Promise<UserProfile | null> {
    const result = await this.postgres.query<IdentityProfileRow>(
      `
        select
          u.id as user_id,
          u.email,
          p.display_name,
          p.about,
          p.city,
          p.region_code,
          p.availability_summary,
          p.plan_type,
          u.email_verified_at
        from identity.users u
        inner join identity.profiles p on p.user_id = u.id
        where u.id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapProfile(result.rows[0]);
  }

  async updateProfile(userId: string, input: UpdateProfileDto): Promise<UserProfile | null> {
    await this.postgres.query(
      `
        update identity.profiles
        set
          display_name = coalesce($2, display_name),
          about = coalesce($3, about),
          city = coalesce($4, city),
          region_code = coalesce($5, region_code),
          availability_summary = coalesce($6, availability_summary),
          updated_at = now()
        where user_id = $1
      `,
      [
        userId,
        input.displayName ?? null,
        input.about ?? null,
        input.city ?? null,
        input.regionCode ?? null,
        input.availabilitySummary ?? null
      ]
    );

    return this.findProfileByUserId(userId);
  }

  async getSubscription(userId: string): Promise<SubscriptionSnapshot | null> {
    const result = await this.postgres.query<{
      user_id: string;
      status: "inactive" | "active";
      plan_type: PlanType;
    }>(
      `
        select user_id, status, plan_type
        from identity.subscriptions
        where user_id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      userId: result.rows[0].user_id,
      planType: result.rows[0].plan_type,
      subscriptionStatus: result.rows[0].status
    };
  }

  private mapProfile(row: IdentityProfileRow): UserProfile {
    return {
      userId: row.user_id,
      email: row.email,
      displayName: row.display_name,
      about: row.about ?? undefined,
      city: row.city ?? undefined,
      regionCode: row.region_code ?? undefined,
      availabilitySummary: row.availability_summary ?? undefined,
      planType: row.plan_type,
      emailVerified: Boolean(row.email_verified_at)
    };
  }
}
