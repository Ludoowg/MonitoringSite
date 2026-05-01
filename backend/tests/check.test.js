const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  monitor: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  check: {
    create: jest.fn(),
  },
}));

jest.mock("../src/services/httpCheck.service", () => ({
  runHttpCheck: jest.fn(),
}));

const prisma = require("../src/config/prisma");
const { runHttpCheck } = require("../src/services/httpCheck.service");

describe("Check API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/monitors/:id/check runs check and creates Check", async () => {
    const monitorId = "6f7b2902-8b35-49a6-b5b1-9962b8829f10";
    prisma.monitor.findUnique.mockResolvedValue({
      id: monitorId,
      name: "Google",
      url: "https://google.com",
      status: "UNKNOWN",
    });

    runHttpCheck.mockResolvedValue({
      status: "UP",
      statusCode: 200,
      responseTimeMs: 120,
      errorMessage: null,
    });

    prisma.check.create.mockResolvedValue({
      id: "7f7b2902-8b35-49a6-b5b1-9962b8829f11",
      monitorId,
      status: "UP",
      statusCode: 200,
      responseTimeMs: 120,
      errorMessage: null,
      checkedAt: new Date().toISOString(),
    });

    prisma.monitor.update.mockResolvedValue({
      id: monitorId,
      name: "Google",
      url: "https://google.com",
      status: "UP",
    });

    const response = await request(app).post(`/api/monitors/${monitorId}/check`);

    expect(response.statusCode).toBe(200);
    expect(response.body.monitor.status).toBe("UP");
    expect(response.body.check.status).toBe("UP");
    expect(prisma.check.create).toHaveBeenCalled();
  });
});
