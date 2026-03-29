import { Injectable, OnModuleInit } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CreateListingDto,
  Listing,
  SearchListingsQuery,
  ServiceMode
} from "@hobby2hobby/contracts";
import { PostgresService } from "@hobby2hobby/postgres";

interface ListingRow {
  id: string;
  user_id: string;
  listing_type: "offer" | "need";
  title: string;
  description: string;
  category_slug: string;
  region_slug: string;
  location_label: string | null;
  service_mode: ServiceMode;
  availability_text: string | null;
  what_in_exchange: string | null;
  status: "active" | "archived";
}

@Injectable()
export class MarketplaceRepository implements OnModuleInit {
  constructor(private readonly postgres: PostgresService) {}

  async onModuleInit(): Promise<void> {
    await this.postgres.query(`
      create schema if not exists marketplace;

      create table if not exists marketplace.listings (
        id uuid primary key,
        user_id uuid not null,
        listing_type text not null,
        title text not null,
        description text not null,
        category_slug text not null,
        region_slug text not null,
        location_label text null,
        service_mode text not null,
        availability_text text null,
        what_in_exchange text null,
        status text not null default 'active',
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );

      create index if not exists marketplace_listings_region_idx
        on marketplace.listings (region_slug, status);

      create index if not exists marketplace_listings_category_idx
        on marketplace.listings (category_slug, status);
    `);
  }

  async createListing(input: CreateListingDto): Promise<Listing> {
    const id = randomUUID();

    await this.postgres.query(
      `
        insert into marketplace.listings (
          id,
          user_id,
          listing_type,
          title,
          description,
          category_slug,
          region_slug,
          location_label,
          service_mode,
          availability_text,
          what_in_exchange,
          status
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active')
      `,
      [
        id,
        input.userId,
        input.listingType,
        input.title,
        input.description,
        input.categorySlug,
        input.regionSlug,
        input.locationLabel ?? null,
        input.serviceMode,
        input.availabilityText ?? null,
        input.whatInExchange ?? null
      ]
    );

    const listing = await this.getListing(id);
    if (!listing) {
      throw new Error("Listing creation failed");
    }

    return listing;
  }

  async getListing(id: string): Promise<Listing | null> {
    const result = await this.postgres.query<ListingRow>(
      `
        select
          id,
          user_id,
          listing_type,
          title,
          description,
          category_slug,
          region_slug,
          location_label,
          service_mode,
          availability_text,
          what_in_exchange,
          status
        from marketplace.listings
        where id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapListing(result.rows[0]);
  }

  async listListings(): Promise<Listing[]> {
    const result = await this.postgres.query<ListingRow>(
      `
        select
          id,
          user_id,
          listing_type,
          title,
          description,
          category_slug,
          region_slug,
          location_label,
          service_mode,
          availability_text,
          what_in_exchange,
          status
        from marketplace.listings
        where status = 'active'
        order by created_at desc
      `
    );

    return result.rows.map((row) => this.mapListing(row));
  }

  async searchListings(query: SearchListingsQuery): Promise<Listing[]> {
    const values: unknown[] = [];
    const clauses: string[] = [];

    if (query.q) {
      values.push(`%${query.q.toLowerCase()}%`);
      clauses.push(
        `(lower(title) like $${values.length} or lower(description) like $${values.length})`
      );
    }

    if (query.categorySlug) {
      values.push(query.categorySlug);
      clauses.push(`category_slug = $${values.length}`);
    }

    if (query.regionSlug) {
      values.push(query.regionSlug);
      clauses.push(`region_slug = $${values.length}`);
    }

    if (query.serviceMode) {
      values.push(query.serviceMode);
      clauses.push(`service_mode = $${values.length}`);
    }

    clauses.unshift(`status = 'active'`);
    const whereClause = `where ${clauses.join(" and ")}`;

    const result = await this.postgres.query<ListingRow>(
      `
        select
          id,
          user_id,
          listing_type,
          title,
          description,
          category_slug,
          region_slug,
          location_label,
          service_mode,
          availability_text,
          what_in_exchange,
          status
        from marketplace.listings
        ${whereClause}
        order by created_at desc
      `,
      values
    );

    return result.rows.map((row) => this.mapListing(row));
  }

  async archiveListing(id: string): Promise<Listing | null> {
    await this.postgres.query(
      `
        update marketplace.listings
        set status = 'archived', updated_at = now()
        where id = $1
      `,
      [id]
    );

    return this.getListing(id);
  }

  private mapListing(row: ListingRow): Listing {
    return {
      id: row.id,
      userId: row.user_id,
      listingType: row.listing_type,
      title: row.title,
      description: row.description,
      categorySlug: row.category_slug,
      regionSlug: row.region_slug,
      locationLabel: row.location_label ?? undefined,
      serviceMode: row.service_mode,
      availabilityText: row.availability_text ?? undefined,
      whatInExchange: row.what_in_exchange ?? undefined,
      status: row.status
    };
  }
}
