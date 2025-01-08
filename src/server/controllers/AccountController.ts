import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models';
import { account_type } from '../prisma';
import { PrismaClient } from '@prisma/client';
import { CreateAccountDTO, UpdateAccountDTO, AccountPaginationParams } from '../types/account';
import { successResponse, errorResponse } from '../middleware/authMiddleware';

export class AccountController {
    private accountModel: AccountModel;

    constructor(prisma: PrismaClient) {
        this.accountModel = new AccountModel(prisma);
    }

    createAccountController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerId } = req.params;
            const { type, balance } = req.body;

            if (typeof customerId !== 'string' || typeof balance !== 'number') {
                errorResponse(res, 'Invalid input types', 400);
                return;
            }

            if (!Object.values(account_type).includes(type)) {
                errorResponse(
                    res,
                    `Invalid account type. Allowed values: ${Object.values(account_type).join(', ')}`,
                    400
                );
                return;
            }

            const accountData: CreateAccountDTO = { customerId, type, balance };
            const account = await this.accountModel.createAccount(accountData);

            successResponse(
                res,
                'Account created successfully',
                {
                    accountId: account.account_id,
                    customerId: account.customer_id,
                    type: account.type,
                    balance: `$${account.balance.toFixed(2)}`,
                    createdAt: account.created_at
                        ? new Date(account.created_at).toLocaleString()
                        : null,
                },
                201
            );
        } catch (error) {
            next(error);
        }
    }

    getAccountAnalytics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const [
                accountTypeDistribution,
                averageAccountsPerCustomer,
                accountGrowthByMonth
            ] = await Promise.all([
                this.accountModel.getAccountTypeDistribution(),
                this.accountModel.getAverageAccountsPerCustomer(),
                this.accountModel.getAccountGrowthByMonth()
            ]);

            successResponse(res, 'Account analytics retrieved', {
                accountTypeDistribution,
                averageAccountsPerCustomer,
                accountGrowthByMonth
            });
        } catch (error) {
            next(error);
        }
    };

    getAccountCount = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

            if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
                errorResponse(res, 'Invalid date format', 400);
                return;
            }

            const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;
            const accountsCount = await this.accountModel.count(dateFilter);

            successResponse(res, 'Accounts count retrieved', { count: accountsCount });
        } catch (error) {
            next(error);
        }
    }

    getAllAccountsController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { customerId } = req.params;
            const page = parseInt(req.query.page as string, 10) || 1;
            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

            const params: AccountPaginationParams = {
                customerId,
                page,
                pageSize,
            };

            const accounts = await this.accountModel.getAllAccounts(params);
            successResponse(res, 'Accounts retrieved successfully', accounts);
        } catch (error) {
            next(error);
        }
    };

    getAccountByIdController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { accountId } = req.params;

            if (typeof accountId !== 'string') {
                errorResponse(res, 'Invalid account ID', 400);
                return;
            }

            const account = await this.accountModel.getAccountById(accountId);
            if (!account) {
                errorResponse(res, 'Account not found', 404);
                return;
            }

            successResponse(res, 'Account retrieved successfully', account);
        } catch (error) {
            next(error);
        }
    }

    updateAccountController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { accountId } = req.params;

            if (typeof accountId !== 'string') {
                errorResponse(res, 'Invalid account ID', 400);
                return;
            }

            const { type, balance } = req.body;

            if (type && !Object.values(account_type).includes(type as account_type)) {
                errorResponse(
                    res,
                    `Invalid account type. Allowed: ${Object.values(account_type).join(', ')}`,
                    400
                );
                return;
            }

            if (balance && typeof balance !== 'number') {
                errorResponse(res, 'Invalid balance type', 400);
                return;
            }

            const updatedData: UpdateAccountDTO = { accountId, type, balance };
            const account = await this.accountModel.updateAccount(updatedData);

            if (!account) {
                errorResponse(res, 'Account not found', 404);
                return;
            }

            successResponse(res, 'Account updated successfully', account);
        } catch (error) {
            next(error);
        }
    }

    deleteAccountController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { accountId } = req.params;

            if (typeof accountId !== 'string') {
                errorResponse(res, 'Invalid account ID', 400);
                return;
            }

            await this.accountModel.deleteAccount(accountId);
            successResponse(res, 'Account deleted successfully', null, 204);
        } catch (error) {
            next(error);
        }
    }
}