import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CompletionDto,
  CreateMessageDto,
  CreateProposalDto,
  CreateThreadDto,
  Message,
  MessageThread,
  Proposal,
  ThreadDetail
} from "@hobby2hobby/contracts";
import { PostgresService } from "@hobby2hobby/postgres";

interface ThreadRow {
  id: string;
  listing_id: string | null;
  status: "open" | "closed";
}

interface MessageRow {
  id: string;
  thread_id: string;
  sender_user_id: string;
  body: string;
}

interface ProposalRow {
  id: string;
  thread_id: string;
  proposed_by: string;
  service_a: string;
  service_b: string;
  expected_timing: string | null;
  conditions: string | null;
  status: "pending" | "accepted" | "completed";
}

@Injectable()
export class MessagingRepository implements OnModuleInit {
  constructor(private readonly postgres: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgres.query(`
      create schema if not exists messaging;

      create table if not exists messaging.threads (
        id uuid primary key,
        listing_id uuid null,
        status text not null default 'open',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists messaging.thread_participants (
        id uuid primary key,
        thread_id uuid not null references messaging.threads(id) on delete cascade,
        user_id uuid not null,
        created_at timestamptz not null default now(),
        unique (thread_id, user_id)
      );

      create table if not exists messaging.messages (
        id uuid primary key,
        thread_id uuid not null references messaging.threads(id) on delete cascade,
        sender_user_id uuid not null,
        body text not null,
        created_at timestamptz not null default now()
      );

      create table if not exists messaging.proposals (
        id uuid primary key,
        thread_id uuid not null references messaging.threads(id) on delete cascade,
        proposed_by uuid not null,
        service_a text not null,
        service_b text not null,
        expected_timing text null,
        conditions text null,
        status text not null default 'pending',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create table if not exists messaging.completion_confirmations (
        id uuid primary key,
        proposal_id uuid not null references messaging.proposals(id) on delete cascade,
        user_id uuid not null,
        confirmed_at timestamptz not null default now(),
        unique (proposal_id, user_id)
      );
    `);
  }

  async createThread(input: CreateThreadDto): Promise<MessageThread> {
    const threadId = randomUUID();
    const participantIds = Array.from(new Set([input.initiatedBy, ...input.participantIds]));

    await this.postgres.withTransaction(async (client) => {
      await client.query(
        `
          insert into messaging.threads (id, listing_id, status)
          values ($1, $2, 'open')
        `,
        [threadId, input.listingId ?? null]
      );

      for (const participantId of participantIds) {
        await client.query(
          `
            insert into messaging.thread_participants (id, thread_id, user_id)
            values ($1, $2, $3)
          `,
          [randomUUID(), threadId, participantId]
        );
      }

      if (input.initialMessage) {
        await client.query(
          `
            insert into messaging.messages (id, thread_id, sender_user_id, body)
            values ($1, $2, $3, $4)
          `,
          [randomUUID(), threadId, input.initiatedBy, input.initialMessage]
        );
      }
    });

    const thread = await this.getThread(threadId);
    if (!thread) {
      throw new Error("Thread creation failed");
    }

    return thread.thread;
  }

  async listThreadsForUser(userId: string): Promise<MessageThread[]> {
    const result = await this.postgres.query<ThreadRow>(
      `
        select t.id, t.listing_id, t.status
        from messaging.threads t
        where exists (
          select 1
          from messaging.thread_participants p
          where p.thread_id = t.id and p.user_id = $1
        )
        order by t.created_at desc
      `,
      [userId]
    );

    return Promise.all(result.rows.map((row) => this.mapThread(row)));
  }

  async getThread(id: string): Promise<ThreadDetail | null> {
    const threadResult = await this.postgres.query<ThreadRow>(
      `
        select id, listing_id, status
        from messaging.threads
        where id = $1
      `,
      [id]
    );

    if (threadResult.rows.length === 0) {
      return null;
    }

    const messageResult = await this.postgres.query<MessageRow>(
      `
        select id, thread_id, sender_user_id, body
        from messaging.messages
        where thread_id = $1
        order by created_at asc
      `,
      [id]
    );

    const proposalResult = await this.postgres.query<ProposalRow>(
      `
        select
          id,
          thread_id,
          proposed_by,
          service_a,
          service_b,
          expected_timing,
          conditions,
          status
        from messaging.proposals
        where thread_id = $1
        order by created_at desc
      `,
      [id]
    );

    return {
      thread: await this.mapThread(threadResult.rows[0]),
      messages: messageResult.rows.map((row) => ({
        id: row.id,
        threadId: row.thread_id,
        senderUserId: row.sender_user_id,
        body: row.body
      })),
      proposals: await Promise.all(proposalResult.rows.map((row) => this.mapProposal(row)))
    };
  }

  async createMessage(threadId: string, input: CreateMessageDto): Promise<Message | null> {
    const messageId = randomUUID();

    await this.postgres.query(
      `
        insert into messaging.messages (id, thread_id, sender_user_id, body)
        values ($1, $2, $3, $4)
      `,
      [messageId, threadId, input.senderUserId, input.body]
    );

    const result = await this.postgres.query<MessageRow>(
      `
        select id, thread_id, sender_user_id, body
        from messaging.messages
        where id = $1
      `,
      [messageId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      threadId: result.rows[0].thread_id,
      senderUserId: result.rows[0].sender_user_id,
      body: result.rows[0].body
    };
  }

  async createProposal(input: CreateProposalDto): Promise<Proposal | null> {
    const proposalId = randomUUID();

    await this.postgres.query(
      `
        insert into messaging.proposals (
          id,
          thread_id,
          proposed_by,
          service_a,
          service_b,
          expected_timing,
          conditions,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `,
      [
        proposalId,
        input.threadId,
        input.proposedBy,
        input.serviceA,
        input.serviceB,
        input.expectedTiming ?? null,
        input.conditions ?? null
      ]
    );

    return this.getProposalById(proposalId);
  }

  async completeAgreement(proposalId: string, input: CompletionDto): Promise<Proposal | null> {
    await this.postgres.withTransaction(async (client) => {
      await client.query(
        `
          insert into messaging.completion_confirmations (id, proposal_id, user_id)
          values ($1, $2, $3)
          on conflict (proposal_id, user_id) do nothing
        `,
        [randomUUID(), proposalId, input.userId]
      );

      const confirmations = await client.query<{ count: string }>(
        `
          select count(*)::text as count
          from messaging.completion_confirmations
          where proposal_id = $1
        `,
        [proposalId]
      );

      if (Number(confirmations.rows[0]?.count ?? "0") >= 2) {
        await client.query(
          `
            update messaging.proposals
            set status = 'completed', updated_at = now()
            where id = $1
          `,
          [proposalId]
        );
      }
    });

    return this.getProposalById(proposalId);
  }

  async getProposalById(proposalId: string): Promise<Proposal | null> {
    const result = await this.postgres.query<ProposalRow>(
      `
        select
          id,
          thread_id,
          proposed_by,
          service_a,
          service_b,
          expected_timing,
          conditions,
          status
        from messaging.proposals
        where id = $1
      `,
      [proposalId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapProposal(result.rows[0]);
  }

  private async mapThread(row: ThreadRow): Promise<MessageThread> {
    const participants = await this.postgres.query<{ user_id: string }>(
      `
        select user_id
        from messaging.thread_participants
        where thread_id = $1
        order by created_at asc
      `,
      [row.id]
    );

    return {
      id: row.id,
      listingId: row.listing_id ?? undefined,
      participantIds: participants.rows.map((participant) => participant.user_id),
      status: row.status
    };
  }

  private async mapProposal(row: ProposalRow): Promise<Proposal> {
    const confirmations = await this.postgres.query<{ user_id: string }>(
      `
        select user_id
        from messaging.completion_confirmations
        where proposal_id = $1
        order by confirmed_at asc
      `,
      [row.id]
    );

    return {
      id: row.id,
      threadId: row.thread_id,
      proposedBy: row.proposed_by,
      serviceA: row.service_a,
      serviceB: row.service_b,
      expectedTiming: row.expected_timing ?? undefined,
      conditions: row.conditions ?? undefined,
      status: row.status,
      completedByUserIds: confirmations.rows.map((confirmation) => confirmation.user_id)
    };
  }
}
