import { CustomJwtPayload } from '../../types/jwt-types';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/Logger';
import * as dotenv from 'dotenv';

dotenv.config();

export class AuthService {
    private secret: string;

    constructor(secret: string) {
        if (!secret) {
            throw new Error('JWT_SECRET is not defined');
        }
        this.secret = secret;
    }

    verifyToken(token: string): CustomJwtPayload {
        try {
            // Log token details before verification
            const decoded = jwt.decode(token) as any;
            Logger.debug('Verifying token:', {
                iat: decoded?.iat ? new Date(decoded.iat * 1000).toISOString() : null,
                exp: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
                current: new Date().toISOString()
            });

            return jwt.verify(token, this.secret) as CustomJwtPayload;
        } catch (error) {
            Logger.error('Token verification failed:', {
                error: (error as Error).message,
                type: error?.constructor.name
            });
            throw error;
        }
    }

    signToken(payload: { customer_id: string }): string {
        const token = jwt.sign(
            payload,
            this.secret,
            { expiresIn: '24h' }  // Extended for testing
        );

        // Log token creation details
        const decoded = jwt.decode(token) as any;
        Logger.debug('Token created:', {
            customer_id: payload.customer_id,
            iat: new Date(decoded.iat * 1000).toISOString(),
            exp: new Date(decoded.exp * 1000).toISOString()
        });

        return token;
    }
}

export const authService = new AuthService(process.env.JWT_SECRET || '');