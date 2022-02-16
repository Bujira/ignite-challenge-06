import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create an existing user", async () => {
    await expect(async () => {
      await createUserUseCase.execute({
        name: "Test - Name 1",
        email: "Test - Email",
        password: "Test - Password 1",
      });

      await createUserUseCase.execute({
        name: "Test - Name 2",
        email: "Test - Email",
        password: "Test - Password 2",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});