import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
    private secret: string;

    constructor(secret: string | undefined) {
        this.secret = secret || 'default_secret';
    }

    verifyToken(token: string): jwt.JwtPayload | string {
        return jwt.verify(token, this.secret);
    }
}