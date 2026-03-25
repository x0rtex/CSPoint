import request from "supertest";

import { app } from "../../src";

beforeAll(async () => {
  console.log("Running before all");
  console.log = () => {};
});

describe("Basic server running and answering ping", () => {
  test("Testing the ping", async () => {
    const res = await request(app).get("/ping");
    expect(res.body).toEqual({ message: "Hello from Alekss !!" });
  });
});

afterAll(async () => {
  // noinspection SillyAssignmentJS
  console.log = console.log;
});
