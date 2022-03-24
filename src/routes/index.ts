import { Router } from 'express';

import { authenticationRouter } from './authentication.routes';
import { usersRouter } from './users.routes';
import { userProfileRouter } from './userProfile.routes';
import { statementRouter } from './statements.routes';
import { transferRouter } from './transfer.routes';

const router = Router();

router.use('/auth', authenticationRouter);
router.use('/users', usersRouter);
router.use('/profile', userProfileRouter);
router.use('/statements', statementRouter);
router.use('/transfers', transferRouter);

export { router };
