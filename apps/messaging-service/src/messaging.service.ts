import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CompletionDto,
  CreateMessageDto,
  CreateProposalDto,
  CreateThreadDto,
  Message,
  MessageThread,
  Proposal
} from "@hobby2hobby/contracts";

@Injectable()
export class MessagingService {
  private readonly threads = new Map<string, MessageThread>();
  private readonly messages = new Map<string, Message[]>();
  private readonly proposals = new Map<string, Proposal>();

  createThread(input: CreateThreadDto): MessageThread {
    const participantIds = Array.from(new Set([input.initiatedBy, ...input.participantIds]));
    const thread: MessageThread = {
      id: randomUUID(),
      listingId: input.listingId,
      participantIds,
      status: "open"
    };

    this.threads.set(thread.id, thread);
    this.messages.set(thread.id, []);

    if (input.initialMessage) {
      this.createMessage(thread.id, {
        senderUserId: input.initiatedBy,
        body: input.initialMessage
      });
    }

    return thread;
  }

  listThreads(): MessageThread[] {
    return Array.from(this.threads.values());
  }

  getThread(id: string): { thread: MessageThread; messages: Message[] } {
    const thread = this.threads.get(id);

    if (!thread) {
      throw new NotFoundException("Thread not found");
    }

    return {
      thread,
      messages: this.messages.get(id) ?? []
    };
  }

  createMessage(threadId: string, input: CreateMessageDto): Message {
    this.getThread(threadId);

    const message: Message = {
      id: randomUUID(),
      threadId,
      senderUserId: input.senderUserId,
      body: input.body
    };

    const existing = this.messages.get(threadId) ?? [];
    existing.push(message);
    this.messages.set(threadId, existing);

    return message;
  }

  createProposal(input: CreateProposalDto): Proposal {
    this.getThread(input.threadId);

    const proposal: Proposal = {
      id: randomUUID(),
      threadId: input.threadId,
      proposedBy: input.proposedBy,
      serviceA: input.serviceA,
      serviceB: input.serviceB,
      expectedTiming: input.expectedTiming,
      conditions: input.conditions,
      status: "pending",
      completedByUserIds: []
    };

    this.proposals.set(proposal.id, proposal);

    return proposal;
  }

  completeAgreement(proposalId: string, input: CompletionDto): Proposal {
    const proposal = this.proposals.get(proposalId);

    if (!proposal) {
      throw new NotFoundException("Proposal not found");
    }

    const completedByUserIds = Array.from(
      new Set([...proposal.completedByUserIds, input.userId])
    );

    const updated: Proposal = {
      ...proposal,
      completedByUserIds,
      status: completedByUserIds.length >= 2 ? "completed" : proposal.status
    };

    this.proposals.set(proposalId, updated);

    return updated;
  }
}
