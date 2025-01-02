import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { AccountController } from '../controllers';
import { prisma } from '../prisma';
import { validate, accountValidationRules } from '../middleware/auth';
import transactionRoutes from './TransactionRoute';

const router = Router({ mergeParams: true });;
const accountController = new AccountController(prisma);

router.use(authenticate);

// Account routes
router.get('/', accountController.getAllAccountsController);
router.get('/:accountId', accountController.getAccountByIdController);
router.post('/', validate(accountValidationRules), accountController.createAccountController);
router.put('/:accountId', accountController.updateAccountController);
router.delete('/:accountId', accountController.deleteAccountController);

// Nest transaction routes under accounts
router.use('/:accountId/transactions', transactionRoutes);

export default router;
