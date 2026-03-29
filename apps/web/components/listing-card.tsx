import Link from "next/link";
import { ListingSummary } from "../lib/api";

export function ListingCard({
  listing,
  compact = false
}: {
  listing: ListingSummary;
  compact?: boolean;
}) {
  return (
    <article className={compact ? "card listing-card listing-card-compact" : "card listing-card"}>
      <div className="stack-sm">
        <div className="pill-row">
          <span className="pill pill-accent">{listing.listingType}</span>
          <span className="pill">{listing.serviceMode.replace("_", " ")}</span>
          <span className="pill">{listing.regionSlug}</span>
        </div>
        <div>
          <h2>{listing.title}</h2>
          <p>{listing.description}</p>
        </div>
      </div>

      <div className="listing-footer">
        <div className="stack-xs">
          <span>{listing.categorySlug}</span>
          {listing.whatInExchange ? <span>Seeking: {listing.whatInExchange}</span> : null}
        </div>
        <Link href={`/listings/${listing.id}`} className="button button-secondary button-small">
          View listing
        </Link>
      </div>
    </article>
  );
}
