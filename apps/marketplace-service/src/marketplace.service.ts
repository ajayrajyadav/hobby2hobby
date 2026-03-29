import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CreateListingDto,
  Listing,
  SearchListingsQuery
} from "@hobby2hobby/contracts";

@Injectable()
export class MarketplaceService {
  private readonly listings = new Map<string, Listing>();

  createListing(input: CreateListingDto): Listing {
    const listing: Listing = {
      id: randomUUID(),
      status: "active",
      ...input
    };

    this.listings.set(listing.id, listing);

    return listing;
  }

  getListing(id: string): Listing {
    const listing = this.listings.get(id);

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  listListings(): Listing[] {
    return Array.from(this.listings.values());
  }

  searchListings(query: SearchListingsQuery): Listing[] {
    return this.listListings().filter((listing) => {
      const matchesQuery = query.q
        ? `${listing.title} ${listing.description}`
            .toLowerCase()
            .includes(query.q.toLowerCase())
        : true;
      const matchesCategory = query.categorySlug
        ? listing.categorySlug === query.categorySlug
        : true;
      const matchesRegion = query.regionSlug
        ? listing.regionSlug === query.regionSlug
        : true;
      const matchesMode = query.serviceMode
        ? listing.serviceMode === query.serviceMode
        : true;

      return matchesQuery && matchesCategory && matchesRegion && matchesMode;
    });
  }

  archiveListing(id: string): Listing {
    const listing = this.getListing(id);
    const archived = { ...listing, status: "archived" as const };

    this.listings.set(id, archived);

    return archived;
  }
}
