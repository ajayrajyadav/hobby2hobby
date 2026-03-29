import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  CreateReviewDto,
  CreateVouchDto,
  Review,
  TrustSummary,
  Vouch
} from "@hobby2hobby/contracts";
import { TrustService } from "./trust.service";

@Controller()
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Post("reviews")
  createReview(@Body() body: CreateReviewDto): Review {
    return this.trustService.createReview(body);
  }

  @Get("users/:userId/reviews")
  getReviewsForUser(@Param("userId") userId: string): Review[] {
    return this.trustService.getReviewsForUser(userId);
  }

  @Post("vouches")
  createVouch(@Body() body: CreateVouchDto): Vouch {
    return this.trustService.createVouch(body);
  }

  @Get("users/:userId/trust-summary")
  getTrustSummary(@Param("userId") userId: string): TrustSummary {
    return this.trustService.getTrustSummary(userId);
  }
}
