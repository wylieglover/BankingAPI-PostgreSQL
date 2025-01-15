import { Request, Response, NextFunction } from "express";
import { TransactionModel } from "../models/TransactionModel";
import { PrismaClient, transaction_type } from "@prisma/client";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionPaginationParams,
} from "../types/transaction";
import { errorResponse, successResponse } from "../middleware/authMiddleware";

export class TransactionController {
  private transactionModel: TransactionModel;

  constructor(prisma: PrismaClient) {
    this.transactionModel = new TransactionModel(prisma);
  }

  createTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const transactionData: CreateTransactionDTO = req.body;

      if (!Object.values(transaction_type).includes(transactionData.type)) {
        errorResponse(
          res,
          `Invalid transaction type. Allowed values: ${Object.values(transaction_type).join(", ")}`,
          400,
        );
        return;
      }

      const transaction =
        await this.transactionModel.createTransaction(transactionData);
      successResponse(res, "Transaction created", transaction, 201);
    } catch (error) {
      next(error);
    }
  };

  getTransactionAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const [
        transactionVolumeByDay,
        transactionsByType,
        averageTransactionAmount,
      ] = await Promise.all([
        this.transactionModel.getTransactionVolumeByDay(),
        this.transactionModel.getTransactionTypeDistribution(),
        this.transactionModel.getAverageTransactionAmount(),
      ]);

      successResponse(res, "Transaction analytics retrieved", {
        transactionVolumeByDay,
        transactionsByType,
        averageTransactionAmount,
      });
    } catch (error) {
      next(error);
    }
  };

  getCustomerCount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const dateFilter =
        startDate || endDate ? { startDate, endDate } : undefined;
      const transactionsCount = await this.transactionModel.count(dateFilter);

      successResponse(res, "Transactions count retrieved", {
        count: transactionsCount,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllTransactionsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
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

      const transactions =
        await this.transactionModel.getAllTransactions(params);
      successResponse(res, "Transactions retrieved", transactions);
    } catch (error) {
      next(error);
    }
  };

  getTransactionByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.transactionId, 10);

      if (isNaN(transactionId)) {
        errorResponse(res, "Invalid transaction ID", 400);
        return;
      }

      const transaction =
        await this.transactionModel.getTransactionById(transactionId);

      if (!transaction) {
        errorResponse(res, "Transaction not found", 404);
        return;
      }

      successResponse(res, "Transaction retrieved", transaction);
    } catch (error) {
      next(error);
    }
  };

  updateTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.transactionId, 10);

      if (isNaN(transactionId)) {
        res.status(400).json({ error: "Invalid transaction ID" });
        return;
      }

      const { type, amount } = req.body;

      if (amount !== undefined && (typeof amount !== "number" || amount <= 0)) {
        errorResponse(res, "Amount must be a positive number", 400);
        return;
      }

      if (type !== undefined && !["deposit", "withdraw"].includes(type)) {
        errorResponse(res, 'Type must be either "deposit" or "withdraw"', 400);
        return;
      }

      const updatedData: UpdateTransactionDTO = {
        transactionId,
        type,
        amount,
      };

      const updatedTransaction =
        await this.transactionModel.updateTransaction(updatedData);

      if (!updatedTransaction) {
        errorResponse(res, "Transaction not found", 404);
        return;
      }

      successResponse(res, "Transaction updated", updatedTransaction);
    } catch (error) {
      next(error);
    }
  };

  deleteTransactionController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.transactionId, 10);
      if (isNaN(transactionId)) {
        errorResponse(res, "Invalid transaction ID", 400);
        return;
      }

      await this.transactionModel.deleteTransaction(transactionId);
      successResponse(res, "Transaction deleted successfully", null, 204);
    } catch (error) {
      next(error);
    }
  };
}
