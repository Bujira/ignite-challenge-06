import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be able to create a deposit", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test - User Name 1",
      email: "Test - User Email 1",
      password: "Test - User Password 1",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Email 1",
      password: "Test - User Password 1",
    });

    const { token } = auth.body;

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
    expect(response.body.type).toBe("deposit");
  });

  it("Should be able to create a withdrawal", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test - User Name 2",
      email: "Test - User Email 2",
      password: "Test - User Password 2",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Email 2",
      password: "Test - User Password 2",
    });

    const { token } = auth.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 50,
      description: "Test - Withdrawal Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
    expect(response.body.type).toBe("withdraw");
  });

  it("Should not be able to create a deposit/withdrawal for a non existing user", async () => {
    const token = "Invalid Token";

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("Should not be able to withdrawal with insufficient funds", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test - User Name 3",
      email: "Test - User Email 3",
      password: "Test - User Password 3",
    });

    const auth = await request(app).post("/api/v1/sessions").send({
      email: "Test - User Email 3",
      password: "Test - User Password 3",
    });

    const { token } = auth.body;

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 10000,
      description: "Test - Withdrawal Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Insufficient funds");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});