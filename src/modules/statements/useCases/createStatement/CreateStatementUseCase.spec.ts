import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create UserStatement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("Should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    const user_id = String(user.id);

    const deposit = await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Test - Deposit"
    });

    expect(deposit).toHaveProperty("id");
  });

  it("Should be able to create a withdrawal", async () => {
    const user = await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    const user_id = String(user.id);

    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Test - Deposit"
    });

    const withdraw = await createStatementUseCase.execute({
      user_id,
      type: "withdraw" as OperationType,
      amount: 50,
      description: "Test - Withdrawal"
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("Should not be able to create a deposit for a non existing user", async () => {
    await expect(async () => {
      const user_id = "Invalid User";

      await createStatementUseCase.execute({
        user_id,
        type: "deposit" as OperationType,
        amount: 100,
        description: "Test - Deposit"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a withdrawal for a non existing user", async () => {
    await expect(async () => {
      const user_id = "Invalid User";

      await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "Test - Withdrawal"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to withdrawal with insufficient funds", async () => {
    await expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test - Name",
        email: "Test - Email",
        password: "Test - Password",
      });

      const user_id = String(user.id);

      await createStatementUseCase.execute({
        user_id,
        type: "deposit" as OperationType,
        amount: 100,
        description: "Test - Deposit"
      });

      const withdraw = await createStatementUseCase.execute({
        user_id,
        type: "withdraw" as OperationType,
        amount: 900,
        description: "Test - Withdrawal"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});