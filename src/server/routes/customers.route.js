"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../prisma");
const CustomerController_1 = require("../controllers/CustomerController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const accounts_route_1 = __importDefault(require("./accounts.route"));
const beneficiaries_route_1 = __importDefault(require("./beneficiaries.route"));
const router = (0, express_1.Router)();
const customerController = new CustomerController_1.CustomerController(prisma_1.prisma);
// Public routes
router.post('/signup', (0, authMiddleware_1.validate)(authMiddleware_1.createCustomerRules), customerController.createCustomerController); // POST /customers/signup
router.post('/login', (0, authMiddleware_1.validate)(authMiddleware_1.loginValidationRules), customerController.login); // POST /customers/login
// Protected routes
router.get('/', authMiddleware_1.authenticate, customerController.getAllCustomersController); // GET /customers
router.get('/count', customerController.getCustomerCount); // GET /customers/count
router.get('/analytics', authMiddleware_1.authenticate, customerController.getCustomerAnalytics);
router.get('/:customerId/balance', authMiddleware_1.authenticate, customerController.getCustomerBalanceController);
router.get('/:customerId', authMiddleware_1.authenticate, customerController.getCustomerByIdController); // GET /customers/:customerId
router.post('/', authMiddleware_1.authenticate, (0, authMiddleware_1.validate)(authMiddleware_1.createCustomerRules), customerController.createCustomerController); // POST /customers
router.put('/:customerId', authMiddleware_1.authenticate, (0, authMiddleware_1.validate)(authMiddleware_1.updateCustomerRules), customerController.updateCustomerController); // PUT /customers/:customerId
router.delete('/:customerId', authMiddleware_1.authenticate, customerController.deleteCustomerController); // DELETE /customers/:customerId
// Nested routes
router.use('/:customerId/accounts', accounts_route_1.default); // /customers/:customerId/accounts
router.use('/:customerId/beneficiaries', beneficiaries_route_1.default); // /customers/:customerId/beneficiaries
exports.default = router;
