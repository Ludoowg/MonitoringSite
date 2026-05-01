const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  monitor: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");

describe("Monitor API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/monitors creates monitor with valid URL", async () => {
    prisma.monitor.create.mockResolvedValue({
      id: "6f7b2902-8b35-49a6-b5b1-9962b8829f10",
      name: "Google",
      url: "https://google.com",
      status: "UNKNOWN",
    });

    const response = await request(app)
      .post("/api/monitors")
      .send({ name: "Google", url: "https://google.com" });

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe("Google");
    expect(prisma.monitor.create).toHaveBeenCalled();
  });

  it("POST /api/monitors rejects invalid URL", async () => {
    const response = await request(app)
      .post("/api/monitors")
      .send({ name: "Broken", url: "not-an-url" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("GET /api/monitors returns list", async () => {
    prisma.monitor.findMany.mockResolvedValue([
      {
        id: "6f7b2902-8b35-49a6-b5b1-9962b8829f10",
        name: "Google",
        url: "https://google.com",
        status: "UNKNOWN",
      },
    ]);

    const response = await request(app).get("/api/monitors");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });
});
