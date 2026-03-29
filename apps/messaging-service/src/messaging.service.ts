import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CompletionDto,
  CreateMessageDto,
  CreateProposalDto,
  CreateThreadDto,
  Message,
  MessageThread,
  Proposal
} from "@hobby2hobby/contracts";
import { MessagingRepository } from "./messaging.repository";

@Injectable()
export class MessagingService {
  constructor(private readonly messagingRepository: MessagingRepository) {}

  createThread(input: CreateThreadDto): Promise<MessageThread> {
    return this.messagingRepository.createThread(input);
  }

  listThreads(): Promise<MessageThread[]> {
    return this.messagingRepository.listThreads();
  }

  async getThread(id: string): Promise<{ thread: MessageThread; messages: Message[] }> {
    const thread = await this.messagingRepository.getThread(id);

    if (!thread) {
      throw new NotFoundException("Thread not found");
    }

    return thread;
  }

  async createMessage(threadId: string, input: CreateMessageDto): Promise<Message> {
    await this.getThread(threadId);
    const message = await this.messagingRepository.createMessage(threadId, input);

    if (!message) {
      throw new NotFoundException("Message could not be created");
    }

    return message;
  }

  async createProposal(input: CreateProposalDto): Promise<Proposal> {
    await this.getThread(input.threadId);
    const proposal = await this.messagingRepository.createProposal(input);

    if (!proposal) {
      throw new NotFoundException("Proposal could not be created");
    }

    return proposal;
  }

  async completeAgreement(proposalId: string, input: CompletionDto): Promise<Proposal> {
    const proposal = await this.messagingRepository.completeAgreement(proposalId, input);

    if (!proposal) {
      throw new NotFoundException("Proposal not found");
    }

    return proposal;
  }
}
