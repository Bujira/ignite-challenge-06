import { Connection, createConnection } from "typeorm";

import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;

describe("Autemnthicate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test - User Name",
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    expect(response.body).toHaveProperty("token");
  });

  it("Should not be able to authenticate a non existing user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Eamil 00",
      password: "Test - User Password 00"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });

  it("Should not be able to authenticate a non existing user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Eamil",
      password: "Test - Wrong User Password"
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Incorrect email or password");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});