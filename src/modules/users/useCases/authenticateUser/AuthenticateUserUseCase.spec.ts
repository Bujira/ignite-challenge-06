import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("Should be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    const result = await authenticateUserUseCase.execute({
      email: "Test - Email",
      password: "Test - Password",
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate a non existing user", async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: "Test - No Email",
        password: "Test - No Password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with invalid password", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "Test - Name",
        email: "Test - Email",
        password: "Test - Password",
      });

      await authenticateUserUseCase.execute({
        email: "Test - Email",
        password: "Test - Wrong Password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})