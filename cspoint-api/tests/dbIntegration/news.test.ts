import request from "supertest";
import { app } from "../../src/index";

describe("News API", () => {
  it("should return HLTV RSS news", async () => {
    const response = await request(app).get("/api/v1/news/hltv");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
