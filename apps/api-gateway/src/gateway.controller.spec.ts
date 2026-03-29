import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
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
    ["post", "/api/v1/auth/register", { email: "a@test.com" }, "auth/register"],
    ["post", "/api/v1/auth/login", { email: "a@test.com" }, "auth/login"],
    ["get", "/api/v1/me?userId=u1", undefined, "me?userId=u1"],
    ["get", "/api/v1/profiles/u1", undefined, "profiles/u1"],
    ["patch", "/api/v1/profiles/u1", { displayName: "Ajay" }, "profiles/u1"],
    ["get", "/api/v1/subscriptions/u1", undefined, "subscriptions/u1"],
    ["post", "/api/v1/listings", { title: "T" }, "listings"],
    ["get", "/api/v1/listings", undefined, "listings"],
    ["get", "/api/v1/listings/l1", undefined, "listings/l1"],
    ["patch", "/api/v1/listings/l1/archive", undefined, "listings/l1/archive"],
    ["get", "/api/v1/search?q=test", undefined, "search?q=test"],
    ["post", "/api/v1/threads", { initiatedBy: "u1" }, "threads"],
    ["get", "/api/v1/threads", undefined, "threads"],
    ["get", "/api/v1/threads/t1", undefined, "threads/t1"],
    ["post", "/api/v1/threads/t1/messages", { body: "Hi" }, "threads/t1/messages"],
    ["post", "/api/v1/proposals", { threadId: "t1" }, "proposals"],
    ["post", "/api/v1/agreements/p1/complete", { userId: "u1" }, "agreements/p1/complete"],
    ["post", "/api/v1/reviews", { rating: 5 }, "reviews"],
    ["get", "/api/v1/users/u1/reviews", undefined, "users/u1/reviews"],
    ["post", "/api/v1/vouches", { vouchedUserId: "u2" }, "vouches"],
    ["get", "/api/v1/users/u1/trust-summary", undefined, "users/u1/trust-summary"],
    ["post", "/api/v1/reports", { reasonCode: "spam" }, "reports"],
    ["get", "/api/v1/reports", undefined, "reports"],
    ["post", "/api/v1/blocks", { blockedUserId: "u2" }, "blocks"]
  ] as const;

  it.each(cases)("%s %s proxies to service", async (method, route, body, expectedPath) => {
    const req = request(app.getHttpServer())[method](route);
    if (body) {
      req.send(body);
    }

    await req.expect(method === "post" ? 201 : 200).expect({ ok: true });

    expect(fetchMock).toHaveBeenCalled();
    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain(expectedPath);
  });
});
