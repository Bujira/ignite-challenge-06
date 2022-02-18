import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("Should be able to show the profile of an authenticated user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test - Name",
      email: "Test - Email",
      password: "Test - Password",
    });

    const result = await showUserProfileUseCase.execute(String(user.id));

    expect(result).toHaveProperty("id");
  });

  it("Should not be able to show the profile of a non existing user", async () => {
    await expect(async () => {
      const user_id = "Invalid User";

      await showUserProfileUseCase.execute(user_id);

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
})