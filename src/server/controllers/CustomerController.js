"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const CustomerModel_1 = require("../models/CustomerModel");
const authMiddleware_1 = require("../middleware/authMiddleware");
const express_validator_1 = require("express-validator");
const AuthService_1 = require("../middleware/services/AuthService");
class CustomerController {
    constructor(prisma) {
        this.createCustomerController = async (req, res, next) => {
            try {
                const customerData = req.body;
                const customer = await this.customerModel.createCustomer(customerData);
                customer.password = '';
                const token = AuthService_1.authService.signToken({
                    customer_id: customer.customer_id
                });
                (0, authMiddleware_1.successResponse)(res, 'Customer created', {
                    customer: customer,
                    token,
                }, 201);
            }
            catch (error) {
                next(error);
            }
        };
        this.login = async (req, res, next) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    (0, authMiddleware_1.errorResponse)(res, 'Validation failed', 400);
                    return;
                }
                const { username, password } = req.body;
                if (!username || !password) {
                    (0, authMiddleware_1.errorResponse)(res, 'Username and password are required', 400);
                    return;
                }
                const customer = await this.customerModel.login(username, password);
                if (!customer) {
                    (0, authMiddleware_1.errorResponse)(res, 'Invalid username or password', 401);
                    return;
                }
                const token = AuthService_1.authService.signToken({
                    customer_id: customer.customer_id
                });
                (0, authMiddleware_1.successResponse)(res, 'Login successful', {
                    customer: customer,
                    token,
                }, 200);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerAnalytics = async (req, res, next) => {
            try {
                const [totalCount, newCustomersThisMonth, customersByMonth] = await Promise.all([
                    this.customerModel.count(),
                    this.customerModel.getNewCustomersCount(new Date(new Date().setMonth(new Date().getMonth() - 1))),
                    this.customerModel.getCustomersByMonth()
                ]);
                (0, authMiddleware_1.successResponse)(res, 'Customer analytics retrieved', {
                    totalCount,
                    newCustomersThisMonth,
                    customersByMonth
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerBalanceController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                if (!customerId) {
                    (0, authMiddleware_1.errorResponse)(res, 'Customer ID is required', 400);
                    return;
                }
                const balance = await this.customerModel.getCustomerBalance(customerId);
                (0, authMiddleware_1.successResponse)(res, 'Customer balance retrieved', Number(balance), 200);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerCount = async (req, res, next) => {
            try {
                const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
                const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
                const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;
                const customersCount = await this.customerModel.count(dateFilter);
                (0, authMiddleware_1.successResponse)(res, 'Customers count retrieved', { count: customersCount });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllCustomersController = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page, 10) || 1;
                const pageSize = parseInt(req.query.pageSize, 10) || 10;
                req.params.pa;
                const { customers, total } = await this.customerModel.getAllCustomers({ page, pageSize });
                const sanitizedCustomers = customers.map((c) => ({
                    ...c,
                    password: undefined,
                }));
                (0, authMiddleware_1.successResponse)(res, 'Customers retrieved', {
                    data: sanitizedCustomers,
                    meta: {
                        total,
                        page,
                        pageSize,
                        totalPages: Math.ceil(total / pageSize)
                    }
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getCustomerByIdController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                if (!customerId) {
                    (0, authMiddleware_1.errorResponse)(res, 'Customer ID is required', 400);
                    return;
                }
                const customer = await this.customerModel.getCustomerById(customerId);
                if (!customer) {
                    (0, authMiddleware_1.errorResponse)(res, 'Customer not found', 404);
                    return;
                }
                (0, authMiddleware_1.successResponse)(res, 'Customer retrieved', customer);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCustomerController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                const { name, email, homeAddress, password } = req.body;
                const updateCustomerData = {
                    customerId,
                    name,
                    email,
                    homeAddress,
                    password,
                };
                const customer = await this.customerModel.updateCustomer(updateCustomerData);
                if (!customer) {
                    (0, authMiddleware_1.errorResponse)(res, 'Customer not found', 404);
                    return;
                }
                customer.password = '';
                (0, authMiddleware_1.successResponse)(res, 'Customer updated', customer);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteCustomerController = async (req, res, next) => {
            try {
                const { customerId } = req.params;
                await this.customerModel.deleteCustomer(customerId);
                (0, authMiddleware_1.successResponse)(res, 'Customer deleted successfully', null, 204);
            }
            catch (error) {
                next(error);
            }
        };
        this.customerModel = new CustomerModel_1.CustomerModel(prisma);
    }
}
exports.CustomerController = CustomerController;
