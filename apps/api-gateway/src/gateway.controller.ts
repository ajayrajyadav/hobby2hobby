import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {
  CompletionDto,
  CreateBlockDto,
  CreateListingDto,
  CreateMessageDto,
  CreateProposalDto,
  CreateReportDto,
  CreateReviewDto,
  CreateThreadDto,
  CreateVouchDto,
  LoginDto,
  RegisterUserDto,
  SearchListingsQuery,
  UpdateProfileDto
} from "@hobby2hobby/contracts";
import { Public } from "@hobby2hobby/nest-tools";
import { GatewayService } from "./gateway.service";

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Public()
  @Get("health")
  health(): { status: string; services: Record<string, string> } {
    return this.gatewayService.health();
  }

  @Public()
  @Post("api/v1/auth/register")
  register(@Body() body: RegisterUserDto): Promise<unknown> {
    return this.gatewayService.proxy("identity", "POST", "auth/register", undefined, body);
  }

  @Public()
  @Post("api/v1/auth/login")
  login(@Body() body: LoginDto): Promise<unknown> {
    return this.gatewayService.proxy("identity", "POST", "auth/login", undefined, body);
  }

  @Get("api/v1/me")
  getMe(@Headers("authorization") authorization?: string): Promise<unknown> {
    return this.gatewayService.proxy("identity", "GET", "me", undefined, undefined, authorization);
  }

  @Public()
  @Get("api/v1/profiles/:userId")
  getProfile(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("identity", "GET", `profiles/${userId}`);
  }

  @Patch("api/v1/profiles/:userId")
  updateProfile(
    @Headers("authorization") authorization: string | undefined,
    @Param("userId") userId: string,
    @Body() body: UpdateProfileDto
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "identity",
      "PATCH",
      `profiles/${userId}`,
      undefined,
      body,
      authorization
    );
  }

  @Get("api/v1/subscriptions/:userId")
  getSubscription(
    @Headers("authorization") authorization: string | undefined,
    @Param("userId") userId: string
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "identity",
      "GET",
      `subscriptions/${userId}`,
      undefined,
      undefined,
      authorization
    );
  }

  @Post("api/v1/listings")
  createListing(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateListingDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "POST", "listings", undefined, body, authorization);
  }

  @Public()
  @Get("api/v1/listings")
  listListings(): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", "listings");
  }

  @Public()
  @Get("api/v1/listings/:id")
  getListing(@Param("id") id: string): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", `listings/${id}`);
  }

  @Patch("api/v1/listings/:id/archive")
  archiveListing(
    @Headers("authorization") authorization: string | undefined,
    @Param("id") id: string
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "marketplace",
      "PATCH",
      `listings/${id}/archive`,
      undefined,
      undefined,
      authorization
    );
  }

  @Public()
  @Get("api/v1/search")
  searchListings(@Query() query: SearchListingsQuery): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", "search", query as Record<string, string>);
  }

  @Post("api/v1/threads")
  createThread(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateThreadDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "POST", "threads", undefined, body, authorization);
  }

  @Get("api/v1/threads")
  listThreads(@Headers("authorization") authorization?: string): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "GET", "threads", undefined, undefined, authorization);
  }

  @Get("api/v1/threads/:id")
  getThread(
    @Headers("authorization") authorization: string | undefined,
    @Param("id") id: string
  ): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "GET", `threads/${id}`, undefined, undefined, authorization);
  }

  @Post("api/v1/threads/:id/messages")
  createMessage(
    @Headers("authorization") authorization: string | undefined,
    @Param("id") id: string,
    @Body() body: CreateMessageDto
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "messaging",
      "POST",
      `threads/${id}/messages`,
      undefined,
      body,
      authorization
    );
  }

  @Post("api/v1/proposals")
  createProposal(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateProposalDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "POST", "proposals", undefined, body, authorization);
  }

  @Post("api/v1/agreements/:proposalId/complete")
  completeAgreement(
    @Headers("authorization") authorization: string | undefined,
    @Param("proposalId") proposalId: string,
    @Body() body: CompletionDto
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "messaging",
      "POST",
      `agreements/${proposalId}/complete`,
      undefined,
      body,
      authorization
    );
  }

  @Post("api/v1/reviews")
  createReview(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateReviewDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("trust", "POST", "reviews", undefined, body, authorization);
  }

  @Public()
  @Get("api/v1/users/:userId/reviews")
  getReviewsForUser(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("trust", "GET", `users/${userId}/reviews`);
  }

  @Post("api/v1/vouches")
  createVouch(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateVouchDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("trust", "POST", "vouches", undefined, body, authorization);
  }

  @Public()
  @Get("api/v1/users/:userId/trust-summary")
  getTrustSummary(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("trust", "GET", `users/${userId}/trust-summary`);
  }

  @Post("api/v1/reports")
  createReport(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateReportDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "POST", "reports", undefined, body, authorization);
  }

  @Get("api/v1/reports")
  listReports(@Headers("authorization") authorization?: string): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "GET", "reports", undefined, undefined, authorization);
  }

  @Post("api/v1/blocks")
  createBlock(
    @Headers("authorization") authorization: string | undefined,
    @Body() body: CreateBlockDto
  ): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "POST", "blocks", undefined, body, authorization);
  }
}
