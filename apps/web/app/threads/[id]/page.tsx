"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "../../../components/session-provider";
import {
  ListingSummary,
  Proposal,
  ThreadDetail,
  UserProfile,
  createBlock,
  createMessage,
  createProposal,
  createReport,
  createReview,
  completeAgreement,
  getListing,
  getProfile,
  getThread
} from "../../../lib/api";

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const { session, isReady, isAuthenticated } = useSession();
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [counterparty, setCounterparty] = useState<UserProfile | null>(null);
  const [messageState, setMessageState] = useState<string | null>(null);
  const [proposalState, setProposalState] = useState<string | null>(null);
  const [reviewState, setReviewState] = useState<string | null>(null);
  const [safetyState, setSafetyState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const latestProposal = detail?.proposals[0] ?? null;
  const canConfirmCompletion =
    !!session &&
    !!latestProposal &&
    !latestProposal.completedByUserIds.includes(session.userId);
  const counterpartyId =
    session && detail
      ? detail.thread.participantIds.find((participantId) => participantId !== session.userId) ?? null
      : null;

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const activeSession = session;
    let cancelled = false;

    async function loadThread(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const nextDetail = await getThread(params.id, activeSession.token);
        const nextCounterpartyId =
          nextDetail.thread.participantIds.find((participantId) => participantId !== activeSession.userId) ?? null;

        const [nextListing, nextCounterparty] = await Promise.all([
          nextDetail.thread.listingId ? getListing(nextDetail.thread.listingId) : Promise.resolve(null),
          nextCounterpartyId ? getProfile(nextCounterpartyId) : Promise.resolve(null)
        ]);

        if (cancelled) {
          return;
        }

        setDetail(nextDetail);
        setListing(nextListing);
        setCounterparty(nextCounterparty);
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError instanceof Error ? nextError.message : "Could not load thread");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadThread();

    return () => {
      cancelled = true;
    };
  }, [params.id, session]);

  const proposalHistory: Proposal[] = detail?.proposals ?? [];

  async function handleMessage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session || !detail) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setMessageState(null);

    try {
      const message = await createMessage(
        detail.thread.id,
        {
          senderUserId: session.userId,
          body: String(formData.get("body") ?? "")
        },
        session.token
      );

      setDetail((current) =>
        current
          ? {
              ...current,
              messages: [...current.messages, message]
            }
          : current
      );

      event.currentTarget.reset();
    } catch (nextError) {
      setMessageState(nextError instanceof Error ? nextError.message : "Could not send message");
    }
  }

  async function handleProposal(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session || !detail) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setProposalState(null);

    try {
      const proposal = await createProposal(
        {
          threadId: detail.thread.id,
          proposedBy: session.userId,
          serviceA: String(formData.get("serviceA") ?? ""),
          serviceB: String(formData.get("serviceB") ?? ""),
          expectedTiming: String(formData.get("expectedTiming") ?? "") || undefined,
          conditions: String(formData.get("conditions") ?? "") || undefined
        },
        session.token
      );

      setDetail((current) =>
        current
          ? {
              ...current,
              proposals: [proposal, ...current.proposals]
            }
          : current
      );

      event.currentTarget.reset();
      setProposalState("Proposal created.");
    } catch (nextError) {
      setProposalState(nextError instanceof Error ? nextError.message : "Could not create proposal");
    }
  }

  async function handleCompleteAgreement(): Promise<void> {
    if (!session || !latestProposal) {
      return;
    }

    setProposalState(null);

    try {
      const updated = await completeAgreement(latestProposal.id, session.userId, session.token);
      setDetail((current) =>
        current
          ? {
              ...current,
              proposals: current.proposals.map((proposal) =>
                proposal.id === updated.id ? updated : proposal
              )
            }
          : current
      );
      setProposalState("Completion recorded.");
    } catch (nextError) {
      setProposalState(nextError instanceof Error ? nextError.message : "Could not confirm completion");
    }
  }

  async function handleReview(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!session || !latestProposal || !counterpartyId) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setReviewState(null);

    try {
      await createReview(
        {
          proposalId: latestProposal.id,
          reviewerUserId: session.userId,
          revieweeUserId: counterpartyId,
          rating: Number(formData.get("rating") ?? 5),
          comment: String(formData.get("comment") ?? "") || undefined
        },
        session.token
      );

      event.currentTarget.reset();
      setReviewState("Review submitted.");
    } catch (nextError) {
      setReviewState(nextError instanceof Error ? nextError.message : "Could not submit review");
    }
  }

  async function handleReportCounterparty(): Promise<void> {
    if (!session || !counterpartyId) {
      return;
    }

    setSafetyState(null);

    try {
      await createReport(
        {
          reporterUserId: session.userId,
          targetType: "user",
          targetId: counterpartyId,
          reasonCode: "conduct_review",
          details: "Reported from the thread screen."
        },
        session.token
      );

      setSafetyState("User report submitted.");
    } catch (nextError) {
      setSafetyState(nextError instanceof Error ? nextError.message : "Could not report user");
    }
  }

  async function handleBlockCounterparty(): Promise<void> {
    if (!session || !counterpartyId) {
      return;
    }

    setSafetyState(null);

    try {
      await createBlock(
        {
          blockerUserId: session.userId,
          blockedUserId: counterpartyId
        },
        session.token
      );

      setSafetyState("Counterparty blocked.");
    } catch (nextError) {
      setSafetyState(nextError instanceof Error ? nextError.message : "Could not block user");
    }
  }

  if (!isReady) {
    return (
      <main className="shell">
        <section className="card empty-state">
          <h2>Loading thread...</h2>
        </section>
      </main>
    );
  }

  if (!isAuthenticated || !session) {
    return (
      <main className="shell">
        <section className="card empty-state">
          <h2>Sign in to view this thread</h2>
          <div className="actions">
            <Link href="/signin" className="button button-primary">
              Sign in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      {isLoading ? (
        <section className="card empty-state">
          <h2>Loading thread...</h2>
        </section>
      ) : null}

      {error ? (
        <section className="card empty-state">
          <h2>Could not load thread</h2>
          <p>{error}</p>
        </section>
      ) : null}

      {detail ? (
        <>
          <section className="page-header page-header-split">
            <div>
              <p className="eyebrow">Thread</p>
              <h1>Keep the barter inside one trackable conversation.</h1>
              <p className="lede">
                Messages, proposals, completion, and post-trade reviews all connect back to
                the same thread.
              </p>
            </div>

            <div className="card inset-card">
              <p className="panel-label">Counterparty</p>
              <h2>{counterparty?.displayName ?? "Unknown user"}</h2>
              <p>{counterparty?.about ?? "No profile summary available."}</p>
              {listing ? (
                <Link href={`/listings/${listing.id}`} className="button button-secondary button-small">
                  View listing context
                </Link>
              ) : null}
            </div>
          </section>

          <section className="thread-layout">
            <article className="card thread-column">
              <div className="section-title">
                <div>
                  <p className="panel-label">Messages</p>
                  <h2>Conversation</h2>
                </div>
              </div>

              <div className="stack-md message-list">
                {detail.messages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  detail.messages.map((message) => (
                    <article
                      key={message.id}
                      className={
                        message.senderUserId === session.userId
                          ? "message-bubble message-bubble-self"
                          : "message-bubble"
                      }
                    >
                      <strong>{message.senderUserId === session.userId ? "You" : counterparty?.displayName ?? "Partner"}</strong>
                      <p>{message.body}</p>
                    </article>
                  ))
                )}
              </div>

              <form className="stack-md" onSubmit={handleMessage}>
                <label className="field">
                  <span>New message</span>
                  <textarea name="body" rows={4} required minLength={1} />
                </label>
                {messageState ? <p className="form-note">{messageState}</p> : null}
                <button type="submit" className="button button-primary">
                  Send message
                </button>
              </form>
            </article>

            <aside className="stack-lg">
              <article className="card form-card">
                <div className="stack-sm">
                  <p className="panel-label">Agreement</p>
                  <h2>Create or revise a proposal</h2>
                </div>

                <form className="stack-md" onSubmit={handleProposal}>
                  <label className="field">
                    <span>Your side of the swap</span>
                    <input name="serviceA" required minLength={1} placeholder="Two guitar lessons" />
                  </label>
                  <label className="field">
                    <span>Their side of the swap</span>
                    <input name="serviceB" required minLength={1} placeholder="Portrait photo session" />
                  </label>
                  <label className="field">
                    <span>Expected timing</span>
                    <input name="expectedTiming" placeholder="Next two weekends" />
                  </label>
                  <label className="field">
                    <span>Conditions</span>
                    <textarea name="conditions" rows={3} placeholder="Outdoor session, bring your own guitar" />
                  </label>

                  {proposalState ? <p className="form-note">{proposalState}</p> : null}

                  <button type="submit" className="button button-primary">
                    Save proposal
                  </button>
                </form>
              </article>

              <article className="card">
                <div className="section-title">
                  <div>
                    <p className="panel-label">Proposal history</p>
                    <h2>Current agreement state</h2>
                  </div>
                </div>

                <div className="stack-md">
                  {proposalHistory.length === 0 ? (
                    <p>No proposal has been created yet.</p>
                  ) : (
                    proposalHistory.map((proposal) => (
                      <article key={proposal.id} className="proposal-card">
                        <div className="pill-row">
                          <span className="pill pill-accent">{proposal.status}</span>
                          <span className="pill">By {proposal.proposedBy === session.userId ? "you" : counterparty?.displayName ?? "partner"}</span>
                        </div>
                        <p>
                          <strong>You give:</strong> {proposal.serviceA}
                        </p>
                        <p>
                          <strong>You receive:</strong> {proposal.serviceB}
                        </p>
                        <p>{proposal.expectedTiming ?? "No timing specified."}</p>
                        <p>{proposal.conditions ?? "No conditions specified."}</p>
                        <p>
                          Confirmed by {proposal.completedByUserIds.length} participant
                          {proposal.completedByUserIds.length === 1 ? "" : "s"}.
                        </p>
                      </article>
                    ))
                  )}
                </div>

                {canConfirmCompletion ? (
                  <div className="actions">
                    <button type="button" className="button button-secondary" onClick={() => void handleCompleteAgreement()}>
                      Confirm completion
                    </button>
                  </div>
                ) : null}
              </article>

              {latestProposal?.status === "completed" && counterpartyId ? (
                <article className="card form-card">
                  <div className="stack-sm">
                    <p className="panel-label">Review</p>
                    <h2>Leave post-trade feedback</h2>
                  </div>

                  <form className="stack-md" onSubmit={handleReview}>
                    <label className="field">
                      <span>Rating</span>
                      <select name="rating" defaultValue="5">
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Comment</span>
                      <textarea name="comment" rows={3} placeholder="Clear communication, smooth swap." />
                    </label>

                    {reviewState ? <p className="form-note">{reviewState}</p> : null}

                    <button type="submit" className="button button-primary">
                      Submit review
                    </button>
                  </form>
                </article>
              ) : null}

              <article className="card">
                <div className="section-title">
                  <div>
                    <p className="panel-label">Safety</p>
                    <h2>Moderation controls</h2>
                  </div>
                </div>

                <div className="actions">
                  <button type="button" className="button button-ghost" onClick={() => void handleReportCounterparty()}>
                    Report user
                  </button>
                  <button type="button" className="button button-ghost" onClick={() => void handleBlockCounterparty()}>
                    Block user
                  </button>
                </div>

                {safetyState ? <p className="form-note">{safetyState}</p> : null}
              </article>
            </aside>
          </section>
        </>
      ) : null}
    </main>
  );
}
