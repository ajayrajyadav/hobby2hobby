export type ListingType = "offer" | "need";
export type ServiceMode = "remote" | "in_person" | "either";

export interface CreateListingDto {
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

export interface SearchListingsQuery {
  q?: string;
  categorySlug?: string;
  regionSlug?: string;
  serviceMode?: ServiceMode;
}
