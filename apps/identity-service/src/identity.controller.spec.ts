import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { IdentityController } from "./identity.controller";
import { IdentityRepository } from "./identity.repository";
import { IdentityService } from "./identity.service";

describe("IdentityController", () => {
  let app: INestApplication;

  const repository = {
    createUser: jest.fn(),
    findPasswordHashByEmail: jest.fn(),
    findProfileByUserId: jest.fn(),
    updateProfile: jest.fn(),
    getSubscription: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IdentityController],
      providers: [
        IdentityService,
        {
          provide: IdentityRepository,
          useValue: repository
        }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /auth/register", async () => {
    repository.createUser.mockResolvedValue({
      userId: "user-1",
      email: "a@test.com",
      displayName: "Ajay",
      planType: "free",
      emailVerified: false
    });

    await request(app.getHttpServer())
      .post("/auth/register")
      .send({ email: "a@test.com", password: "secret", displayName: "Ajay" })
      .expect(201)
      .expect({ userId: "user-1", token: "dev-token-user-1" });
  });

  it("POST /auth/login", async () => {
    const hash = require("crypto").scryptSync("secret", "a@test.com", 64).toString("hex");
    repository.findPasswordHashByEmail.mockResolvedValue({
      userId: "user-1",
      passwordHash: hash
    });

    await request(app.getHttpServer())
      .post("/auth/login")
      .send({ email: "a@test.com", password: "secret" })
      .expect(201)
      .expect({ userId: "user-1", token: "dev-token-user-1" });
  });

  it("GET /me", async () => {
    repository.findProfileByUserId.mockResolvedValue({
      userId: "user-1",
      email: "a@test.com",
      displayName: "Ajay",
      planType: "free",
      emailVerified: false
    });

    await request(app.getHttpServer())
      .get("/me")
      .query({ userId: "user-1" })
      .expect(200)
      .expect((response) => {
        expect(response.body.userId).toBe("user-1");
      });
  });

  it("GET /profiles/:userId", async () => {
    repository.findProfileByUserId.mockResolvedValue({
      userId: "user-2",
      email: "b@test.com",
      displayName: "Bee",
      planType: "paid",
      emailVerified: true
    });

    await request(app.getHttpServer())
      .get("/profiles/user-2")
      .expect(200)
      .expect((response) => {
        expect(response.body.displayName).toBe("Bee");
      });
  });

  it("PATCH /profiles/:userId", async () => {
    repository.updateProfile.mockResolvedValue({
      userId: "user-2",
      email: "b@test.com",
      displayName: "Updated",
      planType: "paid",
      emailVerified: true
    });

    await request(app.getHttpServer())
      .patch("/profiles/user-2")
      .send({ displayName: "Updated" })
      .expect(200)
      .expect((response) => {
        expect(response.body.displayName).toBe("Updated");
      });
  });

  it("GET /subscriptions/:userId", async () => {
    repository.getSubscription.mockResolvedValue({
      userId: "user-2",
      planType: "paid",
      subscriptionStatus: "active"
    });

    await request(app.getHttpServer())
      .get("/subscriptions/user-2")
      .expect(200)
      .expect({
        userId: "user-2",
        planType: "paid",
        subscriptionStatus: "active"
      });
  });
});
