import { BadRequestException, Injectable } from "@nestjs/common";
import {
  CreateReviewDto,
  CreateVouchDto,
  Review,
  TrustSummary,
  Vouch
} from "@hobby2hobby/contracts";
import { TrustRepository } from "./trust.repository";

@Injectable()
export class TrustService {
  constructor(private readonly trustRepository: TrustRepository) {}

  async createReview(input: CreateReviewDto): Promise<Review> {
    if (input.rating < 1 || input.rating > 5) {
      throw new BadRequestException("Rating must be between 1 and 5");
    }

    const review = await this.trustRepository.createReview(input);

    if (!review) {
      throw new BadRequestException("Review could not be created");
    }

    return review;
  }

  getReviewsForUser(userId: string): Promise<Review[]> {
    return this.trustRepository.getReviewsForUser(userId);
  }

  async createVouch(input: CreateVouchDto): Promise<Vouch> {
    const vouch = await this.trustRepository.createVouch(input);

    if (!vouch) {
      throw new BadRequestException("Vouch already exists");
    }

    return vouch;
  }

  getTrustSummary(userId: string): Promise<TrustSummary> {
    return this.trustRepository.getTrustSummary(userId);
  }
}
