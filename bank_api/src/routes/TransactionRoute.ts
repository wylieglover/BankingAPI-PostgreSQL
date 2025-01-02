import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { prisma } from '../prisma';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });
const transactionController = new TransactionController(prisma);

router.use(authenticate);

// Transaction routes
router.get('/', transactionController.getAllTransactionsController);
router.get('/:transactionId', transactionController.getTransactionByIdController);
router.post('/', transactionController.createTransactionController);
router.delete('/:transactionId', transactionController.deleteTransactionController);

export default router;