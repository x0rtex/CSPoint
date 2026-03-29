import request from "supertest";

import { app } from "../../src";

beforeAll(async () => {
  console.log("Running before all");
  console.log = () => {};
});

describe("Basic server running and answering ping", () => {
  test("Testing the ping", async () => {
    const res = await request(app).get("/health");
    expect(res.body).toEqual({ status: "ok" });
  });
});

afterAll(async () => {
  // noinspection SillyAssignmentJS
  console.log = console.log;
});
