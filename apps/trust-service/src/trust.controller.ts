import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post
} from "@nestjs/common";
import {
  CreateReviewDto,
  CreateVouchDto,
  Review,
  TrustSummary,
  Vouch
} from "@hobby2hobby/contracts";
import { CurrentUserId, Public } from "@hobby2hobby/nest-tools";
import { TrustService } from "./trust.service";

@Controller()
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Post("reviews")
  createReview(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateReviewDto
  ): Promise<Review> {
    if (currentUserId !== body.reviewerUserId) {
      throw new ForbiddenException("Review author must match the authenticated user");
    }

    return this.trustService.createReview(body);
  }

  @Public()
  @Get("users/:userId/reviews")
  getReviewsForUser(@Param("userId") userId: string): Promise<Review[]> {
    return this.trustService.getReviewsForUser(userId);
  }

  @Post("vouches")
  createVouch(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateVouchDto
  ): Promise<Vouch> {
    if (currentUserId !== body.voucherUserId) {
      throw new ForbiddenException("Voucher must match the authenticated user");
    }

    return this.trustService.createVouch(body);
  }

  @Public()
  @Get("users/:userId/trust-summary")
  getTrustSummary(@Param("userId") userId: string): Promise<TrustSummary> {
    return this.trustService.getTrustSummary(userId);
  }
}
