import { Router } from 'express';
import { AccountController } from '../controllers';
import { prisma } from '../prisma';
import { validate, createAccountRules, updateAccountRules } from '../middleware/authMiddleware';
import transactionRoutes from './transactions.route';

const router = Router({ mergeParams: true });;
const accountController = new AccountController(prisma);

// Account routes
router.get('/', accountController.getAllAccountsController);
router.get('/count', accountController.getAccountCount);
router.get('/:accountId', accountController.getAccountByIdController);
router.get('/analytics', accountController.getAccountAnalytics)
router.post('/', validate(createAccountRules), accountController.createAccountController);
router.put('/:accountId', validate(updateAccountRules), accountController.updateAccountController);
router.delete('/:accountId', accountController.deleteAccountController);

// Nest transaction routes under accounts
router.use('/:accountId/transactions', transactionRoutes);

export default router;