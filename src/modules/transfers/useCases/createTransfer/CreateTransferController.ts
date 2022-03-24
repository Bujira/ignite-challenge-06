import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: sender_id } = request.user;
    const { id: recipient_id } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const result = await createTransferUseCase.execute({
      sender_id,
      recipient_id,
      amount,
      description,
    })

    return response.status(201).json({ message: "Success!", result });
  }
}

export { CreateTransferController }