import { PostgresService } from "@hobby2hobby/postgres";
import {
  resetSchemas,
  startPostgresContainer,
  stopPostgresContainer
} from "../../test-utils/postgres-test-container";
import { MessagingRepository } from "./messaging.repository";

jest.setTimeout(180000);

describe("MessagingRepository integration", () => {
  const user1 = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
  const user2 = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

  let connectionString: string;
  let container: Awaited<ReturnType<typeof startPostgresContainer>>["container"];
  let postgres: PostgresService;
  let repository: MessagingRepository;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;
    connectionString = started.connectionString;
    process.env.DATABASE_URL = connectionString;
  });

  beforeEach(async () => {
    await resetSchemas(connectionString, ["messaging"]);
    postgres = new PostgresService();
    repository = new MessagingRepository(postgres);
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

  it("creates a thread and initial message", async () => {
    const thread = await repository.createThread({
      initiatedBy: user1,
      participantIds: [user2],
      initialMessage: "Hello"
    });

    const loaded = await repository.getThread(thread.id);

    expect(loaded?.thread.participantIds).toEqual([user1, user2]);
    expect(loaded?.messages).toHaveLength(1);
    expect(loaded?.messages[0].body).toBe("Hello");
  });

  it("creates proposal and completes agreement after two confirmations", async () => {
    const thread = await repository.createThread({
      initiatedBy: user1,
      participantIds: [user2]
    });

    const proposal = await repository.createProposal({
      threadId: thread.id,
      proposedBy: user1,
      serviceA: "Photos",
      serviceB: "Lessons"
    });

    expect(proposal?.status).toBe("pending");

    await repository.completeAgreement(proposal!.id, { userId: user1 });
    const completed = await repository.completeAgreement(proposal!.id, { userId: user2 });

    expect(completed?.status).toBe("completed");
    expect(completed?.completedByUserIds).toEqual([user1, user2]);
  });
});
