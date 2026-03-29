import { PostgresService } from "@hobby2hobby/postgres";
import {
  resetSchemas,
  startPostgresContainer,
  stopPostgresContainer
} from "../../test-utils/postgres-test-container";
import { IdentityRepository } from "./identity.repository";

jest.setTimeout(180000);

describe("IdentityRepository integration", () => {
  let connectionString: string;
  let container: Awaited<ReturnType<typeof startPostgresContainer>>["container"];
  let postgres: PostgresService;
  let repository: IdentityRepository;

  beforeAll(async () => {
    const started = await startPostgresContainer();
    container = started.container;
    connectionString = started.connectionString;
    process.env.DATABASE_URL = connectionString;
  });

  beforeEach(async () => {
    await resetSchemas(connectionString, ["identity"]);
    postgres = new PostgresService();
    repository = new IdentityRepository(postgres);
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

  it("creates a user and loads the profile", async () => {
    const profile = await repository.createUser({
      email: "identity@test.com",
      password: "secret",
      displayName: "Identity User"
    });

    const loaded = await repository.findProfileByUserId(profile.userId);

    expect(loaded?.email).toBe("identity@test.com");
    expect(loaded?.displayName).toBe("Identity User");
    expect(loaded?.planType).toBe("free");
  });

  it("returns the password hash and subscription snapshot", async () => {
    const profile = await repository.createUser({
      email: "subscription@test.com",
      password: "secret",
      displayName: "Sub User"
    });

    const auth = await repository.findPasswordHashByEmail("subscription@test.com");
    const subscription = await repository.getSubscription(profile.userId);

    expect(auth?.userId).toBe(profile.userId);
    expect(auth?.passwordHash).toBeTruthy();
    expect(subscription).toEqual({
      userId: profile.userId,
      planType: "free",
      subscriptionStatus: "inactive"
    });
  });

  it("updates profile fields", async () => {
    const profile = await repository.createUser({
      email: "update@test.com",
      password: "secret",
      displayName: "Before"
    });

    const updated = await repository.updateProfile(profile.userId, {
      displayName: "After",
      city: "Los Angeles",
      availabilitySummary: "Weekends"
    });

    expect(updated?.displayName).toBe("After");
    expect(updated?.city).toBe("Los Angeles");
    expect(updated?.availabilitySummary).toBe("Weekends");
  });
});
