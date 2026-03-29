export interface AuthResponse {
  userId: string;
  token: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  about?: string;
  city?: string;
  regionCode?: string;
  availabilitySummary?: string;
  planType: "free" | "paid";
  emailVerified: boolean;
}

export interface SubscriptionSnapshot {
  userId: string;
  planType: "free" | "paid";
  subscriptionStatus: "inactive" | "active";
}

export interface ListingSummary {
  id: string;
  userId: string;
  title: string;
  description: string;
  listingType: "offer" | "need";
  categorySlug: string;
  regionSlug: string;
  locationLabel?: string;
  serviceMode: "remote" | "in_person" | "either";
  availabilityText?: string;
  whatInExchange?: string;
  status: "active" | "archived";
}

export interface SearchListingsParams {
  q?: string;
  categorySlug?: string;
  regionSlug?: string;
  serviceMode?: "remote" | "in_person" | "either";
}

export interface MessageThread {
  id: string;
  listingId?: string;
  participantIds: string[];
  status: "open" | "closed";
}

export interface Message {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
}

export interface Proposal {
  id: string;
  threadId: string;
  proposedBy: string;
  serviceA: string;
  serviceB: string;
  expectedTiming?: string;
  conditions?: string;
  status: "pending" | "accepted" | "completed";
  completedByUserIds: string[];
}

export interface ThreadDetail {
  thread: MessageThread;
  messages: Message[];
  proposals: Proposal[];
}

export interface TrustSummary {
  userId: string;
  reviewCount: number;
  averageRating: number;
  vouchCount: number;
}

export interface Review {
  id: string;
  proposalId: string;
  reviewerUserId: string;
  revieweeUserId: string;
  rating: number;
  comment?: string;
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
  token?: string;
  query?: Record<string, string | undefined>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
  );

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(options.token ? { authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const text = await response.text();
  const payload = text.length > 0 ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload));
  }

  return payload as T;
}

function extractErrorMessage(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const message = (payload as { message: string | string[] }).message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Request failed";
}

export function registerUser(input: {
  email: string;
  password: string;
  displayName: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("auth/register", {
    method: "POST",
    body: input
  });
}

export function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("auth/login", {
    method: "POST",
    body: input
  });
}

export function getCurrentUserProfile(token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>("me", { token });
}

export function getProfile(userId: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`profiles/${userId}`);
}

export function updateProfile(
  userId: string,
  input: {
    displayName?: string;
    about?: string;
    city?: string;
    regionCode?: string;
    availabilitySummary?: string;
  },
  token: string
): Promise<UserProfile> {
  return apiRequest<UserProfile>(`profiles/${userId}`, {
    method: "PATCH",
    body: input,
    token
  });
}

export function getSubscription(userId: string, token: string): Promise<SubscriptionSnapshot> {
  return apiRequest<SubscriptionSnapshot>(`subscriptions/${userId}`, { token });
}

export function listListings(): Promise<ListingSummary[]> {
  return apiRequest<ListingSummary[]>("listings");
}

export function searchListings(query: SearchListingsParams): Promise<ListingSummary[]> {
  const hasFilters = Object.values(query).some(Boolean);
  if (!hasFilters) {
    return listListings();
  }

  return apiRequest<ListingSummary[]>("search", {
    query: {
      q: query.q,
      categorySlug: query.categorySlug,
      regionSlug: query.regionSlug,
      serviceMode: query.serviceMode
    }
  });
}

export function getListing(id: string): Promise<ListingSummary> {
  return apiRequest<ListingSummary>(`listings/${id}`);
}

export function createListing(
  input: Omit<ListingSummary, "id" | "status">,
  token: string
): Promise<ListingSummary> {
  return apiRequest<ListingSummary>("listings", {
    method: "POST",
    body: input,
    token
  });
}

export function archiveListing(id: string, token: string): Promise<ListingSummary> {
  return apiRequest<ListingSummary>(`listings/${id}/archive`, {
    method: "PATCH",
    token
  });
}

export function createThread(
  input: {
    listingId?: string;
    initiatedBy: string;
    participantIds: string[];
    initialMessage?: string;
  },
  token: string
): Promise<MessageThread> {
  return apiRequest<MessageThread>("threads", {
    method: "POST",
    body: input,
    token
  });
}

export function listThreads(token: string): Promise<MessageThread[]> {
  return apiRequest<MessageThread[]>("threads", { token });
}

export function getThread(id: string, token: string): Promise<ThreadDetail> {
  return apiRequest<ThreadDetail>(`threads/${id}`, { token });
}

export function createMessage(
  threadId: string,
  input: {
    senderUserId: string;
    body: string;
  },
  token: string
): Promise<Message> {
  return apiRequest<Message>(`threads/${threadId}/messages`, {
    method: "POST",
    body: input,
    token
  });
}

export function createProposal(
  input: {
    threadId: string;
    proposedBy: string;
    serviceA: string;
    serviceB: string;
    expectedTiming?: string;
    conditions?: string;
  },
  token: string
): Promise<Proposal> {
  return apiRequest<Proposal>("proposals", {
    method: "POST",
    body: input,
    token
  });
}

export function completeAgreement(
  proposalId: string,
  userId: string,
  token: string
): Promise<Proposal> {
  return apiRequest<Proposal>(`agreements/${proposalId}/complete`, {
    method: "POST",
    body: { userId },
    token
  });
}

export function getTrustSummary(userId: string): Promise<TrustSummary> {
  return apiRequest<TrustSummary>(`users/${userId}/trust-summary`);
}

export function getReviewsForUser(userId: string): Promise<Review[]> {
  return apiRequest<Review[]>(`users/${userId}/reviews`);
}

export function createVouch(
  input: {
    voucherUserId: string;
    vouchedUserId: string;
    reason?: string;
  },
  token: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("vouches", {
    method: "POST",
    body: input,
    token
  });
}

export function createReview(
  input: {
    proposalId: string;
    reviewerUserId: string;
    revieweeUserId: string;
    rating: number;
    comment?: string;
  },
  token: string
): Promise<Review> {
  return apiRequest<Review>("reviews", {
    method: "POST",
    body: input,
    token
  });
}

export function createReport(
  input: {
    reporterUserId: string;
    targetType: "user" | "listing" | "message" | "review";
    targetId: string;
    reasonCode: string;
    details?: string;
  },
  token: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("reports", {
    method: "POST",
    body: input,
    token
  });
}

export function createBlock(
  input: {
    blockerUserId: string;
    blockedUserId: string;
  },
  token: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("blocks", {
    method: "POST",
    body: input,
    token
  });
}
