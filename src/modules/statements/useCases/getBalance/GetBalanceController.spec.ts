import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to retrieve user balance", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test - User Name",
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    const { token } = auth.body;

    const response = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
  });

  it("Should not be able to retrieve balance from a non existing user", async () => {
    const token = "Invalid Token";

    const response = await request(app).get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});