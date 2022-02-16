import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("Shoulb be able to retrieve a statment by id", async () => {
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

    const statement_id = String(deposit.id);

    const operation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(operation).toHaveProperty("id");
    expect(operation).toHaveProperty("user_id");
  });

  // it("Should not be able to retrieve a statement by id from a non existing user", async () => {
  //   expect(async () => {
  //     const user = await createUserUseCase.execute({
  //       name: "Test - Name",
  //       email: "Test - Email",
  //       password: "Test - Password",
  //     });

  //     const user_id = String(user.id);

  //     const deposit = await createStatementUseCase.execute({
  //       user_id,
  //       type: "deposit" as OperationType,
  //       amount: 100,
  //       description: "Test - Deposit"
  //     });

  //     const statement_id = String(deposit.id);

  //     await getStatementOperationUseCase.execute({
  //       user_id: "Invalid User",
  //       statement_id,
  //     });
  //   }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  // });

  it("Should not be able to retrieve a statement by id from a non existing statement", async () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "Invalid Statement",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});