import { Router } from "express";
import { CreateTransferController } from "../modules/transfers/useCases/createTransfer/CreateTransferController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const transferRouter = Router();

const createTransferController = new CreateTransferController();

transferRouter.post("/:id", ensureAuthenticated, createTransferController.handle);

export { transferRouter };