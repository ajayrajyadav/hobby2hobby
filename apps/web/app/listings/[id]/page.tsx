"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "../../../components/session-provider";
import {
  ListingSummary,
  Review,
  TrustSummary,
  UserProfile,
  createBlock,
  createReport,
  createThread,
  createVouch,
  getListing,
  getProfile,
  getReviewsForUser,
  getTrustSummary
} from "../../../lib/api";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { session, isAuthenticated } = useSession();
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [trustSummary, setTrustSummary] = useState<TrustSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contactState, setContactState] = useState<string | null>(null);
  const [trustState, setTrustState] = useState<string | null>(null);
  const [safetyState, setSafetyState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadListing(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const nextListing = await getListing(params.id);
        const [nextOwner, nextTrustSummary, nextReviews] = await Promise.all([
          getProfile(nextListing.userId),
          getTrustSummary(nextListing.userId),
          getReviewsForUser(nextListing.userId)
        ]);

        if (cancelled) {
          return;
        }

        setListing(nextListing);
        setOwner(nextOwner);
        setTrustSummary(nextTrustSummary);
        setReviews(nextReviews);
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Could not load listing");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadListing();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleContact(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session || !listing) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setContactState(null);

    try {
      const thread = await createThread(
        {
          listingId: listing.id,
          initiatedBy: session.userId,
          participantIds: [listing.userId],
          initialMessage: String(formData.get("initialMessage") ?? "")
        },
        session.token
      );

      router.push(`/threads/${thread.id}`);
    } catch (nextError) {
      setContactState(nextError instanceof Error ? nextError.message : "Could not open thread");
    }
  }

  async function handleVouch(): Promise<void> {
    if (!session || !listing) {
      return;
    }

    setTrustState(null);

    try {
      await createVouch(
        {
          voucherUserId: session.userId,
          vouchedUserId: listing.userId,
          reason: "Positive barter presence on hobby2hobby."
        },
        session.token
      );

      const nextTrustSummary = await getTrustSummary(listing.userId);
      setTrustSummary(nextTrustSummary);
      setTrustState("Vouch recorded.");
    } catch (error) {
      setTrustState(error instanceof Error ? error.message : "Could not create vouch");
    }
  }

  async function handleReport(): Promise<void> {
    if (!session || !listing) {
      return;
    }

    setSafetyState(null);

    try {
      await createReport(
        {
          reporterUserId: session.userId,
          targetType: "listing",
          targetId: listing.id,
          reasonCode: "safety_review",
          details: "Submitted from the listing detail page."
        },
        session.token
      );

      setSafetyState("Report submitted.");
    } catch (error) {
      setSafetyState(error instanceof Error ? error.message : "Could not submit report");
    }
  }

  async function handleBlock(): Promise<void> {
    if (!session || !listing) {
      return;
    }

    setSafetyState(null);

    try {
      await createBlock(
        {
          blockerUserId: session.userId,
          blockedUserId: listing.userId
        },
        session.token
      );

      setSafetyState("User blocked.");
    } catch (error) {
      setSafetyState(error instanceof Error ? error.message : "Could not block user");
    }
  }

  return (
    <main className="shell">
      {isLoading ? (
        <section className="card empty-state">
          <h2>Loading listing...</h2>
        </section>
      ) : null}

      {error ? (
        <section className="card empty-state">
          <h2>Could not load listing</h2>
          <p>{error}</p>
          <div className="actions">
            <Link href="/explore" className="button button-secondary">
              Back to explore
            </Link>
          </div>
        </section>
      ) : null}

      {listing && owner ? (
        <>
          <section className="detail-grid">
            <article className="card detail-panel">
              <div className="pill-row">
                <span className="pill pill-accent">{listing.listingType}</span>
                <span className="pill">{listing.serviceMode.replace("_", " ")}</span>
                <span className="pill">{listing.regionSlug}</span>
              </div>
              <h1>{listing.title}</h1>
              <p className="lede">{listing.description}</p>

              <div className="detail-meta">
                <div>
                  <strong>Category</strong>
                  <span>{listing.categorySlug}</span>
                </div>
                <div>
                  <strong>Location</strong>
                  <span>{listing.locationLabel ?? listing.regionSlug}</span>
                </div>
                <div>
                  <strong>Availability</strong>
                  <span>{listing.availabilityText ?? "Not specified"}</span>
                </div>
                <div>
                  <strong>Exchange</strong>
                  <span>{listing.whatInExchange ?? "Open to discussion"}</span>
                </div>
              </div>
            </article>

            <aside className="stack-lg">
              <article className="card">
                <p className="panel-label">Profile</p>
                <h2>{owner.displayName}</h2>
                <p>{owner.about || "No bio yet."}</p>
                <div className="stack-xs">
                  <span>{owner.city || "City not set"}</span>
                  <span>{owner.regionCode || "Region not set"}</span>
                  <span>{owner.availabilitySummary || "Availability not set"}</span>
                </div>
              </article>

              <article className="card">
                <p className="panel-label">Trust summary</p>
                <div className="trust-grid">
                  <div>
                    <strong>{trustSummary?.averageRating.toFixed(1) ?? "0.0"}</strong>
                    <span>Average rating</span>
                  </div>
                  <div>
                    <strong>{trustSummary?.reviewCount ?? 0}</strong>
                    <span>Reviews</span>
                  </div>
                  <div>
                    <strong>{trustSummary?.vouchCount ?? 0}</strong>
                    <span>Vouches</span>
                  </div>
                </div>

                {isAuthenticated && session?.userId !== listing.userId ? (
                  <div className="actions">
                    <button type="button" className="button button-secondary" onClick={() => void handleVouch()}>
                      Leave vouch
                    </button>
                    <button type="button" className="button button-ghost" onClick={() => void handleReport()}>
                      Report listing
                    </button>
                    <button type="button" className="button button-ghost" onClick={() => void handleBlock()}>
                      Block user
                    </button>
                  </div>
                ) : null}

                {trustState ? <p className="form-note">{trustState}</p> : null}
                {safetyState ? <p className="form-note">{safetyState}</p> : null}
              </article>
            </aside>
          </section>

          <section className="dashboard-grid">
            <article className="card form-card">
              <div className="stack-sm">
                <p className="panel-label">Open thread</p>
                <h2>Start the barter conversation</h2>
              </div>

              {session?.userId === listing.userId ? (
                <p>This is your listing. Use your workspace to manage it instead of starting a thread with yourself.</p>
              ) : isAuthenticated ? (
                <form className="stack-md" onSubmit={handleContact}>
                  <label className="field">
                    <span>Opening message</span>
                    <textarea
                      name="initialMessage"
                      rows={5}
                      required
                      minLength={1}
                      placeholder="I can trade beginner guitar coaching for a headshot session..."
                    />
                  </label>

                  {contactState ? <p className="form-note">{contactState}</p> : null}

                  <button type="submit" className="button button-primary">
                    Start thread
                  </button>
                </form>
              ) : (
                <div className="stack-sm">
                  <p>Sign in to message this user and turn the listing into a barter thread.</p>
                  <div className="actions">
                    <Link href="/signin" className="button button-primary">
                      Sign in
                    </Link>
                  </div>
                </div>
              )}
            </article>

            <article className="card">
              <div className="section-title">
                <div>
                  <p className="panel-label">Reviews</p>
                  <h2>What others said</h2>
                </div>
              </div>

              <div className="stack-md">
                {reviews.length === 0 ? (
                  <p>No reviews yet for this user.</p>
                ) : (
                  reviews.map((review) => (
                    <article key={review.id} className="review-item">
                      <div className="pill-row">
                        <span className="pill pill-accent">{review.rating}/5</span>
                        <span className="pill">Proposal {review.proposalId.slice(0, 8)}</span>
                      </div>
                      <p>{review.comment || "No comment left for this review."}</p>
                    </article>
                  ))
                )}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </main>
  );
}
