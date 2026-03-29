import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  BlockRelationship,
  CreateBlockDto,
  CreateReportDto,
  Report
} from "@hobby2hobby/contracts";
import { PostgresService } from "@hobby2hobby/postgres";

interface ReportRow {
  id: string;
  reporter_user_id: string;
  target_type: "user" | "listing" | "message" | "review";
  target_id: string;
  reason_code: string;
  details: string | null;
  status: "open" | "resolved";
}

interface BlockRow {
  id: string;
  blocker_user_id: string;
  blocked_user_id: string;
}

@Injectable()
export class ModerationRepository implements OnModuleInit {
  constructor(private readonly postgres: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgres.query(`
      create schema if not exists moderation;

      create table if not exists moderation.reports (
        id uuid primary key,
        reporter_user_id uuid not null,
        target_type text not null,
        target_id uuid not null,
        reason_code text not null,
        details text null,
        status text not null default 'open',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists moderation.block_relationships (
        id uuid primary key,
        blocker_user_id uuid not null,
        blocked_user_id uuid not null,
        created_at timestamptz not null default now(),
        unique (blocker_user_id, blocked_user_id)
      );
    `);
  }

  async createReport(input: CreateReportDto): Promise<Report> {
    const id = randomUUID();

    await this.postgres.query(
      `
        insert into moderation.reports (
          id,
          reporter_user_id,
          target_type,
          target_id,
          reason_code,
          details,
          status
        )
        values ($1, $2, $3, $4, $5, $6, 'open')
      `,
      [
        id,
        input.reporterUserId,
        input.targetType,
        input.targetId,
        input.reasonCode,
        input.details ?? null
      ]
    );

    const result = await this.postgres.query<ReportRow>(
      `
        select
          id,
          reporter_user_id,
          target_type,
          target_id,
          reason_code,
          details,
          status
        from moderation.reports
        where id = $1
      `,
      [id]
    );

    return this.mapReport(result.rows[0]);
  }

  async listReports(): Promise<Report[]> {
    const result = await this.postgres.query<ReportRow>(
      `
        select
          id,
          reporter_user_id,
          target_type,
          target_id,
          reason_code,
          details,
          status
        from moderation.reports
        order by created_at desc
      `
    );

    return result.rows.map((row) => this.mapReport(row));
  }

  async createBlock(input: CreateBlockDto): Promise<BlockRelationship | null> {
    const id = randomUUID();

    const result = await this.postgres.query<BlockRow>(
      `
        insert into moderation.block_relationships (
          id,
          blocker_user_id,
          blocked_user_id
        )
        values ($1, $2, $3)
        on conflict (blocker_user_id, blocked_user_id) do nothing
        returning id, blocker_user_id, blocked_user_id
      `,
      [id, input.blockerUserId, input.blockedUserId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      blockerUserId: result.rows[0].blocker_user_id,
      blockedUserId: result.rows[0].blocked_user_id
    };
  }

  private mapReport(row: ReportRow): Report {
    return {
      id: row.id,
      reporterUserId: row.reporter_user_id,
      targetType: row.target_type,
      targetId: row.target_id,
      reasonCode: row.reason_code,
      details: row.details ?? undefined,
      status: row.status
    };
  }
}
