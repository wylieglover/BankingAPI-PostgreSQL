import { account_type, transaction_type } from '../prisma';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError, ValidationChain, param } from 'express-validator';
import { Logger } from './utils/Logger';
import { authService } from './services/AuthService';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            Logger.warn(`Authentication header missing for request: ${req.method} ${req.originalUrl}`);
            errorResponse(res, 'Authentication required', 401);
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            Logger.warn(`Token not provided in authorization header for request: ${req.method} ${req.originalUrl}`);
            errorResponse(res, 'Token not provided', 401);
            return;
        }

        const decoded = authService.verifyToken;
        req.user = decoded;

        next();
    } catch (error) {
        Logger.error('Authentication error:', (error as Error).message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const loginValidationRules = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password must be a string'),
];

export const createCustomerRules: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),

    body('homeAddress')
        .trim()
        .notEmpty()
        .withMessage('Home address is required')
        .isString()
        .withMessage('Home address must be a string'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 4 })
        .withMessage('Username must be at least 4 characters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const updateCustomerRules: ValidationChain[] = [
    param('customerId')
        .notEmpty()
        .withMessage('Customer ID is required')
        .isUUID()
        .withMessage('Customer ID must be a valid UUID'),

    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty if provided')
        .isString()
        .withMessage('Name must be a string'),

    body('email')
        .optional()
        .notEmpty()
        .withMessage('Email cannot be empty if provided')
        .isEmail()
        .withMessage('Invalid email format'),

    body('homeAddress')
        .optional()
        .notEmpty()
        .withMessage('Home address cannot be empty if provided'),

    body('password')
        .optional()
        .notEmpty()
        .withMessage('Password cannot be empty if provided')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const createBeneficiaryRules: ValidationChain[] = [
    body('customerId')
        .notEmpty()
        .withMessage('Customer ID is required')
        .isUUID()
        .withMessage('Customer ID must be a valid UUID'),

    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),

    body('accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .isLength({ min: 5 })
        .withMessage('Account number must be at least 5 characters long'),

    body('bankDetails')
        .notEmpty()
        .withMessage('Bank details are required'),
];

export const updateBeneficiaryRules: ValidationChain[] = [
    param('beneficiaryId')
        .notEmpty()
        .withMessage('Beneficiary ID is required')
        .isUUID()
        .withMessage('Beneficiary ID must be a valid UUID (if stored as UUID in DB)'),

    body('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),

    body('accountNumber')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Account number must be at least 5 characters long'),

    body('bankDetails')
        .optional()
        .notEmpty()
        .withMessage('Bank details cannot be empty if provided'),
];

export const createAccountRules: ValidationChain[] = [
    body('type')
        .notEmpty()
        .withMessage('Account type is required')
        .isIn(Object.values(account_type))
        .withMessage(`Invalid account type. Allowed: ${Object.values(account_type).join(', ')}`),
    body('balance')
        .notEmpty()
        .withMessage('Balance is required')
        .isFloat({ min: 0 })
        .withMessage('Balance must be a positive number'),
    body('created_at')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
];

export const updateAccountRules: ValidationChain[] = [
    param('accountId')
        .notEmpty()
        .withMessage('Account ID is required')
        .isUUID()
        .withMessage('Account ID must be a valid UUID'),

    body('type')
        .optional()
        .isIn(Object.values(account_type))
        .withMessage(`Invalid account type. Allowed: ${Object.values(account_type).join(', ')}`),

    body('balance')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Balance must be a positive number if provided'),
];

export const createTransactionRules = [
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
    body('type')
        .isIn(Object.values(transaction_type))
        .withMessage(`Invalid transaction type. Allowed: ${Object.values(transaction_type).join(', ')}`),
];

export const updateTransactionRules: ValidationChain[] = [
    param('transactionId')
        .notEmpty().withMessage('Transaction ID is required')
        .isInt().withMessage('Transaction ID must be an integer'),

    body('type')
        .optional()
        .isIn(Object.values(transaction_type))
        .withMessage(`Invalid transaction type. Allowed: ${Object.values(transaction_type).join(', ')}`),

    body('amount')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number'),
];

function bigIntReplacer(key: string, value: any) {
    return typeof value === 'bigint' ? value.toString() : value;
}

export function successResponse<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode = 200
) {
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

export function errorResponse(
    res: Response,
    message: string,
    statusCode = 400,
    errors?: { field: string; message: string }[]
) {
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

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const formattedErrors = errors.array().map((err: ValidationError) => ({
            field: 'type' in err ? err.type : 'unknown',
            message: err.msg,
        }));

        res.status(400).json({ errors: formattedErrors });
    };
};