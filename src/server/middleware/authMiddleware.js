"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.updateTransactionRules = exports.createTransactionRules = exports.updateAccountRules = exports.createAccountRules = exports.updateBeneficiaryRules = exports.createBeneficiaryRules = exports.updateCustomerRules = exports.createCustomerRules = exports.loginValidationRules = exports.authenticate = void 0;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
const prisma_1 = require("../prisma");
const express_validator_1 = require("express-validator");
const Logger_1 = require("./utils/Logger");
const AuthService_1 = require("./services/AuthService");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            Logger_1.Logger.warn(`Authentication header missing for request: ${req.method} ${req.originalUrl}`);
            errorResponse(res, 'Authentication required', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            Logger_1.Logger.warn(`Token not provided in authorization header for request: ${req.method} ${req.originalUrl}`);
            errorResponse(res, 'Token not provided', 401);
            return;
        }
        const decoded = AuthService_1.authService.verifyToken;
        req.user = decoded;
        next();
    }
    catch (error) {
        Logger_1.Logger.error('Authentication error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
exports.loginValidationRules = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string'),
];
exports.createCustomerRules = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    (0, express_validator_1.body)('homeAddress')
        .trim()
        .notEmpty()
        .withMessage('Home address is required')
        .isString()
        .withMessage('Home address must be a string'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 4 })
        .withMessage('Username must be at least 4 characters long'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
exports.updateCustomerRules = [
    (0, express_validator_1.param)('customerId')
        .notEmpty()
        .withMessage('Customer ID is required')
        .isUUID()
        .withMessage('Customer ID must be a valid UUID'),
    (0, express_validator_1.body)('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty if provided')
        .isString()
        .withMessage('Name must be a string'),
    (0, express_validator_1.body)('email')
        .optional()
        .notEmpty()
        .withMessage('Email cannot be empty if provided')
        .isEmail()
        .withMessage('Invalid email format'),
    (0, express_validator_1.body)('homeAddress')
        .optional()
        .notEmpty()
        .withMessage('Home address cannot be empty if provided'),
    (0, express_validator_1.body)('password')
        .optional()
        .notEmpty()
        .withMessage('Password cannot be empty if provided')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
exports.createBeneficiaryRules = [
    (0, express_validator_1.body)('customerId')
        .notEmpty()
        .withMessage('Customer ID is required')
        .isUUID()
        .withMessage('Customer ID must be a valid UUID'),
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .isLength({ min: 5 })
        .withMessage('Account number must be at least 5 characters long'),
    (0, express_validator_1.body)('bankDetails')
        .notEmpty()
        .withMessage('Bank details are required'),
];
exports.updateBeneficiaryRules = [
    (0, express_validator_1.param)('beneficiaryId')
        .notEmpty()
        .withMessage('Beneficiary ID is required')
        .isUUID()
        .withMessage('Beneficiary ID must be a valid UUID (if stored as UUID in DB)'),
    (0, express_validator_1.body)('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    (0, express_validator_1.body)('accountNumber')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Account number must be at least 5 characters long'),
    (0, express_validator_1.body)('bankDetails')
        .optional()
        .notEmpty()
        .withMessage('Bank details cannot be empty if provided'),
];
exports.createAccountRules = [
    (0, express_validator_1.body)('type')
        .notEmpty()
        .withMessage('Account type is required')
        .isIn(Object.values(prisma_1.account_type))
        .withMessage(`Invalid account type. Allowed: ${Object.values(prisma_1.account_type).join(', ')}`),
    (0, express_validator_1.body)('balance')
        .notEmpty()
        .withMessage('Balance is required')
        .isFloat({ min: 0 })
        .withMessage('Balance must be a positive number'),
    (0, express_validator_1.body)('created_at')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
];
exports.updateAccountRules = [
    (0, express_validator_1.param)('accountId')
        .notEmpty()
        .withMessage('Account ID is required')
        .isUUID()
        .withMessage('Account ID must be a valid UUID'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(Object.values(prisma_1.account_type))
        .withMessage(`Invalid account type. Allowed: ${Object.values(prisma_1.account_type).join(', ')}`),
    (0, express_validator_1.body)('balance')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Balance must be a positive number if provided'),
];
exports.createTransactionRules = [
    (0, express_validator_1.body)('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
    (0, express_validator_1.body)('type')
        .isIn(Object.values(prisma_1.transaction_type))
        .withMessage(`Invalid transaction type. Allowed: ${Object.values(prisma_1.transaction_type).join(', ')}`),
];
exports.updateTransactionRules = [
    (0, express_validator_1.param)('transactionId')
        .notEmpty().withMessage('Transaction ID is required')
        .isInt().withMessage('Transaction ID must be an integer'),
    (0, express_validator_1.body)('type')
        .optional()
        .isIn(Object.values(prisma_1.transaction_type))
        .withMessage(`Invalid transaction type. Allowed: ${Object.values(prisma_1.transaction_type).join(', ')}`),
    (0, express_validator_1.body)('amount')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
];
function bigIntReplacer(key, value) {
    return typeof value === 'bigint' ? value.toString() : value;
}
function successResponse(res, message, data, statusCode = 200) {
    const payload = {
        meta: {
            status: 'success',
            code: statusCode,
            message,
        },
        data,
    };
    return res
        .status(statusCode)
        .type('application/json')
        .send(JSON.stringify(payload, bigIntReplacer, 2));
}
function errorResponse(res, message, statusCode = 400, errors) {
    const payload = {
        meta: {
            status: 'error',
            code: statusCode,
            message,
        },
        errors,
    };
    return res
        .status(statusCode)
        .type('application/json')
        .send(JSON.stringify(payload, bigIntReplacer, 2));
}
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const formattedErrors = errors.array().map((err) => ({
            field: 'type' in err ? err.type : 'unknown',
            message: err.msg,
        }));
        res.status(400).json({ errors: formattedErrors });
    };
};
exports.validate = validate;
