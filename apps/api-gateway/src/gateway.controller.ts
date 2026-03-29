import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { GatewayService } from "./gateway.service";

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get("health")
  health(): { status: string; services: Record<string, string> } {
    return this.gatewayService.health();
  }

  @Post("api/v1/auth/register")
  register(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("identity", "POST", "auth/register", undefined, body);
  }

  @Post("api/v1/auth/login")
  login(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("identity", "POST", "auth/login", undefined, body);
  }

  @Get("api/v1/me")
  getMe(@Query() query: Record<string, string>): Promise<unknown> {
    return this.gatewayService.proxy("identity", "GET", "me", query);
  }

  @Get("api/v1/profiles/:userId")
  getProfile(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("identity", "GET", `profiles/${userId}`);
  }

  @Patch("api/v1/profiles/:userId")
  updateProfile(@Param("userId") userId: string, @Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("identity", "PATCH", `profiles/${userId}`, undefined, body);
  }

  @Get("api/v1/subscriptions/:userId")
  getSubscription(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("identity", "GET", `subscriptions/${userId}`);
  }

  @Post("api/v1/listings")
  createListing(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "POST", "listings", undefined, body);
  }

  @Get("api/v1/listings")
  listListings(): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", "listings");
  }

  @Get("api/v1/listings/:id")
  getListing(@Param("id") id: string): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", `listings/${id}`);
  }

  @Patch("api/v1/listings/:id/archive")
  archiveListing(@Param("id") id: string): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "PATCH", `listings/${id}/archive`);
  }

  @Get("api/v1/search")
  searchListings(@Query() query: Record<string, string>): Promise<unknown> {
    return this.gatewayService.proxy("marketplace", "GET", "search", query);
  }

  @Post("api/v1/threads")
  createThread(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "POST", "threads", undefined, body);
  }

  @Get("api/v1/threads")
  listThreads(): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "GET", "threads");
  }

  @Get("api/v1/threads/:id")
  getThread(@Param("id") id: string): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "GET", `threads/${id}`);
  }

  @Post("api/v1/threads/:id/messages")
  createMessage(@Param("id") id: string, @Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "POST", `threads/${id}/messages`, undefined, body);
  }

  @Post("api/v1/proposals")
  createProposal(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("messaging", "POST", "proposals", undefined, body);
  }

  @Post("api/v1/agreements/:proposalId/complete")
  completeAgreement(
    @Param("proposalId") proposalId: string,
    @Body() body: unknown
  ): Promise<unknown> {
    return this.gatewayService.proxy(
      "messaging",
      "POST",
      `agreements/${proposalId}/complete`,
      undefined,
      body
    );
  }

  @Post("api/v1/reviews")
  createReview(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("trust", "POST", "reviews", undefined, body);
  }

  @Get("api/v1/users/:userId/reviews")
  getReviewsForUser(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("trust", "GET", `users/${userId}/reviews`);
  }

  @Post("api/v1/vouches")
  createVouch(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("trust", "POST", "vouches", undefined, body);
  }

  @Get("api/v1/users/:userId/trust-summary")
  getTrustSummary(@Param("userId") userId: string): Promise<unknown> {
    return this.gatewayService.proxy("trust", "GET", `users/${userId}/trust-summary`);
  }

  @Post("api/v1/reports")
  createReport(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "POST", "reports", undefined, body);
  }

  @Get("api/v1/reports")
  listReports(): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "GET", "reports");
  }

  @Post("api/v1/blocks")
  createBlock(@Body() body: unknown): Promise<unknown> {
    return this.gatewayService.proxy("moderation", "POST", "blocks", undefined, body);
  }
}
