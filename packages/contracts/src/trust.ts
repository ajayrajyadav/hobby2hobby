export interface CreateReviewDto {
  proposalId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  rating: number;
  comment?: string;
}

export interface CreateVouchDto {
  voucherUserId: string;
  vouchedUserId: string;
  reason?: string;
}

export interface Review {
  id: string;
  proposalId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  rating: number;
  comment?: string;
}

export interface Vouch {
  id: string;
  voucherUserId: string;
  vouchedUserId: string;
  reason?: string;
}

export interface TrustSummary {
  userId: string;
  reviewCount: number;
  averageRating: number;
  vouchCount: number;
}
