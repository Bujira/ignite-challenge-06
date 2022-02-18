import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test - User Name",
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create an existing user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test - User Name",
      email: "Test - User Eamil",
      password: "Test - User Password"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});