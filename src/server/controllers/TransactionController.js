"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const TransactionModel_1 = require("../models/TransactionModel");
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
class TransactionController {
    constructor(prisma) {
        this.createTransactionController = async (req, res, next) => {
            try {
                const transactionData = req.body;
                if (!Object.values(client_1.transaction_type).includes(transactionData.type)) {
                    (0, authMiddleware_1.errorResponse)(res, `Invalid transaction type. Allowed values: ${Object.values(client_1.transaction_type).join(', ')}`, 400);
                    return;
                }
                const transaction = await this.transactionModel.createTransaction(transactionData);
                (0, authMiddleware_1.successResponse)(res, 'Transaction created', transaction, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTransactionAnalytics = async (req, res, next) => {
            try {
                const [transactionVolumeByDay, transactionsByType, averageTransactionAmount] = await Promise.all([
                    this.transactionModel.getTransactionVolumeByDay(),
                    this.transactionModel.getTransactionTypeDistribution(),
                    this.transactionModel.getAverageTransactionAmount()
                ]);
                (0, authMiddleware_1.successResponse)(res, 'Transaction analytics retrieved', {
                    transactionVolumeByDay,
                    transactionsByType,
                    averageTransactionAmount
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerCount = async (req, res, next) => {
            try {
                const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
                const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
                const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;
                const transactionsCount = await this.transactionModel.count(dateFilter);
                (0, authMiddleware_1.successResponse)(res, 'Transactions count retrieved', { count: transactionsCount });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllTransactionsController = async (req, res, next) => {
            try {
                const { accountId } = req.params;
                const page = parseInt(req.query.page, 10) || 1;
                const pageSize = parseInt(req.query.pageSize, 10) || 10;
                const params = {
                    accountId,
                    page,
                    pageSize,
                };
                const transactions = await this.transactionModel.getAllTransactions(params);
                (0, authMiddleware_1.successResponse)(res, 'Transactions retrieved', transactions);
            }
            catch (error) {
                next(error);
            }
        };
        this.getTransactionByIdController = async (req, res, next) => {
            try {
                const transactionId = parseInt(req.params.transactionId, 10);
                if (isNaN(transactionId)) {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid transaction ID', 400);
                    return;
                }
                const transaction = await this.transactionModel.getTransactionById(transactionId);
                if (!transaction) {
                    (0, authMiddleware_1.errorResponse)(res, 'Transaction not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Transaction retrieved', transaction);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateTransactionController = async (req, res, next) => {
            try {
                const transactionId = parseInt(req.params.transactionId, 10);
                if (isNaN(transactionId)) {
                    res.status(400).json({ error: 'Invalid transaction ID' });
                    return;
                }
                const { type, amount } = req.body;
                if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
                    (0, authMiddleware_1.errorResponse)(res, 'Amount must be a positive number', 400);
                    return;
                }
                if (type !== undefined && !['deposit', 'withdraw'].includes(type)) {
                    (0, authMiddleware_1.errorResponse)(res, 'Type must be either "deposit" or "withdraw"', 400);
                    return;
                }
                const updatedData = {
                    transactionId,
                    type,
                    amount,
                };
                const updatedTransaction = await this.transactionModel.updateTransaction(updatedData);
                if (!updatedTransaction) {
                    (0, authMiddleware_1.errorResponse)(res, 'Transaction not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Transaction updated', updatedTransaction);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteTransactionController = async (req, res, next) => {
            try {
                const transactionId = parseInt(req.params.transactionId, 10);
                if (isNaN(transactionId)) {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid transaction ID', 400);
                    return;
                }
                await this.transactionModel.deleteTransaction(transactionId);
                (0, authMiddleware_1.successResponse)(res, 'Transaction deleted successfully', null, 204);
            }
            catch (error) {
                next(error);
            }
        };
        this.transactionModel = new TransactionModel_1.TransactionModel(prisma);
    }
}
exports.TransactionController = TransactionController;
