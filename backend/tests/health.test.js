const request = require("supertest");
const app = require("../src/app");

describe("Health API", () => {
  it("GET /api/health should return 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("monitoringsite-backend");
    expect(response.body.timestamp).toBeDefined();
  });
});
