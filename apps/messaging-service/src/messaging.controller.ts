import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post
} from "@nestjs/common";
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
import { CurrentUserId } from "@hobby2hobby/nest-tools";
import { MessagingService } from "./messaging.service";

@Controller()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("threads")
  createThread(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateThreadDto
  ): Promise<MessageThread> {
    if (currentUserId !== body.initiatedBy) {
      throw new ForbiddenException("Thread initiator must match the authenticated user");
    }

    return this.messagingService.createThread(body);
  }

  @Get("threads")
  listThreads(@CurrentUserId() currentUserId: string): Promise<MessageThread[]> {
    return this.messagingService.listThreadsForUser(currentUserId);
  }

  @Get("threads/:id")
  async getThread(
    @CurrentUserId() currentUserId: string,
    @Param("id") id: string
  ): Promise<ThreadDetail> {
    const detail = await this.messagingService.getThread(id);

    if (!detail.thread.participantIds.includes(currentUserId)) {
      throw new ForbiddenException("You are not a participant in this thread");
    }

    return detail;
  }

  @Post("threads/:id/messages")
  async createMessage(
    @CurrentUserId() currentUserId: string,
    @Param("id") id: string,
    @Body() body: CreateMessageDto
  ): Promise<Message> {
    if (currentUserId !== body.senderUserId) {
      throw new ForbiddenException("Message sender must match the authenticated user");
    }

    const detail = await this.messagingService.getThread(id);

    if (!detail.thread.participantIds.includes(currentUserId)) {
      throw new ForbiddenException("You are not a participant in this thread");
    }

    return this.messagingService.createMessage(id, body);
  }

  @Post("proposals")
  async createProposal(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateProposalDto
  ): Promise<Proposal> {
    if (currentUserId !== body.proposedBy) {
      throw new ForbiddenException("Proposal owner must match the authenticated user");
    }

    const detail = await this.messagingService.getThread(body.threadId);

    if (!detail.thread.participantIds.includes(currentUserId)) {
      throw new ForbiddenException("You are not a participant in this thread");
    }

    return this.messagingService.createProposal(body);
  }

  @Post("agreements/:proposalId/complete")
  async completeAgreement(
    @CurrentUserId() currentUserId: string,
    @Param("proposalId") proposalId: string,
    @Body() body: CompletionDto
  ): Promise<Proposal> {
    if (currentUserId !== body.userId) {
      throw new ForbiddenException("Agreement completion must match the authenticated user");
    }

    const proposal = await this.messagingService.getProposal(proposalId);
    const detail = await this.messagingService.getThread(proposal.threadId);

    if (!detail.thread.participantIds.includes(currentUserId)) {
      throw new ForbiddenException("You are not a participant in this thread");
    }

    return this.messagingService.completeAgreement(proposalId, body);
  }
}
