import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { configureApiTestApp } from "../../test-utils/configure-api-test-app";
import { GatewayController } from "./gateway.controller";
import { GatewayService } from "./gateway.service";

describe("GatewayController", () => {
  let app: INestApplication;
  let fetchMock: jest.Mock;

  beforeAll(async () => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true })
    });

    Object.defineProperty(global, "fetch", {
      configurable: true,
      value: fetchMock
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [GatewayService]
    }).compile();

    app = moduleRef.createNestApplication();
    configureApiTestApp(app);
    await app.init();
  });

  beforeEach(() => {
    fetchMock.mockClear();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true })
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health", async () => {
    await request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect((response) => expect(response.body.status).toBe("ok"));
  });

  const cases = [
    ["post", "/api/v1/auth/register", { email: "a@test.com", password: "secret1", displayName: "Ajay" }, "auth/register", false],
    ["post", "/api/v1/auth/login", { email: "a@test.com", password: "secret1" }, "auth/login", false],
    ["get", "/api/v1/me", undefined, "me", true],
    ["get", "/api/v1/profiles/u1", undefined, "profiles/u1", false],
    ["patch", "/api/v1/profiles/u1", { displayName: "Ajay" }, "profiles/u1", true],
    ["get", "/api/v1/subscriptions/u1", undefined, "subscriptions/u1", true],
    ["post", "/api/v1/listings", { userId: "u1", listingType: "offer", title: "Tt", description: "Valid description", categorySlug: "cat", regionSlug: "la", serviceMode: "either" }, "listings", true],
    ["get", "/api/v1/listings", undefined, "listings", false],
    ["get", "/api/v1/listings/l1", undefined, "listings/l1", false],
    ["patch", "/api/v1/listings/l1/archive", undefined, "listings/l1/archive", true],
    ["get", "/api/v1/search?q=test", undefined, "search?q=test", false],
    ["post", "/api/v1/threads", { initiatedBy: "u1", participantIds: ["u2"], initialMessage: "Hi" }, "threads", true],
    ["get", "/api/v1/threads", undefined, "threads", true],
    ["get", "/api/v1/threads/t1", undefined, "threads/t1", true],
    ["post", "/api/v1/threads/t1/messages", { senderUserId: "u1", body: "Hi" }, "threads/t1/messages", true],
    ["post", "/api/v1/proposals", { threadId: "t1", proposedBy: "u1", serviceA: "A", serviceB: "B" }, "proposals", true],
    ["post", "/api/v1/agreements/p1/complete", { userId: "u1" }, "agreements/p1/complete", true],
    ["post", "/api/v1/reviews", { proposalId: "p1", reviewerUserId: "u1", revieweeUserId: "u2", rating: 5 }, "reviews", true],
    ["get", "/api/v1/users/u1/reviews", undefined, "users/u1/reviews", false],
    ["post", "/api/v1/vouches", { voucherUserId: "u1", vouchedUserId: "u2" }, "vouches", true],
    ["get", "/api/v1/users/u1/trust-summary", undefined, "users/u1/trust-summary", false],
    ["post", "/api/v1/reports", { reporterUserId: "u1", targetType: "listing", targetId: "l1", reasonCode: "spam" }, "reports", true],
    ["get", "/api/v1/reports", undefined, "reports", true],
    ["post", "/api/v1/blocks", { blockerUserId: "u1", blockedUserId: "u2" }, "blocks", true]
  ] as const;

  it.each(cases)("%s %s proxies to service", async (method, route, body, expectedPath, needsAuth) => {
    const req = request(app.getHttpServer())[method](route);
    if (needsAuth) {
      req.set("Authorization", "Bearer dev-token-u1");
    }
    if (body) {
      req.send(body);
    }

    await req.expect(method === "post" ? 201 : 200).expect({ ok: true });

    expect(fetchMock).toHaveBeenCalled();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain(expectedPath);
    if (needsAuth) {
      expect(init.headers.authorization).toBe("Bearer dev-token-u1");
    }
  });
});
