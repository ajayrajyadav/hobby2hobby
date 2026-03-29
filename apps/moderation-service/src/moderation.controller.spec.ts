import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { configureApiTestApp } from "../../test-utils/configure-api-test-app";
import { ModerationController } from "./moderation.controller";
import { ModerationRepository } from "./moderation.repository";
import { ModerationService } from "./moderation.service";

describe("ModerationController", () => {
  let app: INestApplication;

  const repository = {
    createReport: jest.fn(),
    listReports: jest.fn(),
    createBlock: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ModerationController],
      providers: [
        ModerationService,
        { provide: ModerationRepository, useValue: repository }
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

  it("POST /reports", async () => {
    repository.createReport.mockResolvedValue({
      id: "report-1",
      reporterUserId: "u1",
      targetType: "listing",
      targetId: "listing-1",
      reasonCode: "spam",
      status: "open"
    });

    await request(app.getHttpServer())
      .post("/reports")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ reporterUserId: "u1", targetType: "listing", targetId: "listing-1", reasonCode: "spam" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("report-1"));
  });

  it("GET /reports", async () => {
    repository.listReports.mockResolvedValue([{ id: "report-1", status: "open" }]);

    await request(app.getHttpServer())
      .get("/reports")
      .set("Authorization", "Bearer dev-token-u1")
      .expect(200)
      .expect((response) => expect(response.body).toHaveLength(1));
  });

  it("POST /blocks", async () => {
    repository.createBlock.mockResolvedValue({
      id: "block-1",
      blockerUserId: "u1",
      blockedUserId: "u2"
    });

    await request(app.getHttpServer())
      .post("/blocks")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ blockerUserId: "u1", blockedUserId: "u2" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("block-1"));
  });
});
