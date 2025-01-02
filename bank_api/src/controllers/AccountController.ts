import { Request, Response, NextFunction } from 'express';
import { AccountModel } from '../models';
import { account_type } from '../prisma';
import { PrismaClient } from '@prisma/client';
import { CreateAccountDTO, UpdateAccountDTO, AccountPaginationParams } from '../types/account';

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
                res.status(400).json({ error: 'Invalid input types' });
                return;
            }

            if (!Object.values(account_type).includes(type)) {
                res.status(400).json({ error: `Invalid account type. Allowed values: ${Object.values(account_type).join(', ')}` });
                return;
            }

            const accountData: CreateAccountDTO = { customerId, type, balance };

            const account = await this.accountModel.createAccount(accountData);
            res.status(201).json({
                message: "Account created successfully",
                data: {
                    accountId: account.account_id,
                    customerId: account.customer_id,
                    type: account.type,
                    balance: `$${account.balance.toFixed(2)}`,
                    createdAt: account.created_at ? new Date(account.created_at).toLocaleString() : null
                }
            });
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
            res.json(accounts);
        } catch (error) {
            next(error);
        }
    }

    getAccountByIdController = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { accountId } = req.params;

            if (typeof accountId !== 'string') {
                res.status(400).json({ error: 'Invalid account ID' });
                return;
            }
            const account = await this.accountModel.getAccountById(accountId);

            if (!account) {
                res.status(404).json({ error: 'Account not found' });
                return;
            }
            res.json(account);
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
                res.status(400).json({ error: 'Invalid account ID' });
                return;
            }

            const { type, balance } = req.body;

            if (type && !Object.values(account_type).includes(type as account_type)) {
                res.status(400).json({ error: 'Invalid account type' });
                return;
            }

            if (balance && typeof balance !== 'number') {
                res.status(400).json({ error: 'Invalid balance type' });
                return;
            }

            const updatedData: UpdateAccountDTO = {
                accountId, type, balance
            };

            const account = await this.accountModel.updateAccount(updatedData);

            if (!account) {
                res.status(404).json({ error: 'Account not found' });
                return;
            }
            res.json(account);
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
                res.status(400).json({ error: 'Invalid account ID' });
                return;
            }

            await this.accountModel.deleteAccount(accountId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
