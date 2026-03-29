"use client";

import { FormEvent, useEffect, useState } from "react";
import { ListingCard } from "../../components/listing-card";
import { ListingSummary, searchListings } from "../../lib/api";

const DEFAULT_FILTERS = {
  q: "",
  categorySlug: "",
  regionSlug: "",
  serviceMode: ""
};

export default function ExplorePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadListings(DEFAULT_FILTERS);
  }, []);

  async function loadListings(nextFilters: typeof DEFAULT_FILTERS): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const nextListings = await searchListings({
        q: nextFilters.q || undefined,
        categorySlug: nextFilters.categorySlug || undefined,
        regionSlug: nextFilters.regionSlug || undefined,
        serviceMode:
          nextFilters.serviceMode === "remote" ||
          nextFilters.serviceMode === "in_person" ||
          nextFilters.serviceMode === "either"
            ? nextFilters.serviceMode
            : undefined
      });

      setListings(nextListings);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Could not load listings");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await loadListings(filters);
  }

  return (
    <main className="shell">
      <section className="page-header page-header-split">
        <div>
          <p className="eyebrow">Explore</p>
          <h1>Browse what people can trade right now.</h1>
          <p className="lede">
            Discovery is public. Use filters to narrow by category, region, or remote
            availability before you open a conversation.
          </p>
        </div>
        <div className="card inset-card">
          <p className="panel-label">Search focus</p>
          <p>Offers and needs share one search surface so a promising trade can start from either side.</p>
        </div>
      </section>

      <section className="card form-card">
        <form className="filter-grid" onSubmit={handleSearch}>
          <label className="field">
            <span>Keyword</span>
            <input
              value={filters.q}
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="guitar, pottery, headshots"
            />
          </label>
          <label className="field">
            <span>Category</span>
            <input
              value={filters.categorySlug}
              onChange={(event) =>
                setFilters((current) => ({ ...current, categorySlug: event.target.value }))
              }
              placeholder="music"
            />
          </label>
          <label className="field">
            <span>Region</span>
            <input
              value={filters.regionSlug}
              onChange={(event) => setFilters((current) => ({ ...current, regionSlug: event.target.value }))}
              placeholder="la"
            />
          </label>
          <label className="field">
            <span>Service mode</span>
            <select
              value={filters.serviceMode}
              onChange={(event) =>
                setFilters((current) => ({ ...current, serviceMode: event.target.value }))
              }
            >
              <option value="">Any</option>
              <option value="remote">Remote</option>
              <option value="in_person">In person</option>
              <option value="either">Either</option>
            </select>
          </label>

          <div className="actions">
            <button type="submit" className="button button-primary" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search listings"}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setFilters(DEFAULT_FILTERS);
                void loadListings(DEFAULT_FILTERS);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {error ? (
        <section className="card empty-state">
          <h2>Could not load listings</h2>
          <p>{error}</p>
        </section>
      ) : null}

      <section className="listing-grid">
        {!isLoading && listings.length === 0 ? (
          <article className="card empty-state">
            <h2>No listings match this search</h2>
            <p>Try broadening the region or category, or create the first listing in your workspace.</p>
          </article>
        ) : null}

        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  );
}
