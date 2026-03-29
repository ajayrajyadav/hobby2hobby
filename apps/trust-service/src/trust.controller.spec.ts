import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { configureApiTestApp } from "../../test-utils/configure-api-test-app";
import { TrustController } from "./trust.controller";
import { TrustRepository } from "./trust.repository";
import { TrustService } from "./trust.service";

describe("TrustController", () => {
  let app: INestApplication;

  const repository = {
    createReview: jest.fn(),
    getReviewsForUser: jest.fn(),
    createVouch: jest.fn(),
    getTrustSummary: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TrustController],
      providers: [
        TrustService,
        { provide: TrustRepository, useValue: repository }
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    configureApiTestApp(app);
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /reviews", async () => {
    repository.createReview.mockResolvedValue({
      id: "review-1",
      proposalId: "proposal-1",
      reviewerUserId: "u1",
      revieweeUserId: "u2",
      rating: 5
    });

    await request(app.getHttpServer())
      .post("/reviews")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ proposalId: "proposal-1", reviewerUserId: "u1", revieweeUserId: "u2", rating: 5 })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("review-1"));
  });

  it("GET /users/:userId/reviews", async () => {
    repository.getReviewsForUser.mockResolvedValue([{ id: "review-1", revieweeUserId: "u2", rating: 5 }]);

    await request(app.getHttpServer())
      .get("/users/u2/reviews")
      .expect(200)
      .expect((response) => expect(response.body).toHaveLength(1));
  });

  it("POST /vouches", async () => {
    repository.createVouch.mockResolvedValue({
      id: "vouch-1",
      voucherUserId: "u1",
      vouchedUserId: "u2"
    });

    await request(app.getHttpServer())
      .post("/vouches")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ voucherUserId: "u1", vouchedUserId: "u2" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("vouch-1"));
  });

  it("GET /users/:userId/trust-summary", async () => {
    repository.getTrustSummary.mockResolvedValue({
      userId: "u2",
      reviewCount: 1,
      averageRating: 5,
      vouchCount: 1
    });

    await request(app.getHttpServer())
      .get("/users/u2/trust-summary")
      .expect(200)
      .expect((response) => expect(response.body.averageRating).toBe(5));
  });
});
