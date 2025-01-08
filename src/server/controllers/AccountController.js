"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const models_1 = require("../models");
const prisma_1 = require("../prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
class AccountController {
    constructor(prisma) {
        this.createAccountController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                const { type, balance } = req.body;
                if (typeof customerId !== 'string' || typeof balance !== 'number') {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid input types', 400);
                    return;
                }
                if (!Object.values(prisma_1.account_type).includes(type)) {
                    (0, authMiddleware_1.errorResponse)(res, `Invalid account type. Allowed values: ${Object.values(prisma_1.account_type).join(', ')}`, 400);
                    return;
                }
                const accountData = { customerId, type, balance };
                const account = await this.accountModel.createAccount(accountData);
                (0, authMiddleware_1.successResponse)(res, 'Account created successfully', {
                    accountId: account.account_id,
                    customerId: account.customer_id,
                    type: account.type,
                    balance: `$${account.balance.toFixed(2)}`,
                    createdAt: account.created_at
                        ? new Date(account.created_at).toLocaleString()
                        : null,
                }, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAccountAnalytics = async (req, res, next) => {
            try {
                const [accountTypeDistribution, averageAccountsPerCustomer, accountGrowthByMonth] = await Promise.all([
                    this.accountModel.getAccountTypeDistribution(),
                    this.accountModel.getAverageAccountsPerCustomer(),
                    this.accountModel.getAccountGrowthByMonth()
                ]);
                (0, authMiddleware_1.successResponse)(res, 'Account analytics retrieved', {
                    accountTypeDistribution,
                    averageAccountsPerCustomer,
                    accountGrowthByMonth
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAccountCount = async (req, res, next) => {
            try {
                const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
                const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
                if ((startDate && isNaN(startDate.getTime())) || (endDate && isNaN(endDate.getTime()))) {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid date format', 400);
                    return;
                }
                const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;
                const accountsCount = await this.accountModel.count(dateFilter);
                (0, authMiddleware_1.successResponse)(res, 'Accounts count retrieved', { count: accountsCount });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllAccountsController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                const page = parseInt(req.query.page, 10) || 1;
                const pageSize = parseInt(req.query.pageSize, 10) || 10;
                const params = {
                    customerId,
                    page,
                    pageSize,
                };
                const accounts = await this.accountModel.getAllAccounts(params);
                (0, authMiddleware_1.successResponse)(res, 'Accounts retrieved successfully', accounts);
            }
            catch (error) {
                next(error);
            }
        };
        this.getAccountByIdController = async (req, res, next) => {
            try {
                const { accountId } = req.params;
                if (typeof accountId !== 'string') {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid account ID', 400);
                    return;
                }
                const account = await this.accountModel.getAccountById(accountId);
                if (!account) {
                    (0, authMiddleware_1.errorResponse)(res, 'Account not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Account retrieved successfully', account);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateAccountController = async (req, res, next) => {
            try {
                const { accountId } = req.params;
                if (typeof accountId !== 'string') {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid account ID', 400);
                    return;
                }
                const { type, balance } = req.body;
                if (type && !Object.values(prisma_1.account_type).includes(type)) {
                    (0, authMiddleware_1.errorResponse)(res, `Invalid account type. Allowed: ${Object.values(prisma_1.account_type).join(', ')}`, 400);
                    return;
                }
                if (balance && typeof balance !== 'number') {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid balance type', 400);
                    return;
                }
                const updatedData = { accountId, type, balance };
                const account = await this.accountModel.updateAccount(updatedData);
                if (!account) {
                    (0, authMiddleware_1.errorResponse)(res, 'Account not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Account updated successfully', account);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteAccountController = async (req, res, next) => {
            try {
                const { accountId } = req.params;
                if (typeof accountId !== 'string') {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid account ID', 400);
                    return;
                }
                await this.accountModel.deleteAccount(accountId);
                (0, authMiddleware_1.successResponse)(res, 'Account deleted successfully', null, 204);
            }
            catch (error) {
                next(error);
            }
        };
        this.accountModel = new models_1.AccountModel(prisma);
    }
}
exports.AccountController = AccountController;
