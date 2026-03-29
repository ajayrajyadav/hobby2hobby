import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  CompletionDto,
  CreateMessageDto,
  CreateProposalDto,
  CreateThreadDto,
  Message,
  MessageThread,
  Proposal
} from "@hobby2hobby/contracts";
import { MessagingService } from "./messaging.service";

@Controller()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post("threads")
  createThread(@Body() body: CreateThreadDto): MessageThread {
    return this.messagingService.createThread(body);
  }

  @Get("threads")
  listThreads(): MessageThread[] {
    return this.messagingService.listThreads();
  }

  @Get("threads/:id")
  getThread(@Param("id") id: string): { thread: MessageThread; messages: Message[] } {
    return this.messagingService.getThread(id);
  }

  @Post("threads/:id/messages")
  createMessage(@Param("id") id: string, @Body() body: CreateMessageDto): Message {
    return this.messagingService.createMessage(id, body);
  }

  @Post("proposals")
  createProposal(@Body() body: CreateProposalDto): Proposal {
    return this.messagingService.createProposal(body);
  }

  @Post("agreements/:proposalId/complete")
  completeAgreement(
    @Param("proposalId") proposalId: string,
    @Body() body: CompletionDto
  ): Proposal {
    return this.messagingService.completeAgreement(proposalId, body);
  }
}
