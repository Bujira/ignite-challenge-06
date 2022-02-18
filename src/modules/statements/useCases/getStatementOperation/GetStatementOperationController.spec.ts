import request from "supertest";

import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("Shoulb be able to retrieve a statment by id", async () => {
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

    const deposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 300,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    const statement_id = deposit.body.id;

    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(statement_id);
  });

  it("Should not be able to retrieve a statement by id from a non existing user", async () => {
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

    const deposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 300,
      description: "Test - Deposit Description",
    }).set({
      Authorization: `Bearer ${token}`
    });

    const statement_id = deposit.body.id;

    const invalidToken = "Invalid Token";

    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${invalidToken}`
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("Should not be able to retrieve a statement by id from a non existing statement", async () => {
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

    const statement_id = "Invalid Satement ID";

    const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(500);
    expect(response.body.status).toBe("error");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});