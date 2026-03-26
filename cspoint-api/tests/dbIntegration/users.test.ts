import request from "supertest";
import { app } from "../../src";
import { initDb } from "../../src/database";

beforeAll(async () => {
  console.log("Running bofore all");
  console.log = () => {};
  await initDb(); //
});

describe("User API", () => {
  let userId: string;

  const newUser = {
    username: "Una",
    email: `john.doe+${Date.now()}@mymail.ie`,
    password: "UserUserUser123!",
    dob: "2001-01-12",
  };

  test("should create a user and return Location header", async () => {
    const res = await request(app)
      .post("/api/v1/users")
      .send(newUser)
      .expect(201);

    userId = res.header["location"];
    expect(userId).toBeDefined();
  });
});
