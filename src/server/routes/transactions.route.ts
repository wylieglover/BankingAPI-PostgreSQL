import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { prisma } from '../prisma';
import {
  createTransactionRules,
  updateTransactionRules,
} from '../middleware/validationMiddleware';
import { validate } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });
const transactionController = new TransactionController(prisma);

// Transaction routes
router.get('/', transactionController.getAllTransactionsController);
router.get('/count', transactionController.getCustomerCount);
router.get('/analytics', transactionController.getTransactionAnalytics);
router.get(
  '/:transactionId',
  transactionController.getTransactionByIdController
);
router.post(
  '/',
  validate(createTransactionRules),
  transactionController.createTransactionController
);
router.put(
  '/:transactionId',
  validate(updateTransactionRules),
  transactionController.updateTransactionController
);
router.delete(
  '/:transactionId',
  transactionController.deleteTransactionController
);

export default router;
