import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';
import { Logger } from './logger';

interface JwtPayload {
    id: string;
    [key: string]: any;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    Logger.error('JWT_SECRET is not defined in environment variables');
    process.exit(1); // Exit the process if JWT_SECRET is missing
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            Logger.warn('Authentication header missing');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            Logger.warn('Token not provided in authorization header');
            res.status(401).json({ error: 'Token not provided' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        req.user = decoded; // Attach the decoded payload to req.user
        next();
    } catch (error) {
        Logger.error('Authentication error: %s', (error as Error).message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const customerValidationRules: ValidationChain[] = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('homeAddress').trim().notEmpty().withMessage('Home address is required'),
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

export const accountValidationRules: ValidationChain[] = [
    body('type')
        .notEmpty()
        .withMessage('Account type is required')
        .isIn(['savings', 'checking'])
        .withMessage('Account type must be either savings or checking'),
    body('balance')
        .notEmpty()
        .withMessage('Balance is required')
        .isFloat({ min: 0 })
        .withMessage('Balance must be a positive number'),
    body('created_at') // Optional field
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
];

import { ValidationChain } from 'express-validator';

export const validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Format the errors to be more user-friendly
        const formattedErrors = errors.array().map((err: ValidationError) => ({
            field: 'type' in err ? err.type : 'unknown',
            message: err.msg,
        }));

        res.status(400).json({ errors: formattedErrors });
    };
};