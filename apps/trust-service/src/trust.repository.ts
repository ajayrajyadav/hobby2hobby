import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CreateReviewDto,
  CreateVouchDto,
  Review,
  TrustSummary,
  Vouch
} from "@hobby2hobby/contracts";
import { PostgresService } from "@hobby2hobby/postgres";

interface ReviewRow {
  id: string;
  proposal_id: string;
  reviewer_user_id: string;
  reviewee_user_id: string;
  rating: number;
  comment: string | null;
}

interface VouchRow {
  id: string;
  voucher_user_id: string;
  vouched_user_id: string;
  reason: string | null;
}

@Injectable()
export class TrustRepository implements OnModuleInit {
  constructor(private readonly postgres: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgres.query(`
      create schema if not exists trust;

      create table if not exists trust.reviews (
        id uuid primary key,
        proposal_id uuid not null,
        reviewer_user_id uuid not null,
        reviewee_user_id uuid not null,
        rating int not null,
        comment text null,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists trust.vouches (
        id uuid primary key,
        voucher_user_id uuid not null,
        vouched_user_id uuid not null,
        reason text null,
        created_at timestamptz not null default now(),
        unique (voucher_user_id, vouched_user_id)
      );
    `);
  }

  async createReview(input: CreateReviewDto): Promise<Review | null> {
    const id = randomUUID();

    await this.postgres.query(
      `
        insert into trust.reviews (
          id,
          proposal_id,
          reviewer_user_id,
          reviewee_user_id,
          rating,
          comment
        )
        values ($1, $2, $3, $4, $5, $6)
      `,
      [
        id,
        input.proposalId,
        input.reviewerUserId,
        input.revieweeUserId,
        input.rating,
        input.comment ?? null
      ]
    );

    const result = await this.postgres.query<ReviewRow>(
      `
        select id, proposal_id, reviewer_user_id, reviewee_user_id, rating, comment
        from trust.reviews
        where id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapReview(result.rows[0]);
  }

  async getReviewsForUser(userId: string): Promise<Review[]> {
    const result = await this.postgres.query<ReviewRow>(
      `
        select id, proposal_id, reviewer_user_id, reviewee_user_id, rating, comment
        from trust.reviews
        where reviewee_user_id = $1
        order by created_at desc
      `,
      [userId]
    );

    return result.rows.map((row) => this.mapReview(row));
  }

  async createVouch(input: CreateVouchDto): Promise<Vouch | null> {
    const id = randomUUID();

    const result = await this.postgres.query<VouchRow>(
      `
        insert into trust.vouches (id, voucher_user_id, vouched_user_id, reason)
        values ($1, $2, $3, $4)
        on conflict (voucher_user_id, vouched_user_id) do nothing
        returning id, voucher_user_id, vouched_user_id, reason
      `,
      [id, input.voucherUserId, input.vouchedUserId, input.reason ?? null]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapVouch(result.rows[0]);
  }

  async getTrustSummary(userId: string): Promise<TrustSummary> {
    const [reviews, vouches] = await Promise.all([
      this.postgres.query<{ review_count: string; average_rating: string | null }>(
        `
          select count(*)::text as review_count, avg(rating)::text as average_rating
          from trust.reviews
          where reviewee_user_id = $1
        `,
        [userId]
      ),
      this.postgres.query<{ vouch_count: string }>(
        `
          select count(*)::text as vouch_count
          from trust.vouches
          where vouched_user_id = $1
        `,
        [userId]
      )
    ]);

    return {
      userId,
      reviewCount: Number(reviews.rows[0]?.review_count ?? "0"),
      averageRating: Number(reviews.rows[0]?.average_rating ?? "0"),
      vouchCount: Number(vouches.rows[0]?.vouch_count ?? "0")
    };
  }

  private mapReview(row: ReviewRow): Review {
    return {
      id: row.id,
      proposalId: row.proposal_id,
      reviewerUserId: row.reviewer_user_id,
      revieweeUserId: row.reviewee_user_id,
      rating: row.rating,
      comment: row.comment ?? undefined
    };
  }

  private mapVouch(row: VouchRow): Vouch {
    return {
      id: row.id,
      voucherUserId: row.voucher_user_id,
      vouchedUserId: row.vouched_user_id,
      reason: row.reason ?? undefined
    };
  }
}
