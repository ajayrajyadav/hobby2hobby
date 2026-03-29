import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import {
  CreateListingDto,
  Listing,
  SearchListingsQuery
} from "@hobby2hobby/contracts";
import { CurrentUserId, Public } from "@hobby2hobby/nest-tools";
import { MarketplaceService } from "./marketplace.service";

@Controller()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post("listings")
  createListing(
    @CurrentUserId() currentUserId: string,
    @Body() body: CreateListingDto
  ): Promise<Listing> {
    if (currentUserId !== body.userId) {
      throw new ForbiddenException("Listing owner must match the authenticated user");
    }

    return this.marketplaceService.createListing(body);
  }

  @Public()
  @Get("listings")
  listListings(): Promise<Listing[]> {
    return this.marketplaceService.listListings();
  }

  @Public()
  @Get("listings/:id")
  getListing(@Param("id") id: string): Promise<Listing> {
    return this.marketplaceService.getListing(id);
  }

  @Public()
  @Get("search")
  searchListings(@Query() query: SearchListingsQuery): Promise<Listing[]> {
    return this.marketplaceService.searchListings(query);
  }

  @Patch("listings/:id/archive")
  async archiveListing(
    @CurrentUserId() currentUserId: string,
    @Param("id") id: string
  ): Promise<Listing> {
    const listing = await this.marketplaceService.getListing(id);

    if (listing.userId !== currentUserId) {
      throw new ForbiddenException("Only the listing owner can archive this listing");
    }

    return this.marketplaceService.archiveListing(id);
  }
}
