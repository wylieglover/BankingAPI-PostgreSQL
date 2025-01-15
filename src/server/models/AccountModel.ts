import { PrismaClient, accounts } from "@prisma/client";
import {
  CreateAccountDTO,
  UpdateAccountDTO,
  AccountPaginationParams,
} from "../types/account";
import { error } from "console";
import { successResponse } from "@middleware/authMiddleware";

export class AccountModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createAccount = async (data: CreateAccountDTO): Promise<accounts> => {
    try {
      const customer = await this.prisma.customers.findUnique({
        where: { customer_id: data.customerId },
      });

      if (!customer) {
        throw new Error("Customer does not exist.");
      }
      const account = await this.prisma.accounts.create({
        data: {
          customer_id: data.customerId,
          type: data.type,
          balance: data.balance,
        },
      });

      return account;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };

  getAccountTypeDistribution = async () => {
    const distribution = await this.prisma.accounts.groupBy({
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

  getAverageAccountsPerCustomer = async () => {
    const result = await this.prisma.accounts.groupBy({
      by: ["customer_id"],
      _count: {
        customer_id: true,
      },
    });

    const totalAccounts = result.reduce(
      (sum, entry) => sum + entry._count.customer_id,
      0,
    );
    const totalCustomers = result.length;

    return totalCustomers === 0 ? 0 : totalAccounts / totalCustomers;
  };

  getAccountGrowthByMonth = async () => {
    const results = await this.prisma.$queryRaw<
      { month: Date; count: number }[]
    >`
            SELECT
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM accounts
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month DESC;
        `;

    return results.map((row: { month: Date; count: number }) => ({
      month: row.month,
      count: row.count,
    }));
  };

  count = async (dateFilter?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<number> => {
    if (!dateFilter) {
      return await this.prisma.accounts.count();
    }

    return await this.prisma.accounts.count({
      where: {
        created_at: {
          gte: dateFilter.startDate,
          lte: dateFilter.endDate,
        },
      },
    });
  };

  getAllAccounts = async (
    params: AccountPaginationParams,
  ): Promise<accounts[]> => {
    try {
      return await this.prisma.accounts.findMany({
        where: params.customerId ? { customer_id: params.customerId } : {},
        include: { transactions: true },
        skip: (params.page - 1) * params.pageSize,
        orderBy: { balance: "asc" },
      });
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  };

  getAccountById = async (accountId: string): Promise<accounts | null> => {
    try {
      console.error(accountId);
      return await this.prisma.accounts.findUnique({
        where: { account_id: "urn:uuid:" + accountId },
        include: { transactions: true },
      });
    } catch (error) {
      console.error("Error fetching account by accountId:", error);
      throw error;
    }
  };

  updateAccount = async (updatedData: UpdateAccountDTO): Promise<accounts> => {
    try {
      const existingAccount = await this.prisma.accounts.findUnique({
        where: { account_id: updatedData.accountId },
      });

      if (!existingAccount) {
        throw new Error(
          `Account with ID ${updatedData.accountId} does not exist.`,
        );
      }

      if (updatedData.balance !== undefined && updatedData.balance < 0) {
        throw new Error("Balance cannot be negative.");
      }

      if (
        updatedData.type !== undefined &&
        !["savings", "checking"].includes(updatedData.type)
      ) {
        throw new Error(
          'Invalid account type. Must be "savings" or "checking".',
        );
      }

      const updatedAccount = await this.prisma.accounts.update({
        where: { account_id: updatedData.accountId },
        data: {
          ...(updatedData.type !== undefined && { type: updatedData.type }),
          ...(updatedData.balance !== undefined && {
            balance: updatedData.balance,
          }),
        },
      });

      return updatedAccount;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
  };

  deleteAccount = async (accountId: string): Promise<accounts> => {
    try {
      return await this.prisma.accounts.delete({
        where: { account_id: accountId },
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };
}
