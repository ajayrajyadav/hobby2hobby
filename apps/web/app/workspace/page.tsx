"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ListingCard } from "../../components/listing-card";
import { useSession } from "../../components/session-provider";
import {
  ListingSummary,
  MessageThread,
  Review,
  SubscriptionSnapshot,
  TrustSummary,
  archiveListing,
  createListing,
  getReviewsForUser,
  getSubscription,
  getTrustSummary,
  listListings,
  listThreads,
  updateProfile
} from "../../lib/api";

interface ProfileFormState {
  displayName: string;
  about: string;
  city: string;
  regionCode: string;
  availabilitySummary: string;
}

const EMPTY_PROFILE: ProfileFormState = {
  displayName: "",
  about: "",
  city: "",
  regionCode: "",
  availabilitySummary: ""
};

const EMPTY_LISTING = {
  listingType: "offer",
  title: "",
  description: "",
  categorySlug: "",
  regionSlug: "",
  locationLabel: "",
  serviceMode: "either",
  availabilityText: "",
  whatInExchange: ""
};

export default function WorkspacePage() {
  const { isReady, isAuthenticated, session, profile, refreshProfile } = useSession();
  const [profileForm, setProfileForm] = useState<ProfileFormState>(EMPTY_PROFILE);
  const [listingForm, setListingForm] = useState(EMPTY_LISTING);
  const [subscription, setSubscription] = useState<SubscriptionSnapshot | null>(null);
  const [trustSummary, setTrustSummary] = useState<TrustSummary | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myListings, setMyListings] = useState<ListingSummary[]>([]);
  const [myThreads, setMyThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileNotice, setProfileNotice] = useState<string | null>(null);
  const [listingNotice, setListingNotice] = useState<string | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      setProfileForm(EMPTY_PROFILE);
      return;
    }

    setProfileForm({
      displayName: profile.displayName,
      about: profile.about ?? "",
      city: profile.city ?? "",
      regionCode: profile.regionCode ?? "",
      availabilitySummary: profile.availabilitySummary ?? ""
    });
  }, [profile]);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const activeSession = session;
    let cancelled = false;

    async function loadWorkspace(): Promise<void> {
      setIsLoading(true);
      setWorkspaceError(null);

      try {
        const [nextSubscription, nextTrustSummary, nextReviews, allListings, allThreads] =
          await Promise.all([
            getSubscription(activeSession.userId, activeSession.token),
            getTrustSummary(activeSession.userId),
            getReviewsForUser(activeSession.userId),
            listListings(),
            listThreads(activeSession.token)
          ]);

        if (cancelled) {
          return;
        }

        setSubscription(nextSubscription);
        setTrustSummary(nextTrustSummary);
        setReviews(nextReviews);
        setMyListings(allListings.filter((listing) => listing.userId === activeSession.userId));
        setMyThreads(allThreads.filter((thread) => thread.participantIds.includes(activeSession.userId)));
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(error instanceof Error ? error.message : "Could not load workspace");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function handleProfileSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session) {
      return;
    }

    setProfileNotice(null);

    try {
      await updateProfile(session.userId, profileForm, session.token);
      await refreshProfile();
      setProfileNotice("Profile updated.");
    } catch (error) {
      setProfileNotice(error instanceof Error ? error.message : "Could not update profile");
    }
  }

  async function handleCreateListing(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session) {
      return;
    }

    setListingNotice(null);

    try {
      const created = await createListing(
        {
          userId: session.userId,
          listingType: listingForm.listingType as "offer" | "need",
          title: listingForm.title,
          description: listingForm.description,
          categorySlug: listingForm.categorySlug,
          regionSlug: listingForm.regionSlug,
          locationLabel: listingForm.locationLabel || undefined,
          serviceMode: listingForm.serviceMode as "remote" | "in_person" | "either",
          availabilityText: listingForm.availabilityText || undefined,
          whatInExchange: listingForm.whatInExchange || undefined
        },
        session.token
      );

      setMyListings((current) => [created, ...current]);
      setListingForm(EMPTY_LISTING);
      setListingNotice("Listing published.");
    } catch (error) {
      setListingNotice(error instanceof Error ? error.message : "Could not create listing");
    }
  }

  async function handleArchiveListing(listingId: string): Promise<void> {
    if (!session) {
      return;
    }

    try {
      const archived = await archiveListing(listingId, session.token);
      setMyListings((current) =>
        current.map((listing) => (listing.id === listingId ? archived : listing))
      );
    } catch (error) {
      setListingNotice(error instanceof Error ? error.message : "Could not archive listing");
    }
  }

  if (!isReady) {
    return (
      <main className="shell">
        <section className="card empty-state">
          <h2>Loading workspace...</h2>
        </section>
      </main>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <main className="shell">
        <section className="card empty-state">
          <p className="eyebrow">Workspace</p>
          <h1>Sign in to manage your barter activity.</h1>
          <p>
            Your workspace holds profile edits, listings, threads, trust data, and
            subscription state for the current MVP.
          </p>
          <div className="actions">
            <Link href="/signin" className="button button-primary">
              Sign in
            </Link>
            <Link href="/explore" className="button button-secondary">
              Browse listings first
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="page-header">
        <p className="eyebrow">Workspace</p>
        <h1>{profile?.displayName ?? "Your"} barter command center.</h1>
        <p className="lede">
          Keep your profile current, post new listings, track active threads, and watch
          your trust layer build over time.
        </p>
      </section>

      {workspaceError ? (
        <section className="card empty-state">
          <h2>Could not load the workspace</h2>
          <p>{workspaceError}</p>
        </section>
      ) : null}

      <section className="stats-grid">
        <article className="card stat-card">
          <p className="panel-label">Plan</p>
          <h2>{subscription?.planType ?? "free"}</h2>
          <p>Status: {subscription?.subscriptionStatus ?? "inactive"}</p>
        </article>
        <article className="card stat-card">
          <p className="panel-label">Trust</p>
          <h2>{trustSummary?.averageRating?.toFixed(1) ?? "0.0"}</h2>
          <p>
            {trustSummary?.reviewCount ?? 0} reviews, {trustSummary?.vouchCount ?? 0} vouches
          </p>
        </article>
        <article className="card stat-card">
          <p className="panel-label">Activity</p>
          <h2>{myThreads.length}</h2>
          <p>Active or historical threads visible to your account.</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="card form-card">
          <div className="stack-sm">
            <p className="panel-label">Profile</p>
            <h2>Edit your public profile</h2>
          </div>

          <form className="stack-md" onSubmit={handleProfileSave}>
            <label className="field">
              <span>Display name</span>
              <input
                value={profileForm.displayName}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, displayName: event.target.value }))
                }
                minLength={2}
                required
              />
            </label>
            <label className="field">
              <span>About</span>
              <textarea
                value={profileForm.about}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, about: event.target.value }))
                }
                rows={4}
              />
            </label>
            <div className="two-up">
              <label className="field">
                <span>City</span>
                <input
                  value={profileForm.city}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, city: event.target.value }))
                  }
                />
              </label>
              <label className="field">
                <span>Region code</span>
                <input
                  value={profileForm.regionCode}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, regionCode: event.target.value }))
                  }
                />
              </label>
            </div>
            <label className="field">
              <span>Availability</span>
              <input
                value={profileForm.availabilitySummary}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    availabilitySummary: event.target.value
                  }))
                }
                placeholder="Weeknights, Saturday mornings"
              />
            </label>

            {profileNotice ? <p className="form-note">{profileNotice}</p> : null}

            <button type="submit" className="button button-primary">
              Save profile
            </button>
          </form>
        </article>

        <article className="card form-card">
          <div className="stack-sm">
            <p className="panel-label">Listing</p>
            <h2>Publish a new offer or need</h2>
          </div>

          <form className="stack-md" onSubmit={handleCreateListing}>
            <div className="two-up">
              <label className="field">
                <span>Listing type</span>
                <select
                  value={listingForm.listingType}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, listingType: event.target.value }))
                  }
                >
                  <option value="offer">Offer</option>
                  <option value="need">Need</option>
                </select>
              </label>
              <label className="field">
                <span>Service mode</span>
                <select
                  value={listingForm.serviceMode}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, serviceMode: event.target.value }))
                  }
                >
                  <option value="remote">Remote</option>
                  <option value="in_person">In person</option>
                  <option value="either">Either</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>Title</span>
              <input
                value={listingForm.title}
                onChange={(event) =>
                  setListingForm((current) => ({ ...current, title: event.target.value }))
                }
                required
                minLength={2}
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                value={listingForm.description}
                onChange={(event) =>
                  setListingForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                required
                minLength={5}
              />
            </label>
            <div className="two-up">
              <label className="field">
                <span>Category</span>
                <input
                  value={listingForm.categorySlug}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, categorySlug: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="field">
                <span>Region</span>
                <input
                  value={listingForm.regionSlug}
                  onChange={(event) =>
                    setListingForm((current) => ({ ...current, regionSlug: event.target.value }))
                  }
                  required
                />
              </label>
            </div>
            <label className="field">
              <span>Location label</span>
              <input
                value={listingForm.locationLabel}
                onChange={(event) =>
                  setListingForm((current) => ({ ...current, locationLabel: event.target.value }))
                }
                placeholder="Pasadena, Downtown, Remote"
              />
            </label>
            <label className="field">
              <span>Availability</span>
              <input
                value={listingForm.availabilityText}
                onChange={(event) =>
                  setListingForm((current) => ({ ...current, availabilityText: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>What you want in exchange</span>
              <input
                value={listingForm.whatInExchange}
                onChange={(event) =>
                  setListingForm((current) => ({ ...current, whatInExchange: event.target.value }))
                }
                placeholder="Beginner pottery lessons"
              />
            </label>

            {listingNotice ? <p className="form-note">{listingNotice}</p> : null}

            <button type="submit" className="button button-primary">
              Publish listing
            </button>
          </form>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-title">
          <div>
            <p className="panel-label">My listings</p>
            <h2>Manage your public barter posts</h2>
          </div>
        </div>

        <div className="listing-grid">
          {isLoading ? (
            <article className="card empty-state">
              <h2>Loading listings...</h2>
            </article>
          ) : null}

          {!isLoading && myListings.length === 0 ? (
            <article className="card empty-state">
              <h2>No listings yet</h2>
              <p>Create your first offer or need to show up in public discovery.</p>
            </article>
          ) : null}

          {myListings.map((listing) => (
            <div key={listing.id} className="stack-sm">
              <ListingCard listing={listing} compact />
              <div className="row-actions">
                <Link href={`/listings/${listing.id}`} className="button button-secondary button-small">
                  Open
                </Link>
                {listing.status === "active" ? (
                  <button
                    type="button"
                    className="button button-ghost button-small"
                    onClick={() => void handleArchiveListing(listing.id)}
                  >
                    Archive
                  </button>
                ) : (
                  <span className="status-text">Archived</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="section-title">
            <div>
              <p className="panel-label">Threads</p>
              <h2>Your conversations</h2>
            </div>
          </div>

          <div className="stack-md">
            {myThreads.length === 0 ? (
              <p>No threads yet. Open a listing and start a barter conversation.</p>
            ) : (
              myThreads.map((thread) => (
                <Link key={thread.id} href={`/threads/${thread.id}`} className="thread-item">
                  <div>
                    <strong>Thread {thread.id.slice(0, 8)}</strong>
                    <p>{thread.participantIds.length} participants</p>
                  </div>
                  <span className="pill">{thread.status}</span>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className="card">
          <div className="section-title">
            <div>
              <p className="panel-label">Trust layer</p>
              <h2>Recent reviews</h2>
            </div>
          </div>

          <div className="stack-md">
            {reviews.length === 0 ? (
              <p>No reviews yet. Completed trades will show up here.</p>
            ) : (
              reviews.map((review) => (
                <article key={review.id} className="review-item">
                  <div className="pill-row">
                    <span className="pill pill-accent">{review.rating}/5</span>
                    <span className="pill">Proposal {review.proposalId.slice(0, 8)}</span>
                  </div>
                  <p>{review.comment || "No written comment was left for this trade."}</p>
                </article>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
