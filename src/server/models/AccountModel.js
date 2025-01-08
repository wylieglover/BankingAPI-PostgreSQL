"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModel = void 0;
class AccountModel {
    constructor(prisma) {
        this.createAccount = async (data) => {
            try {
                const customer = await this.prisma.customers.findUnique({
                    where: { customer_id: data.customerId },
                });
                if (!customer) {
                    throw new Error('Customer does not exist.');
                }
                const account = await this.prisma.accounts.create({
                    data: {
                        customer_id: data.customerId,
                        type: data.type,
                        balance: data.balance,
                    },
                });
                return account;
            }
            catch (error) {
                console.error('Error creating account:', error);
                throw error;
            }
        };
        this.getAccountTypeDistribution = async () => {
            const distribution = await this.prisma.accounts.groupBy({
                by: ['type'],
                _count: {
                    type: true,
                },
            });
            return distribution.map((entry) => ({
                type: entry.type,
                count: entry._count.type,
            }));
        };
        this.getAverageAccountsPerCustomer = async () => {
            const result = await this.prisma.accounts.groupBy({
                by: ['customer_id'],
                _count: {
                    customer_id: true,
                },
            });
            const totalAccounts = result.reduce((sum, entry) => sum + entry._count.customer_id, 0);
            const totalCustomers = result.length;
            return totalCustomers === 0 ? 0 : totalAccounts / totalCustomers;
        };
        this.getAccountGrowthByMonth = async () => {
            const results = await this.prisma.$queryRaw `
            SELECT
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM accounts
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month DESC;
        `;
            return results.map((row) => ({
                month: row.month,
                count: row.count,
            }));
        };
        this.count = async (dateFilter) => {
            if (!dateFilter) {
                return await this.prisma.accounts.count();
            }
            return await this.prisma.accounts.count({
                where: {
                    created_at: {
                        gte: dateFilter.startDate,
                        lte: dateFilter.endDate,
                    }
                }
            });
        };
        this.getAllAccounts = async (params) => {
            try {
                return await this.prisma.accounts.findMany({
                    where: params.customerId ? { customer_id: params.customerId } : {},
                    include: { transactions: true },
                    skip: (params.page - 1) * params.pageSize,
                    orderBy: { balance: 'asc' },
                });
            }
            catch (error) {
                console.error('Error fetching accounts:', error);
                throw error;
            }
        };
        this.getAccountById = async (accountId) => {
            try {
                console.error(accountId);
                return await this.prisma.accounts.findUnique({
                    where: { account_id: "urn:uuid:" + accountId },
                    include: { transactions: true },
                });
            }
            catch (error) {
                console.error('Error fetching account by accountId:', error);
                throw error;
            }
        };
        this.updateAccount = async (updatedData) => {
            try {
                const existingAccount = await this.prisma.accounts.findUnique({
                    where: { account_id: updatedData.accountId },
                });
                if (!existingAccount) {
                    throw new Error(`Account with ID ${updatedData.accountId} does not exist.`);
                }
                if (updatedData.balance !== undefined && updatedData.balance < 0) {
                    throw new Error('Balance cannot be negative.');
                }
                if (updatedData.type !== undefined && !['savings', 'checking'].includes(updatedData.type)) {
                    throw new Error('Invalid account type. Must be "savings" or "checking".');
                }
                const updatedAccount = await this.prisma.accounts.update({
                    where: { account_id: updatedData.accountId },
                    data: {
                        ...(updatedData.type !== undefined && { type: updatedData.type }),
                        ...(updatedData.balance !== undefined && { balance: updatedData.balance }),
                    },
                });
                return updatedAccount;
            }
            catch (error) {
                console.error('Error updating account:', error);
                throw error;
            }
        };
        this.deleteAccount = async (accountId) => {
            try {
                return await this.prisma.accounts.delete({
                    where: { account_id: accountId },
                });
            }
            catch (error) {
                console.error('Error deleting account:', error);
                throw error;
            }
        };
        this.prisma = prisma;
    }
}
exports.AccountModel = AccountModel;
