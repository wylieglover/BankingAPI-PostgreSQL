import { PrismaClient, transactions } from "@prisma/client";
import {
  CreateTransactionDTO,
  UpdateTransactionDTO,
  TransactionPaginationParams,
} from "../types/transaction";

export class TransactionModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createTransaction = async (
    data: CreateTransactionDTO,
  ): Promise<transactions> => {
    try {
      const account = await this.prisma.accounts.findUnique({
        where: { account_id: data.accountId },
      });

      if (!account) {
        throw new Error(`Account with ID ${data.accountId} does not exist.`);
      }

      if (data.amount <= 0) {
        throw new Error("Transaction amount must be greater than zero.");
      }

      return await this.prisma.$transaction(async (prisma) => {
        const transaction = await prisma.transactions.create({
          data: {
            type: data.type,
            amount: data.amount,
            account_id: data.accountId,
          },
        });

        await prisma.accounts.update({
          where: { account_id: data.accountId },
          data: {
            balance: {
              [data.type === "deposit" ? "increment" : "decrement"]:
                data.amount,
            },
          },
        });

        return transaction;
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  };

  getAverageTransactionAmount = async () => {
    const result = await this.prisma.transactions.aggregate({
      _avg: {
        amount: true,
      },
    });

    return result._avg.amount || 0;
  };

  getTransactionTypeDistribution = async () => {
    const distribution = await this.prisma.transactions.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
    });

    return distribution.map((entry) => ({
      type: entry.type,
      count: entry._count.type,
    }));
  };

  getTransactionVolumeByDay = async () => {
    return await this.prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('day', created_at) as day,
                COUNT(*) as count,
                SUM(amount) as volume
            FROM transactions
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY day DESC
            LIMIT 30
        `;
  };

  count = async (dateFilter?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<number> => {
    if (!dateFilter) {
      return await this.prisma.transactions.count();
    }

    return await this.prisma.transactions.count({
      where: {
        timestamp: {
          gte: dateFilter.startDate,
          lte: dateFilter.endDate,
        },
      },
    });
  };

  getAllTransactions = async (
    params: TransactionPaginationParams,
  ): Promise<transactions[]> => {
    try {
      const transactions = await this.prisma.transactions.findMany({
        where: { account_id: params.accountId },
        include: { accounts: true },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
        orderBy: { amount: "asc" },
      });

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  getTransactionById = async (
    transactionId: number,
  ): Promise<transactions | null> => {
    try {
      const transaction = await this.prisma.transactions.findUnique({
        where: { transaction_id: transactionId },
        include: { accounts: true },
      });

      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  };

  updateTransaction = async (
    updateData: UpdateTransactionDTO,
  ): Promise<transactions> => {
    try {
      const existingTransaction = await this.prisma.transactions.findUnique({
        where: { transaction_id: updateData.transactionId },
      });

      if (!existingTransaction) {
        throw new Error(
          `Transaction with ID ${updateData.transactionId} does not exist.`,
        );
      }

      return await this.prisma.$transaction(async (prisma) => {
        if (updateData.type || updateData.amount) {
          const {
            account_id,
            type: oldType,
            amount: oldAmount,
          } = existingTransaction;

          await prisma.accounts.update({
            where: { account_id },
            data: {
              balance: {
                [oldType === "deposit" ? "decrement" : "increment"]: oldAmount,
              },
            },
          });

          if (updateData.amount && updateData.type) {
            await prisma.accounts.update({
              where: { account_id },
              data: {
                balance: {
                  [updateData.type === "deposit" ? "increment" : "decrement"]:
                    updateData.amount,
                },
              },
            });
          }
        }

        const updatedTransaction = await prisma.transactions.update({
          where: { transaction_id: updateData.transactionId },
          data: {
            type: updateData.type ?? existingTransaction.type,
            amount: updateData.amount ?? existingTransaction.amount,
          },
        });

        return updatedTransaction;
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  deleteTransaction = async (transactionId: number): Promise<transactions> => {
    try {
      const transaction = await this.prisma.transactions.findUnique({
        where: { transaction_id: transactionId },
      });

      if (!transaction) {
        throw new Error(`Transaction with ID ${transactionId} does not exist.`);
      }

      return await this.prisma.$transaction(async (prisma) => {
        await prisma.accounts.update({
          where: { account_id: transaction.account_id },
          data: {
            balance: {
              [transaction.type === "deposit" ? "decrement" : "increment"]:
                transaction.amount,
            },
          },
        });

        return await prisma.transactions.delete({
          where: { transaction_id: transactionId },
        });
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };
}
