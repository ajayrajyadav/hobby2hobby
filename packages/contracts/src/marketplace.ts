import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

export type ListingType = "offer" | "need";
export type ServiceMode = "remote" | "in_person" | "either";

export class CreateListingDto {
  @IsString()
  @MinLength(1)
  userId!: string;

  @IsIn(["offer", "need"])
  listingType!: ListingType;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsString()
  @MinLength(2)
  categorySlug!: string;

  @IsString()
  @MinLength(2)
  regionSlug!: string;

  @IsOptional()
  @IsString()
  locationLabel?: string;

  @IsIn(["remote", "in_person", "either"])
  serviceMode!: ServiceMode;

  @IsOptional()
  @IsString()
  availabilityText?: string;

  @IsOptional()
  @IsString()
  whatInExchange?: string;
}

export interface Listing {
  id: string;
  userId: string;
  listingType: ListingType;
  title: string;
  description: string;
  categorySlug: string;
  regionSlug: string;
  locationLabel?: string;
  serviceMode: ServiceMode;
  availabilityText?: string;
  whatInExchange?: string;
  status: "active" | "archived";
}

export class SearchListingsQuery {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  regionSlug?: string;

  @IsOptional()
  @IsIn(["remote", "in_person", "either"])
  serviceMode?: ServiceMode;
}
