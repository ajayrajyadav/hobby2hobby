import { Pool } from "pg";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

export interface PostgresTestContext {
  container: StartedTestContainer;
  connectionString: string;
}

export async function startPostgresContainer(): Promise<PostgresTestContext> {
  const container = await new GenericContainer("postgis/postgis:16-3.4")
    .withEnvironment({
      POSTGRES_DB: "hobby2hobby_test",
      POSTGRES_USER: "postgres",
      POSTGRES_PASSWORD: "postgres"
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage("database system is ready to accept connections"))
    .start();

  const connectionString = `postgres://postgres:postgres@${container.getHost()}:${container.getMappedPort(
    5432
  )}/hobby2hobby_test`;

  await waitForDatabase(connectionString);

  return { container, connectionString };
}

export async function stopPostgresContainer(container: StartedTestContainer): Promise<void> {
  await container.stop();
}

export async function resetSchemas(connectionString: string, schemas: string[]): Promise<void> {
  await withRetry(async () => {
    const pool = new Pool({ connectionString });

    try {
      for (const schema of schemas) {
        await pool.query(`drop schema if exists ${schema} cascade`);
      }
    } finally {
      await pool.end();
    }
  });
}

async function waitForDatabase(connectionString: string): Promise<void> {
  await withRetry(async () => {
    const pool = new Pool({ connectionString });

    try {
      await pool.query("select 1");
    } finally {
      await pool.end();
    }
  }, 30, 1000);
}

async function withRetry(
  operation: () => Promise<void>,
  attempts = 10,
  delayMs = 500
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await operation();
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}
