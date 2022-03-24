import { inject, injectable } from "tsyringe";
import { Statement } from "../../../statements/entities/Statement";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

interface IResponse {
  balance: number;
  statement: Statement[];
}

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,
  ) {

  }
  async execute({
    sender_id, recipient_id, amount, description
  }: ICreateTransferDTO): Promise<Statement | undefined> {
    const recipient = await this.usersRepository.findById(recipient_id);

    if (!recipient) {
      throw new CreateTransferError.UserNotFound();
    }

    const senderBalance = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    const insufficientFunds = senderBalance.balance < amount;

    if (insufficientFunds) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const operation = await this.statementsRepository.create({
      user_id: recipient_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      description,
      type: OperationType.WITHDRAW,
    });

    const transfer = await this.statementsRepository.findStatementOperation({
      user_id: recipient_id,
      statement_id: String(operation.id),
    });

    return transfer;
  }
}

export { CreateTransferUseCase }