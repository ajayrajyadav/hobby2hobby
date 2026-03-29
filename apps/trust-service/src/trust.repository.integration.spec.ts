import { PostgresService } from "@hobby2hobby/postgres";
import {
  resetSchemas,
  startPostgresContainer,
  stopPostgresContainer
} from "../../test-utils/postgres-test-container";
import { TrustRepository } from "./trust.repository";

jest.setTimeout(180000);

describe("TrustRepository integration", () => {
  const proposal1 = "11111111-1111-1111-1111-111111111111";
  const proposal2 = "22222222-2222-2222-2222-222222222222";
  const user1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const user2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
  const user3 = "cccccccc-cccc-cccc-cccc-cccccccccccc";

  let connectionString: string;
  let container: Awaited<ReturnType<typeof startPostgresContainer>>["container"];
  let postgres: PostgresService;
  let repository: TrustRepository;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;
    connectionString = started.connectionString;
    process.env.DATABASE_URL = connectionString;
  });

  beforeEach(async () => {
    await resetSchemas(connectionString, ["trust"]);
    postgres = new PostgresService();
    repository = new TrustRepository(postgres);
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

  it("creates reviews and computes trust summary", async () => {
    await repository.createReview({
      proposalId: proposal1,
      reviewerUserId: user1,
      revieweeUserId: user2,
      rating: 4,
      comment: "Solid"
    });

    await repository.createReview({
      proposalId: proposal2,
      reviewerUserId: user3,
      revieweeUserId: user2,
      rating: 5
    });

    const summary = await repository.getTrustSummary(user2);

    expect(summary.reviewCount).toBe(2);
    expect(summary.averageRating).toBe(4.5);
  });

  it("enforces unique vouches", async () => {
    const first = await repository.createVouch({
      voucherUserId: user1,
      vouchedUserId: user2,
      reason: "Known locally"
    });

    const duplicate = await repository.createVouch({
      voucherUserId: user1,
      vouchedUserId: user2
    });

    expect(first?.id).toBeTruthy();
    expect(duplicate).toBeNull();
  });
});
