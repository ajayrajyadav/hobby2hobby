import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CreateReviewDto,
  CreateVouchDto,
  Review,
  TrustSummary,
  Vouch
} from "@hobby2hobby/contracts";

@Injectable()
export class TrustService {
  private readonly reviews: Review[] = [];
  private readonly vouches: Vouch[] = [];

  createReview(input: CreateReviewDto): Review {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException("Rating must be between 1 and 5");
    }

    const review: Review = {
      id: randomUUID(),
      ...input
    };

    this.reviews.push(review);

    return review;
  }

  getReviewsForUser(userId: string): Review[] {
    return this.reviews.filter((review) => review.revieweeUserId === userId);
  }

  createVouch(input: CreateVouchDto): Vouch {
    const duplicate = this.vouches.find(
      (vouch) =>
        vouch.voucherUserId === input.voucherUserId &&
        vouch.vouchedUserId === input.vouchedUserId
    );

    if (duplicate) {
      throw new BadRequestException("Vouch already exists");
    }

    const vouch: Vouch = {
      id: randomUUID(),
      ...input
    };

    this.vouches.push(vouch);

    return vouch;
  }

  getTrustSummary(userId: string): TrustSummary {
    const reviews = this.getReviewsForUser(userId);
    const vouchCount = this.vouches.filter(
      (vouch) => vouch.vouchedUserId === userId
    ).length;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return {
      userId,
      reviewCount: reviews.length,
      averageRating,
      vouchCount
    };
  }
}
