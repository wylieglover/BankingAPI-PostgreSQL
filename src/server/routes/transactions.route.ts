import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { prisma } from '../prisma';
import { authenticate, validate, createTransactionRules, updateTransactionRules } from '../middleware/authMiddleware';

const router = Router({ mergeParams: true });
const transactionController = new TransactionController(prisma);

router.use(authenticate);

// Transaction routes
router.get('/', transactionController.getAllTransactionsController);
router.get('/:transactionId', transactionController.getTransactionByIdController);
router.post('/', validate(createTransactionRules), transactionController.createTransactionController);
router.put('/:transactionId', validate(updateTransactionRules), transactionController.updateTransactionController);
router.delete('/:transactionId', transactionController.deleteTransactionController);

export default router;