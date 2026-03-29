import { PostgresService } from "@hobby2hobby/postgres";
import {
  resetSchemas,
  startPostgresContainer,
  stopPostgresContainer
} from "../../test-utils/postgres-test-container";
import { MarketplaceRepository } from "./marketplace.repository";

jest.setTimeout(180000);

describe("MarketplaceRepository integration", () => {
  const user1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const user2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

  let connectionString: string;
  let container: Awaited<ReturnType<typeof startPostgresContainer>>["container"];
  let postgres: PostgresService;
  let repository: MarketplaceRepository;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;
    connectionString = started.connectionString;
    process.env.DATABASE_URL = connectionString;
  });

  beforeEach(async () => {
    await resetSchemas(connectionString, ["marketplace"]);
    postgres = new PostgresService();
    repository = new MarketplaceRepository(postgres);
    await repository.onModuleInit();
  });

  afterEach(async () => {
    if (postgres) {
      await postgres.onModuleDestroy();
    }
  });

  afterAll(async () => {
    if (container) {
      await stopPostgresContainer(container);
    }
  });

  it("creates and loads a listing", async () => {
    const listing = await repository.createListing({
      userId: user1,
      listingType: "offer",
      title: "Photography",
      description: "Portrait photos",
      categorySlug: "photography",
      regionSlug: "la",
      serviceMode: "either"
    });

    const loaded = await repository.getListing(listing.id);
    expect(loaded?.title).toBe("Photography");
    expect(loaded?.status).toBe("active");
  });

  it("searches active listings and excludes archived ones", async () => {
    const active = await repository.createListing({
      userId: user1,
      listingType: "offer",
      title: "Guitar Lessons",
      description: "Beginner guitar",
      categorySlug: "music",
      regionSlug: "la",
      serviceMode: "remote"
    });

    const archived = await repository.createListing({
      userId: user2,
      listingType: "offer",
      title: "Archived Guitar",
      description: "Old listing",
      categorySlug: "music",
      regionSlug: "la",
      serviceMode: "remote"
    });

    await repository.archiveListing(archived.id);
    const results = await repository.searchListings({ q: "guitar" });

    expect(results.map((item) => item.id)).toContain(active.id);
    expect(results.map((item) => item.id)).not.toContain(archived.id);
  });
});
