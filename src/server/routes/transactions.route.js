"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionController_1 = require("../controllers/TransactionController");
const prisma_1 = require("../prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)({ mergeParams: true });
const transactionController = new TransactionController_1.TransactionController(prisma_1.prisma);
// Transaction routes
router.get('/', transactionController.getAllTransactionsController);
router.get('/count', transactionController.getCustomerCount);
router.get('/analytics', transactionController.getTransactionAnalytics);
router.get('/:transactionId', transactionController.getTransactionByIdController);
router.post('/', (0, authMiddleware_1.validate)(authMiddleware_1.createTransactionRules), transactionController.createTransactionController);
router.put('/:transactionId', (0, authMiddleware_1.validate)(authMiddleware_1.updateTransactionRules), transactionController.updateTransactionController);
router.delete('/:transactionId', transactionController.deleteTransactionController);
exports.default = router;
