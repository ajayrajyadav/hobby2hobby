export interface CreateThreadDto {
  listingId?: string;
  initiatedBy: string;
  participantIds: string[];
  initialMessage?: string;
}

export interface CreateMessageDto {
  senderUserId: string;
  body: string;
}

export interface CreateProposalDto {
  threadId: string;
  proposedBy: string;
  serviceA: string;
  serviceB: string;
  expectedTiming?: string;
  conditions?: string;
}

export interface CompletionDto {
  userId: string;
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
