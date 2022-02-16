import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get User Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("Should be able to retrieve user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    const user_id = String(user.id);

    const balance = await getBalanceUseCase.execute({
      user_id
    });

    expect(balance).toHaveProperty("balance");
  });

  it("Should not be able to retrieve balance from a non existing user", async () => {
    expect(async () => {
      const user_id = "Test - Invalid User"

      await getBalanceUseCase.execute({
        user_id
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})