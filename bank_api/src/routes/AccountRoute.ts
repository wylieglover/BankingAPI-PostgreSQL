import { Router } from 'express';
import { AccountController } from '../controllers';
import { prisma } from '../prisma';
import { authenticate, validate, createAccountRules, updateAccountRules } from '../middleware/authMiddleware';
import transactionRoutes from './TransactionRoute';

const router = Router({ mergeParams: true });;
const accountController = new AccountController(prisma);

router.use(authenticate);

// Account routes
router.get('/', accountController.getAllAccountsController);
router.get('/:accountId', accountController.getAccountByIdController);
router.post('/', validate(createAccountRules), accountController.createAccountController);
router.put('/:accountId', validate(updateAccountRules), accountController.updateAccountController);
router.delete('/:accountId', accountController.deleteAccountController);

// Nest transaction routes under accounts
router.use('/:accountId/transactions', transactionRoutes);

export default router;