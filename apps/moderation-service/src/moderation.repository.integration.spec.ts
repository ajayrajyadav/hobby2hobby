import { PostgresService } from "@hobby2hobby/postgres";
import {
  resetSchemas,
  startPostgresContainer,
  stopPostgresContainer
} from "../../test-utils/postgres-test-container";
import { ModerationRepository } from "./moderation.repository";

jest.setTimeout(180000);

describe("ModerationRepository integration", () => {
  const user1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const user2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
  const listing1 = "11111111-1111-1111-1111-111111111111";

  let connectionString: string;
  let container: Awaited<ReturnType<typeof startPostgresContainer>>["container"];
  let postgres: PostgresService;
  let repository: ModerationRepository;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;
    connectionString = started.connectionString;
    process.env.DATABASE_URL = connectionString;
  });

  beforeEach(async () => {
    await resetSchemas(connectionString, ["moderation"]);
    postgres = new PostgresService();
    repository = new ModerationRepository(postgres);
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

  it("creates and lists reports", async () => {
    await repository.createReport({
      reporterUserId: user1,
      targetType: "listing",
      targetId: listing1,
      reasonCode: "spam"
    });

    const reports = await repository.listReports();

    expect(reports).toHaveLength(1);
    expect(reports[0].reasonCode).toBe("spam");
  });

  it("enforces unique blocks", async () => {
    const first = await repository.createBlock({
      blockerUserId: user1,
      blockedUserId: user2
    });

    const duplicate = await repository.createBlock({
      blockerUserId: user1,
      blockedUserId: user2
    });

    expect(first?.id).toBeTruthy();
    expect(duplicate).toBeNull();
  });
});
