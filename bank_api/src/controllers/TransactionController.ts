import { Request, Response, NextFunction } from 'express';
import { TransactionModel } from '../models/TransactionModel';
import { PrismaClient, transaction_type } from '@prisma/client';
import { CreateTransactionDTO, UpdateTransactionDTO, TransactionPaginationParams } from '../types/transaction';

export class TransactionController {
    private transactionModel: TransactionModel;

    constructor(prisma: PrismaClient) {
        this.transactionModel = new TransactionModel(prisma);
    }

    createTransactionController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const transactionData: CreateTransactionDTO = req.body;

            if (!Object.values(transaction_type).includes(transactionData.type)) {
                res.status(400).json({ error: `Invalid account type. Allowed values: ${Object.values(transaction_type).join(', ')}` });
                return;
            }

            const transaction = await this.transactionModel.createTransaction(transactionData);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    };

    getAllTransactionsController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { accountId } = req.params;
            const page = parseInt(req.query.page as string, 10) || 1;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

            const params: TransactionPaginationParams = {
                accountId,
                page,
                pageSize,
            };

            const transactions = await this.transactionModel.getAllTransactions(params);
            res.json(transactions);
        } catch (error) {
            next(error);
        }
    };

    getTransactionByIdController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const transactionId = parseInt(req.params.transactionId, 10);

            if (isNaN(transactionId)) {
                res.status(400).json({ error: 'Invalid transaction ID' });
                return;
            }

            const transaction = await this.transactionModel.getTransactionById(transactionId);

            if (!transaction) {
                res.status(404).json({ error: 'Transaction not found' });
                return;
            }

            res.json(transaction);
        } catch (error) {
            next(error);
        }
    };

    updateTransactionController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const transactionId = parseInt(req.params.transactionId, 10);

            if (isNaN(transactionId)) {
                res.status(400).json({ error: 'Invalid transaction ID' });
                return;
            }

            const { type, amount } = req.body;

            if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
                res.status(400).json({ error: 'Amount must be a positive number' });
                return;
            }

            if (type !== undefined && !['deposit', 'withdraw'].includes(type)) {
                res.status(400).json({ error: 'Type must be either "deposit" or "withdraw"' });
                return;
            }

            const updatedData: UpdateTransactionDTO = {
                transactionId,
                type,
                amount,
            };

            const updatedTransaction = await this.transactionModel.updateTransaction(updatedData);
            res.json(updatedTransaction);
        } catch (error) {
            next(error);
        }
    };

    deleteTransactionController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const transactionId = parseInt(req.params.transactionId, 10);
            if (isNaN(transactionId)) {
                res.status(400).json({ error: 'Invalid transaction ID' });
                return;
            }

            await this.transactionModel.deleteTransaction(transactionId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}