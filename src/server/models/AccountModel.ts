import { PrismaClient, accounts } from '@prisma/client';
import { CreateAccountDTO, UpdateAccountDTO, AccountPaginationParams } from '../types/account';

export class AccountModel {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    createAccount = async (
        data: CreateAccountDTO
    ): Promise<accounts> => {
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
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    getAllAccounts = async (
        params: AccountPaginationParams
    ): Promise<accounts[]> => {
        try {
            return await this.prisma.accounts.findMany({
                where: params.customerId ? { customer_id: params.customerId } : {},
                include: { customers: true },
                skip: (params.page - 1) * params.pageSize,
                orderBy: { balance: 'asc' },
            });
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    }

    getAccountById = async (
        accountId: string
    ): Promise<accounts | null> => {
        try {
            return await this.prisma.accounts.findUnique({
                where: { account_id: accountId },
                include: { customers: true },
            });
        } catch (error) {
            console.error('Error fetching account by accountId:', error);
            throw error;
        }
    }

    updateAccount = async (
        updatedData: UpdateAccountDTO
    ): Promise<accounts> => {
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
        } catch (error) {
            console.error('Error updating account:', error);
            throw error;
        }
    };

    deleteAccount = async (
        accountId: string
    ): Promise<accounts> => {
        try {
            return await this.prisma.accounts.delete({
                where: { account_id: accountId },
            });
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    }
}