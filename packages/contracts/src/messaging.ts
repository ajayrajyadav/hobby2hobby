import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateThreadDto {
  @IsOptional()
  @IsString()
  listingId?: string;

  @IsString()
  @MinLength(1)
  initiatedBy!: string;

  @IsArray()
  participantIds!: string[];

  @IsOptional()
  @IsString()
  initialMessage?: string;
}

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  senderUserId!: string;

  @IsString()
  @MinLength(1)
  body!: string;
}

export class CreateProposalDto {
  @IsString()
  @MinLength(1)
  threadId!: string;

  @IsString()
  @MinLength(1)
  proposedBy!: string;

  @IsString()
  @MinLength(1)
  serviceA!: string;

  @IsString()
  @MinLength(1)
  serviceB!: string;

  @IsOptional()
  @IsString()
  expectedTiming?: string;

  @IsOptional()
  @IsString()
  conditions?: string;
}

export class CompletionDto {
  @IsString()
  @MinLength(1)
  userId!: string;
}

export interface MessageThread {
  id: string;
  listingId?: string;
  participantIds: string[];
  status: "open" | "closed";
}

export interface Message {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
}

export interface Proposal {
  id: string;
  threadId: string;
  proposedBy: string;
  serviceA: string;
  serviceB: string;
  expectedTiming?: string;
  conditions?: string;
  status: "pending" | "accepted" | "completed";
  completedByUserIds: string[];
}

export interface ThreadDetail {
  thread: MessageThread;
  messages: Message[];
  proposals: Proposal[];
}
