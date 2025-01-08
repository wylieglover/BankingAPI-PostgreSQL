"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const prisma_1 = require("../prisma");
const authMiddleware_1 = require("../middleware/authMiddleware");
const transactions_route_1 = __importDefault(require("./transactions.route"));
const router = (0, express_1.Router)({ mergeParams: true });
;
const accountController = new controllers_1.AccountController(prisma_1.prisma);
// Account routes
router.get('/', accountController.getAllAccountsController);
router.get('/count', accountController.getAccountCount);
router.get('/:accountId', accountController.getAccountByIdController);
router.get('/analytics', accountController.getAccountAnalytics);
router.post('/', (0, authMiddleware_1.validate)(authMiddleware_1.createAccountRules), accountController.createAccountController);
router.put('/:accountId', (0, authMiddleware_1.validate)(authMiddleware_1.updateAccountRules), accountController.updateAccountController);
router.delete('/:accountId', accountController.deleteAccountController);
// Nest transaction routes under accounts
router.use('/:accountId/transactions', transactions_route_1.default);
exports.default = router;
