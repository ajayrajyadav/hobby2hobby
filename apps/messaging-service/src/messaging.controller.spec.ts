import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { configureApiTestApp } from "../../test-utils/configure-api-test-app";
import { MessagingController } from "./messaging.controller";
import { MessagingRepository } from "./messaging.repository";
import { MessagingService } from "./messaging.service";

describe("MessagingController", () => {
  let app: INestApplication;

  const repository = {
    createThread: jest.fn(),
    listThreadsForUser: jest.fn(),
    getThread: jest.fn(),
    getProposalById: jest.fn(),
    createMessage: jest.fn(),
    createProposal: jest.fn(),
    completeAgreement: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MessagingController],
      providers: [
        MessagingService,
        { provide: MessagingRepository, useValue: repository }
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

  it("POST /threads", async () => {
    repository.createThread.mockResolvedValue({ id: "thread-1", participantIds: ["u1", "u2"], status: "open" });

    await request(app.getHttpServer())
      .post("/threads")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ initiatedBy: "u1", participantIds: ["u2"], initialMessage: "Hello" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("thread-1"));
  });

  it("GET /threads", async () => {
    repository.listThreadsForUser.mockResolvedValue([{ id: "thread-1", participantIds: ["u1", "u2"], status: "open" }]);

    await request(app.getHttpServer())
      .get("/threads")
      .set("Authorization", "Bearer dev-token-u1")
      .expect(200)
      .expect((response) => expect(response.body).toHaveLength(1));
  });

  it("GET /threads/:id", async () => {
    repository.getThread.mockResolvedValue({
      thread: { id: "thread-1", participantIds: ["u1", "u2"], status: "open" },
      messages: [{ id: "msg-1", threadId: "thread-1", senderUserId: "u1", body: "Hi" }],
      proposals: []
    });

    await request(app.getHttpServer())
      .get("/threads/thread-1")
      .set("Authorization", "Bearer dev-token-u1")
      .expect(200)
      .expect((response) => expect(response.body.thread.id).toBe("thread-1"));
  });

  it("POST /threads/:id/messages", async () => {
    repository.getThread.mockResolvedValue({
      thread: { id: "thread-1", participantIds: ["u1", "u2"], status: "open" },
      messages: [],
      proposals: []
    });
    repository.createMessage.mockResolvedValue({
      id: "msg-1",
      threadId: "thread-1",
      senderUserId: "u1",
      body: "Hi"
    });

    await request(app.getHttpServer())
      .post("/threads/thread-1/messages")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ senderUserId: "u1", body: "Hi" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("msg-1"));
  });

  it("POST /proposals", async () => {
    repository.getThread.mockResolvedValue({
      thread: { id: "thread-1", participantIds: ["u1", "u2"], status: "open" },
      messages: [],
      proposals: []
    });
    repository.createProposal.mockResolvedValue({
      id: "proposal-1",
      threadId: "thread-1",
      proposedBy: "u1",
      serviceA: "Photos",
      serviceB: "Lessons",
      status: "pending",
      completedByUserIds: []
    });

    await request(app.getHttpServer())
      .post("/proposals")
      .set("Authorization", "Bearer dev-token-u1")
      .send({ threadId: "thread-1", proposedBy: "u1", serviceA: "Photos", serviceB: "Lessons" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("proposal-1"));
  });

  it("POST /agreements/:proposalId/complete", async () => {
    repository.getProposalById.mockResolvedValue({
      id: "proposal-1",
      threadId: "thread-1",
      proposedBy: "u1",
      serviceA: "Photos",
      serviceB: "Lessons",
      status: "pending",
      completedByUserIds: ["u1"]
    });
    repository.getThread.mockResolvedValue({
      thread: { id: "thread-1", participantIds: ["u1", "u2"], status: "open" },
      messages: [],
      proposals: []
    });
    repository.completeAgreement.mockResolvedValue({
      id: "proposal-1",
      threadId: "thread-1",
      proposedBy: "u1",
      serviceA: "Photos",
      serviceB: "Lessons",
      status: "completed",
      completedByUserIds: ["u1", "u2"]
    });

    await request(app.getHttpServer())
      .post("/agreements/proposal-1/complete")
      .set("Authorization", "Bearer dev-token-u2")
      .send({ userId: "u2" })
      .expect(201)
      .expect((response) => expect(response.body.status).toBe("completed"));
  });

  it("forbids non-participants from reading threads", async () => {
    repository.getThread.mockResolvedValue({
      thread: { id: "thread-1", participantIds: ["u2", "u3"], status: "open" },
      messages: [],
      proposals: []
    });

    await request(app.getHttpServer())
      .get("/threads/thread-1")
      .set("Authorization", "Bearer dev-token-u1")
      .expect(403);
  });
});
