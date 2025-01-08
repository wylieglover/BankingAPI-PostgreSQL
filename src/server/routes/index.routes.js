"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_route_1 = __importDefault(require("./customers.route"));
const accounts_route_1 = __importDefault(require("./accounts.route"));
const transactions_route_1 = __importDefault(require("./transactions.route"));
const beneficiaries_route_1 = __importDefault(require("./beneficiaries.route"));
const router = (0, express_1.Router)();
// API routes
router.use('/customers', customers_route_1.default);
router.use('/accounts', accounts_route_1.default);
router.use('/transactions', transactions_route_1.default);
router.use('/beneficiaries', beneficiaries_route_1.default);
exports.default = router;
