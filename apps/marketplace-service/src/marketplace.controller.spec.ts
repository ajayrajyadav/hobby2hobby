import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceRepository } from "./marketplace.repository";
import { MarketplaceService } from "./marketplace.service";

describe("MarketplaceController", () => {
  let app: INestApplication;

  const repository = {
    createListing: jest.fn(),
    getListing: jest.fn(),
    listListings: jest.fn(),
    searchListings: jest.fn(),
    archiveListing: jest.fn()
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MarketplaceController],
      providers: [
        MarketplaceService,
        { provide: MarketplaceRepository, useValue: repository }
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

  it("POST /listings", async () => {
    repository.createListing.mockResolvedValue({ id: "listing-1", title: "Photo help", status: "active" });

    await request(app.getHttpServer())
      .post("/listings")
      .send({ title: "Photo help" })
      .expect(201)
      .expect((response) => expect(response.body.id).toBe("listing-1"));
  });

  it("GET /listings", async () => {
    repository.listListings.mockResolvedValue([{ id: "listing-1", title: "Photo help", status: "active" }]);

    await request(app.getHttpServer())
      .get("/listings")
      .expect(200)
      .expect((response) => expect(response.body).toHaveLength(1));
  });

  it("GET /listings/:id", async () => {
    repository.getListing.mockResolvedValue({ id: "listing-1", title: "Photo help", status: "active" });

    await request(app.getHttpServer())
      .get("/listings/listing-1")
      .expect(200)
      .expect((response) => expect(response.body.id).toBe("listing-1"));
  });

  it("GET /search", async () => {
    repository.searchListings.mockResolvedValue([{ id: "listing-2", title: "Guitar lesson", status: "active" }]);

    await request(app.getHttpServer())
      .get("/search")
      .query({ q: "guitar" })
      .expect(200)
      .expect((response) => expect(response.body[0].title).toBe("Guitar lesson"));
  });

  it("PATCH /listings/:id/archive", async () => {
    repository.archiveListing.mockResolvedValue({ id: "listing-1", title: "Photo help", status: "archived" });

    await request(app.getHttpServer())
      .patch("/listings/listing-1/archive")
      .expect(200)
      .expect((response) => expect(response.body.status).toBe("archived"));
  });
});
