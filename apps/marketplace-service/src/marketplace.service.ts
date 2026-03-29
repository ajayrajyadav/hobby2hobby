import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateListingDto,
  Listing,
  SearchListingsQuery
} from "@hobby2hobby/contracts";
import { MarketplaceRepository } from "./marketplace.repository";

@Injectable()
export class MarketplaceService {
  constructor(private readonly marketplaceRepository: MarketplaceRepository) {}

  createListing(input: CreateListingDto): Promise<Listing> {
    return this.marketplaceRepository.createListing(input);
  }

  async getListing(id: string): Promise<Listing> {
    const listing = await this.marketplaceRepository.getListing(id);

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  listListings(): Promise<Listing[]> {
    return this.marketplaceRepository.listListings();
  }

  searchListings(query: SearchListingsQuery): Promise<Listing[]> {
    return this.marketplaceRepository.searchListings(query);
  }

  async archiveListing(id: string): Promise<Listing> {
    const archived = await this.marketplaceRepository.archiveListing(id);

    if (!archived) {
      throw new NotFoundException("Listing not found");
    }

    return archived;
  }
}
