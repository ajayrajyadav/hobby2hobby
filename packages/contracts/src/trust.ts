import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @MinLength(1)
  proposalId!: string;

  @IsString()
  @MinLength(1)
  reviewerUserId!: string;

  @IsString()
  @MinLength(1)
  revieweeUserId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateVouchDto {
  @IsString()
  @MinLength(1)
  voucherUserId!: string;

  @IsString()
  @MinLength(1)
  vouchedUserId!: string;

  @IsOptional()
  @IsString()
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
