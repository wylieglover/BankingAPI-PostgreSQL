import { Request, Response, NextFunction } from 'express';
import {
  validationResult,
  ValidationError,
  ValidationChain,
} from 'express-validator';
import { Logger } from './utils/Logger';
import { authService } from './services/AuthService';
import rateLimit from 'express-rate-limit';
import { CustomJwtPayload } from '../types/jwt-types';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    code: 429,
    message: 'Too many requests, please try again later.',
  },
  headers: true,
});

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Logger.warn(
        `Malformed authorization header for request: ${req.method} ${req.originalUrl}`
      );
      errorResponse(res, 'Invalid authorization header', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token) as CustomJwtPayload;

    if (!decoded.customer_id) {
      Logger.warn('Token is missing customer_id');
      errorResponse(res, 'Invalid token payload', 401);
      return;
    }

    req.user = decoded;

    next();
  } catch (error) {
    Logger.error('Authentication error:', (error as Error).message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

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
