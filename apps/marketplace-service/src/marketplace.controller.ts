import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import {
  CreateListingDto,
  Listing,
  SearchListingsQuery
} from "@hobby2hobby/contracts";
import { MarketplaceService } from "./marketplace.service";

@Controller()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("listings")
  createListing(@Body() body: CreateListingDto): Promise<Listing> {
    return this.marketplaceService.createListing(body);
  }

  @Get("listings")
  listListings(): Promise<Listing[]> {
    return this.marketplaceService.listListings();
  }

  @Get("listings/:id")
  getListing(@Param("id") id: string): Promise<Listing> {
    return this.marketplaceService.getListing(id);
  }

  @Get("search")
  searchListings(@Query() query: SearchListingsQuery): Promise<Listing[]> {
    return this.marketplaceService.searchListings(query);
  }

  @Patch("listings/:id/archive")
  archiveListing(@Param("id") id: string): Promise<Listing> {
    return this.marketplaceService.archiveListing(id);
  }
}
